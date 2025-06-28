// Type definitions for Swagger UI
interface Window {
  SwaggerUIBundle: SwaggerUIConstructor;
  SwaggerUIStandalonePreset: any;
}

interface SwaggerUIConstructor {
  (config: SwaggerUIConfig): SwaggerUIInstance;
  presets: {
    apis: any;
  };
  plugins: {
    DownloadUrl: any;
  };
  SwaggerUIStandalonePreset: any;
}

interface SwaggerUIConfig {
  url?: string;
  spec?: any;
  dom_id: string;
  domNode?: HTMLElement;
  deepLinking?: boolean;
  presets?: any[];
  plugins?: any[];
  layout?: string;
  [key: string]: any;
}

interface SwaggerUIInstance {
  unmount: () => void;
  [key: string]: any;
}
