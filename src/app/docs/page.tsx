'use client';

import { useEffect, useRef } from 'react';

// Import swagger-ui-dist directly
export default function ApiDocs() {
  const swaggerUIRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initSwaggerUI = async () => {
      if (!swaggerUIRef.current) return;

      // Add Swagger UI CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css';
      link.id = 'swagger-ui-css';
      
      if (!document.getElementById('swagger-ui-css')) {
        document.head.appendChild(link);
      }

      // Add Swagger UI Standalone Preset script
      const presetScript = document.createElement('script');
      presetScript.src = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js';
      presetScript.id = 'swagger-ui-standalone-preset';
      presetScript.async = true;
      
      if (!document.getElementById('swagger-ui-standalone-preset')) {
        document.head.appendChild(presetScript);
      }

      // Add Swagger UI Bundle script
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js';
      script.id = 'swagger-ui-bundle';
      script.async = true;
      script.onload = () => {
        // Wait for standalone preset to be loaded
        setTimeout(() => {
          // Initialize Swagger UI after script is loaded
          const ui = window.SwaggerUIBundle({
            url: '/api/swagger',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              window.SwaggerUIBundle.presets.apis,
              window.SwaggerUIStandalonePreset
            ],
            plugins: [
              window.SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "BaseLayout"
          });
        }, 100); // Small delay to ensure both scripts are loaded
      };
      
      if (!document.getElementById('swagger-ui-bundle')) {
        document.head.appendChild(script);
      }

      // Cleanup function
      return () => {
        const existingLink = document.getElementById('swagger-ui-css');
        if (existingLink) {
          existingLink.remove();
        }
        
        const existingScript = document.getElementById('swagger-ui-bundle');
        if (existingScript) {
          existingScript.remove();
        }
        
        const existingPresetScript = document.getElementById('swagger-ui-standalone-preset');
        if (existingPresetScript) {
          existingPresetScript.remove();
        }
        
        // Clean up Swagger UI container
        if (swaggerUIRef.current) {
          swaggerUIRef.current.innerHTML = '';
        }
      };
    };

    initSwaggerUI();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      <div id="swagger-ui" ref={swaggerUIRef} className="swagger-ui-container" />
    </div>
  );
}
