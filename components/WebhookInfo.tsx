
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
-H "x-webhook-apikey: 5749a53df3dfd89a443e4de1becfc63f6e971eb57de75445206834d23735c426" \\
-d '{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "+15551234567",
  "job_title": "Director of Logistics",
  "custom_field1": "https://linkedin.com/in/janedoe",
  "custom_field2": "Experienced logistics professional...",
  "company_overview": "ExampleCorp is a leading provider...",
  "tenant_subdomain": "tenant-123"
}'`;

    return (
        <div className="mt-6 p-5 border border-gray-700 rounded-lg bg-gray-900/50 space-y-4">
            <h4 className="text-lg font-semibold text-teal-400 text-center uppercase tracking-wider">Webhook API Documentation</h4>
            
            <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                <p className="text-amber-300 text-sm font-bold">
                    ⚠️ CRITICAL CONFIGURATION STEP:
                </p>
                <p className="text-gray-300 text-xs mt-1">
                    Environment variables in the browser MUST start with <code className="bg-amber-900/50 px-1 rounded text-white">VITE_</code>. 
                    Please name your variable <code className="bg-teal-900 px-1 rounded text-white">VITE_WEBHOOK_SECRET</code> in your environment settings.
                </p>
            </div>

            <div>
                <h5 className="font-semibold text-gray-200">Endpoint URL</h5>
                <CodeBlock lang="text">{webhookUrl}</CodeBlock>
            </div>
            
            <div>
                 <h5 className="font-semibold text-gray-200">Required Headers</h5>
                 <ul className="text-gray-400 text-sm list-disc list-inside space-y-2 mt-2">
                     <li><code className="bg-gray-700 text-xs p-1 rounded">Content-Type: application/json</code></li>
                     <li><code className="bg-gray-700 text-xs p-1 rounded">x-company-name: [Company Name]</code></li>
                     <li>
                        <code className="bg-teal-900 text-teal-200 px-1.5 py-0.5 rounded font-bold border border-teal-500/50">x-webhook-apikey</code>: 
                        <span className="ml-2 text-gray-300 italic">Your VITE_WEBHOOK_SECRET value</span>
                     </li>
                 </ul>
            </div>

            <div>
                 <h5 className="font-semibold text-gray-200">Data Schema</h5>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                     <span className="text-xs text-gray-400"><code className="text-teal-400">name</code>: String</span>
                     <span className="text-xs text-gray-400"><code className="text-teal-400">email</code>: String</span>
                     <span className="text-xs text-gray-400"><code className="text-teal-400">phone</code>: String</span>
                     <span className="text-xs text-gray-400"><code className="text-teal-400">job_title</code>: String</span>
                     <span className="text-xs text-gray-400"><code className="text-teal-400">custom_field1</code>: LinkedIn</span>
                     <span className="text-xs text-gray-400"><code className="text-teal-400">company_overview</code>: Text</span>
                 </div>
            </div>

            <div>
                 <h5 className="font-semibold text-gray-200">Example Request</h5>
                <CodeBlock lang="bash">{curlExample}</CodeBlock>
            </div>
        </div>
    );
};
