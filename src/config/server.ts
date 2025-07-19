export const serverConfig = {
  name: 'visa-checker-mcp-server',
  version: '1.0.0',
  description: 'MCP TypeScript server: visa-checker-mcp',

  // Protocol configuration
  protocol: {
    version: '2024-11-05',
    supportedTransports: ['stdio', 'http+sse'] as const,
  },

  // Server capabilities
  capabilities: {
    logging: {
      levels: [
        'debug',
        'info',
        'notice',
        'warning',
        'error',
        'critical',
        'alert',
        'emergency',
      ] as const,
      defaultLevel: 'info' as const,
    },
    tools: {
      listChanged: true,
      maxConcurrentCalls: 10,
    },
    resources: {
      subscribe: true,
      listChanged: true,
      maxSubscriptions: 100,
    },
    prompts: {
      listChanged: true,
      maxPromptLength: 10000,
    },
    sampling: {
      enabled: true,
      maxTokens: 4096,
    },
    experimental: {
      customFeatures: ['template-demo'],
    },
  },

  // Resource limits
  limits: {
    maxRequestSize: 1024 * 1024, // 1MB
    maxResponseSize: 10 * 1024 * 1024, // 10MB
    requestTimeout: 30000, // 30 seconds
    maxConcurrentRequests: 50,
  },

  // Feature flags
  features: {
    enableMetrics: true,
    enableHealthCheck: true,
    enableDiscovery: true,
    enableElicitation: true,
    enableSampling: false, // Disabled by default as it requires LLM integration
    enableCompletion: true,
    enableSessions: true,
  },

  // Transport-specific settings
  transports: {
    stdio: {
      bufferSize: 64 * 1024, // 64KB
    },
    http: {
      port: parseInt(process.env.PORT || '3000'),
      host: process.env.HOST || 'localhost',
      cors: {
        enabled: true,
        origins: ['*'],
      },
      sse: {
        heartbeatInterval: 30000, // 30 seconds
        maxConnections: 100,
      },
    },
  },

  // Logging configuration
  logging: {
    level: (process.env.LOG_LEVEL as any) || 'info',
    format: process.env.LOG_FORMAT || 'text', // 'text' | 'json'
    timestamps: true,
    includeMetadata: true,
  },
} as const

export type ServerConfig = typeof serverConfig
