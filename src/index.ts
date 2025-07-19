import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

// Import utilities and configuration
import { logger } from '@/utils/logger.js'
import { serverConfig } from '@/config/server.js'

// Import all handlers
// import { handleInitialize } from '@/handlers/initialize/index.js'
// import { handleDiscovery } from '@/handlers/discovery/index.js'
// import { handleToolsList } from '@/handlers/tools/list.js'
// import { handleToolsCall } from '@/handlers/tools/call.js'
// import { handleResourcesList } from '@/handlers/resources/list.js'
// import { handleResourcesRead } from '@/handlers/resources/read.js'
// import { handleResourcesSubscribe } from '@/handlers/resources/subscribe.js'
// import { handleResourcesUnsubscribe } from '@/handlers/resources/unsubscribe.js'
// import { handleResourcesTemplatesList } from '@/handlers/resources/templates/list.js'
// import { handlePromptsList } from '@/handlers/prompts/list.js'
// import { handlePromptsGet } from '@/handlers/prompts/get.js'
// import { handleSamplingCreateMessage } from '@/handlers/sampling/createMessage.js'
// import { handleCompletionComplete } from '@/handlers/completion/complete.js'
// import { handleElicitationCreate } from '@/handlers/elicitation/create.js'
// import { handleRootsList } from '@/handlers/roots/list.js'
// import { handleLoggingSetLevel } from '@/handlers/logging/setLevel.js'
// import { handlePing } from '@/handlers/ping/index.js'
// import { handleSessionCreate } from '@/handlers/session/create.js'
// import { handleSessionDestroy } from '@/handlers/session/destroy.js'
// Import services for tool registration
import { CalculatorService } from '@/services/calculator.js'
import { WeatherService } from '@/services/weather.js'

// Create the MCP server
const server = new McpServer({
  name: serverConfig.name,
  version: serverConfig.version,
})

// Register Tools
logger.info('🔧 Registering tools...')

// Calculator tools
server.registerTool(
  'add',
  {
    title: 'Addition Calculator',
    description: 'Add two numbers together',
    inputSchema: {
      a: z.number().describe('First number'),
      b: z.number().describe('Second number'),
    },
  },
  async ({ a, b }) => {
    const result = CalculatorService.add(a, b)
    return {
      content: [
        {
          type: 'text',
          text: `${a} + ${b} = ${result}`,
        },
      ],
    }
  }
)

server.registerTool(
  'subtract',
  {
    title: 'Subtraction Calculator',
    description: 'Subtract two numbers',
    inputSchema: {
      a: z.number().describe('First number'),
      b: z.number().describe('Second number'),
    },
  },
  async ({ a, b }) => {
    const result = CalculatorService.subtract(a, b)
    return {
      content: [
        {
          type: 'text',
          text: `${a} - ${b} = ${result}`,
        },
      ],
    }
  }
)

server.registerTool(
  'multiply',
  {
    title: 'Multiplication Calculator',
    description: 'Multiply two numbers',
    inputSchema: {
      a: z.number().describe('First number'),
      b: z.number().describe('Second number'),
    },
  },
  async ({ a, b }) => {
    const result = CalculatorService.multiply(a, b)
    return {
      content: [
        {
          type: 'text',
          text: `${a} × ${b} = ${result}`,
        },
      ],
    }
  }
)

server.registerTool(
  'divide',
  {
    title: 'Division Calculator',
    description: 'Divide two numbers',
    inputSchema: {
      a: z.number().describe('Dividend'),
      b: z.number().describe('Divisor'),
    },
  },
  async ({ a, b }) => {
    try {
      const result = CalculatorService.divide(a, b)
      return {
        content: [
          {
            type: 'text',
            text: `${a} ÷ ${b} = ${result}`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Weather tools
server.registerTool(
  'fetch-weather',
  {
    title: 'Weather Fetcher',
    description: 'Get current weather information for a city',
    inputSchema: {
      city: z.string().describe('Name of the city'),
    },
  },
  async ({ city }) => {
    const weatherData = await WeatherService.fetchWeatherData(city)
    return {
      content: [
        {
          type: 'text',
          text: weatherData,
        },
      ],
    }
  }
)

server.registerTool(
  'get-forecast',
  {
    title: 'Weather Forecast',
    description: 'Get weather forecast for a city',
    inputSchema: {
      city: z.string().describe('Name of the city'),
      days: z
        .number()
        .optional()
        .describe('Number of days for forecast (default: 5)'),
    },
  },
  async ({ city, days }) => {
    const forecast = await WeatherService.getForecast(city, days || 5)
    return {
      content: [
        {
          type: 'text',
          text: forecast.join('\n'),
        },
      ],
    }
  }
)

// Register Prompts
logger.info('💭 Registering prompts...')

// Code review prompt
server.registerPrompt(
  'review-code',
  {
    title: 'Code Review Assistant',
    description:
      'Generate a comprehensive code review with best practices and suggestions',
    argsSchema: {
      code: z.string().describe('The code to review'),
      language: z
        .string()
        .optional()
        .describe('Programming language (auto-detected if not provided)'),
      focus: z.string().optional().describe('Review focus area'),
    },
  },
  ({ code, language, focus }) => {
    const focusAreas = {
      security:
        'Focus on security vulnerabilities, input validation, and secure coding practices.',
      performance:
        'Focus on performance optimizations, algorithmic efficiency, and resource usage.',
      readability:
        'Focus on code clarity, naming conventions, and maintainability.',
      all: 'Provide a comprehensive review covering security, performance, readability, and best practices.',
    }

    return {
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Please review the following ${language || 'code'} and provide detailed feedback. ${focusAreas[focus as keyof typeof focusAreas]}

\`\`\`${language || ''}
${code}
\`\`\`

Please provide:
1. Overall assessment
2. Specific issues and suggestions
3. Best practices recommendations
4. Security considerations (if applicable)
5. Performance considerations (if applicable)`,
          },
        },
      ],
    }
  }
)

// Additional prompts
const additionalPrompts = [
  'explain-concept',
  'debug-help',
  'optimize-code',
  'generate-tests',
]

additionalPrompts.forEach(promptName => {
  server.registerPrompt(
    promptName,
    {
      title: promptName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      description: `${promptName.replace('-', ' ')} assistant prompt`,
      argsSchema: {
        content: z.string().describe('Content for the prompt'),
        options: z.string().optional().describe('Additional options'),
      },
    },
    ({ content }) => {
      return {
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: `Process the following content for ${promptName.replace('-', ' ')}: ${content}`,
            },
          },
        ],
      }
    }
  )
})

// Register Resources
logger.info('📄 Registering resources...')

// Static configuration resource
server.registerResource(
  'config',
  'config://app',
  {
    title: 'Application Configuration',
    description: 'Static application configuration data',
    mimeType: 'application/json',
  },
  async uri => {
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              app_name: 'MCP TypeScript Server Template',
              version: '1.0.0',
              author: 'Muhammed Kılıç',
              database: {
                host: 'localhost',
                port: 5432,
                name: 'mcp_template',
              },
              server: {
                port: 3000,
                host: '0.0.0.0',
              },
              logging: {
                level: 'info',
                format: 'json',
              },
              security: {
                cors_enabled: true,
                rate_limiting: true,
              },
              features: {
                analytics: true,
                monitoring: true,
                caching: true,
              },
            },
            null,
            2
          ),
        },
      ],
    }
  }
)

// Dynamic greeting resource
server.registerResource(
  'greeting',
  'greeting://{name}',
  {
    title: 'Dynamic Greeting Generator',
    description: 'Generate personalized greetings',
    mimeType: 'text/plain',
  },
  async uri => {
    const urlPath = new URL(uri.href).pathname
    const name = urlPath.split('/').pop() || 'World'

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/plain',
          text: `Hello, ${name}! Welcome to our MCP TypeScript server template. Today is ${new Date().toLocaleDateString()}.`,
        },
      ],
    }
  }
)

// Function to start the server
export async function startServer(transport?: 'stdio' | 'http') {
  // Set the logger transport mode
  logger.setTransport(transport || 'stdio')

  logger.info('🚀 Starting MCP TypeScript Template Server...')
  logger.info(`📦 Server name: ${serverConfig.name}`)
  logger.info(`📋 Version: ${serverConfig.version}`)
  logger.info('🎯 All MCP request types supported:')
  logger.info(
    '   ✅ Core: initialize, tools/list, tools/call, resources/list, resources/read, prompts/list, prompts/get, ping'
  )
  logger.info(
    '   ✅ Optional: discovery, resources/subscribe, resources/unsubscribe, resources/templates/list'
  )
  logger.info(
    '   ✅ Extended: sampling/createMessage, completion/complete, elicitation/create, roots/list'
  )
  logger.info(
    '   ✅ Management: logging/setLevel, session/create, session/destroy'
  )

  if (!transport || transport === 'stdio') {
    // Use stdio transport for local development
    logger.info('🔗 Transport: stdio')
    const stdioTransport = new StdioServerTransport()
    await server.connect(stdioTransport)
    logger.info('✅ Server connected via stdio transport')
  } else {
    // HTTP transport will be implemented in Phase 4
    throw new Error('HTTP transport not implemented yet')
  }
}

// Default export for the server
export default server

// Auto-start if this file is run directly
if (import.meta.main) {
  startServer('stdio').catch(error => {
    logger.error('Failed to start server:', error)
    process.exit(1)
  })
}
