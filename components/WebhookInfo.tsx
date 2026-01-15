
import React from 'react';

const CodeBlock: React.FC<{ children: React.ReactNode, lang: string }> = ({ children, lang }) => (
    <pre className="bg-gray-900 rounded-md p-4 my-2 text-sm text-gray-300 overflow-x-auto">
        <code className={`language-${lang}`}>{children}</code>
    </pre>
);

interface WebhookInfoProps {
    manualSecret?: string;
    onSecretChange?: (value: string) => void;
}

export const WebhookInfo: React.FC<WebhookInfoProps> = ({ manualSecret, onSecretChange }) => {
    const webhookUrl = 'https://zlkpkcxeplxavplpvqua.supabase.co/functions/v1/webhook-company';
    
    const curlExample = `curl -X POST '${webhookUrl}' \\
-H "Content-Type: application/json" \\
-H "x-company-name: ExampleCorp" \\
-H "x-webhook-apikey: YOUR_SECRET_HERE" \\
-d '{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "job_title": "Logistics Manager",
  "tenant_subdomain": "tenant-123"
}'`;

    return (
        <div className="mt-6 p-5 border border-gray-700 rounded-lg bg-gray-900/50 space-y-4 animate-in fade-in duration-500">
            <h4 className="text-lg font-semibold text-teal-400 text-center uppercase tracking-wider">Webhook API Documentation</h4>
            
            <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                <p className="text-amber-300 text-sm font-bold">
                    🔑 Authentication Troubleshooting
                </p>
                <p className="text-gray-300 text-xs mt-1">
                    If you see "Env missing", the environment variable wasn't injected correctly. Label it as <code className="bg-amber-900/50 px-1 rounded text-white">VITE_WEBHOOK_SECRET</code> in your host, or paste it below:
                </p>
                <div className="mt-3">
                    <input 
                        type="password"
                        placeholder="Paste your webhook secret here..."
                        value={manualSecret || ''}
                        onChange={(e) => onSecretChange?.(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm text-teal-400 placeholder-gray-600 focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                    {manualSecret && <p className="text-[10px] text-teal-500 mt-1 italic">Manual secret saved locally.</p>}
                </div>
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
                        <span className="ml-2 text-gray-300 italic">Matches your secret</span>
                     </li>
                 </ul>
            </div>

            <div>
                 <h5 className="font-semibold text-gray-200">Example cURL Request</h5>
                <CodeBlock lang="bash">{curlExample}</CodeBlock>
            </div>
        </div>
    );
};
