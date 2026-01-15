
import React from 'react';

const CodeBlock: React.FC<{ children: React.ReactNode, lang: string }> = ({ children, lang }) => (
    <pre className="bg-gray-900 rounded-md p-4 my-2 text-sm text-gray-300 overflow-x-auto">
        <code className={`language-${lang}`}>{children}</code>
    </pre>
);

export const WebhookInfo: React.FC = () => {
    const webhookUrl = 'https://zlkpkcxeplxavplpvqua.supabase.co/functions/v1/webhook-company';
    
    const curlExample = `curl -X POST '${webhookUrl}' \\
-H "Content-Type: application/json" \\
-H "x-company-name: ExampleCorp" \\
-H "x-webhook-apikey: YOUR_WEBHOOK_SECRET" \\
-d '{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "+15551234567",
  "job_title": "Director of Logistics",
  "custom_field1": "https://linkedin.com/in/janedoe",
  "custom_field2": "Experienced logistics professional...\\n\\nAdditional Emails:\\nj.doe@personal.com",
  "company_overview": "ExampleCorp is a leading provider of logistics solutions...",
  "tenant_subdomain": "your-unique-tenant-id"
}'`;

    return (
        <div className="mt-6 p-5 border border-gray-700 rounded-lg bg-gray-900/50 space-y-4">
            <h4 className="text-lg font-semibold text-teal-400 text-center uppercase tracking-wider">Webhook API Documentation</h4>
            
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                <p className="text-gray-400 text-sm">
                    This tool pushes enriched lead intelligence to the endpoint below. Authentication is mandatory via the API key header.
                </p>
            </div>

            <div>
                <h5 className="font-semibold text-gray-200">Endpoint URL</h5>
                <CodeBlock lang="text">{webhookUrl}</CodeBlock>
            </div>
            
            <div>
                 <h5 className="font-semibold text-gray-200">Authentication & Headers</h5>
                 <ul className="text-gray-400 text-sm list-disc list-inside space-y-2 mt-2">
                     <li><code className="bg-gray-700 text-xs p-1 rounded">Content-Type: application/json</code></li>
                     <li><code className="bg-gray-700 text-xs p-1 rounded">x-company-name: [Query Company]</code></li>
                     <li>
                        <code className="bg-teal-900/40 text-teal-300 px-1.5 py-0.5 rounded font-bold border border-teal-500/30">x-webhook-apikey</code>: 
                        <span className="ml-2 text-gray-300 italic">Your tenant's webhook_secret</span>
                     </li>
                 </ul>
            </div>

            <div>
                 <h5 className="font-semibold text-gray-200">Data Payload Schema</h5>
                 <ul className="text-gray-400 text-sm grid grid-cols-2 gap-2 mt-2">
                     <li><code className="bg-gray-800 p-1 rounded">name</code></li>
                     <li><code className="bg-gray-800 p-1 rounded">email</code></li>
                     <li><code className="bg-gray-800 p-1 rounded">phone</code></li>
                     <li><code className="bg-gray-800 p-1 rounded">job_title</code></li>
                     <li><code className="bg-gray-800 p-1 rounded">custom_field1</code> (LinkedIn)</li>
                     <li><code className="bg-gray-800 p-1 rounded">custom_field2</code> (Bio/Extra)</li>
                     <li><code className="bg-gray-800 p-1 rounded">company_overview</code></li>
                     <li><code className="bg-gray-800 p-1 rounded">tenant_subdomain</code></li>
                 </ul>
            </div>

            <div>
                 <h5 className="font-semibold text-gray-200">Example cURL Request</h5>
                <CodeBlock lang="bash">{curlExample}</CodeBlock>
            </div>
        </div>
    );
};
