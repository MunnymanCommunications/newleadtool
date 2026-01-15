
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { Lead, GroundingChunk, EnrichedData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ResearchResult {
  overview: string;
  leads: Lead[];
  sources: GroundingChunk[];
}

const generatePrompt = (company: string, location: string): string => {
  return `
    You are a Master Lead Scout AI. Your mission is to identify the highest-value decision-makers at "${company}" ${location ? `located in ${location}` : ''}.
    
    **STRATEGIC OBJECTIVE:**
    Find the specific individuals responsible for fleet management, logistics, facility maintenance, operations, and procurement.

    **SEARCH PARAMETERS:**
    1. Search official company "Team" or "Leadership" pages.
    2. Deep dive into LinkedIn profiles indexed in Google Search for: "Fleet Manager", "Logistics Director", "Maintenance Supervisor", "VP Operations", "Head of Procurement".
    3. Look for recent press releases or industry news mentioning names and titles at ${company}.

    **OUTPUT FORMAT (MANDATORY JSON):**
    {
      "overview": "A concise, high-impact intelligence summary including company size, industry presence, and 2-3 specific 'hooks' for outreach based on recent activities.",
      "contacts": [
        {
          "name": "Full Name",
          "role": "Specific Job Title",
          "email": "Official or reconstructed email (if found)",
          "phone": "Direct or office line (if found)",
          "isPrimaryTarget": true/false (true if role is in Fleet, Logistics, Maintenance, or Operations)
        }
      ]
    }

    **STRICT RULES:**
    - Only return valid JSON. No markdown backticks.
    - If a field is unknown, use "Not Found".
  `;
}

export const findCompanyLeads = async (company: string, location: string): Promise<ResearchResult> => {
  const prompt = generatePrompt(company, location);

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{googleSearch: {}}],
    },
  });

  const rawText = response.text;
  let researchData: { overview: string; contacts: Lead[] } = { overview: '', contacts: [] };
  
  try {
    const startIndex = rawText.indexOf('{');
    const endIndex = rawText.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
        const jsonString = rawText.substring(startIndex, endIndex + 1);
        researchData = JSON.parse(jsonString);
    }
  } catch (e) {
    console.error("Lead Scout failed:", e);
    throw new Error("Lead discovery failed to produce valid data.");
  }

  const allLeads = researchData.contacts || [];
  const filteredLeads = allLeads.filter(lead => lead.name && lead.name.toLowerCase() !== 'not found');
  const sortedLeads = filteredLeads.sort((a, b) => (b.isPrimaryTarget ? 1 : 0) - (a.isPrimaryTarget ? 1 : 0));
  const sources: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  
  return { overview: researchData.overview || 'Overview unavailable.', leads: sortedLeads, sources };
};

const generateEnrichmentPrompt = (name: string, role: string, company: string): string => {
  return `
    You are the "Digital Detective" AI agent. You have one target to unmask and verify.
    
    **TARGET:**
    - Name: ${name}
    - Role: ${role}
    - Company: ${company}

    **DETECTIVE TASKS:**
    1. Search data aggregators (ContactOut, Apollo, RocketReach, ZoomInfo) for professional footprints.
    2. **UNMASKING LOGIC:** If you find masked patterns like "j.doe@company.com" or "john***@company.com", identify the company's email format (e.g., first.last@company.com) and reconstruct the target's full email.
    3. Find their specific LinkedIn Profile URL.
    4. Search for direct-dial numbers or mobile numbers listed in snippets.

    **OUTPUT FORMAT (STRICT JSON):**
    {
      "summary": "1-2 sentence bio focusing on their tenure and area of expertise at ${company}.",
      "linkedinUrl": "Full URL",
      "emails": [ { "value": "email", "confidence": "high|medium|low" } ],
      "phones": [ { "value": "phone", "confidence": "high|medium|low" } ]
    }

    Return ONLY JSON.
  `;
}

export const enrichLead = async (name: string, role: string, company: string): Promise<EnrichedData> => {
  const prompt = generateEnrichmentPrompt(name, role, company);

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{googleSearch: {}}],
    },
  });

  const rawText = response.text;
  try {
    const startIndex = rawText.indexOf('{');
    const endIndex = rawText.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
        const jsonString = rawText.substring(startIndex, endIndex + 1);
        const parsed = JSON.parse(jsonString);
        return {
            summary: parsed.summary,
            linkedinUrl: parsed.linkedinUrl === 'Not Found' ? undefined : parsed.linkedinUrl,
            emails: Array.isArray(parsed.emails) ? parsed.emails : [],
            phones: Array.isArray(parsed.phones) ? parsed.phones : [],
        };
    }
  } catch (e) {
    console.error("Enrichment detective failed:", e);
  }
  
  return { emails: [], phones: [] };
};
