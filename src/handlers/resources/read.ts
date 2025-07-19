import type {
  ResourcesReadRequest,
  ResourcesReadResponse,
} from '@/types/requests.js'
import { logger } from '@/utils/logger.js'

export async function handleResourcesRead(
  request: ResourcesReadRequest
): Promise<ResourcesReadResponse> {
  const { uri } = request.params
  logger.info(`📄 Resource read request: ${uri}`)

  try {
    let content: string
    let mimeType: string

    switch (true) {
      case uri === 'config://app':
        const config = {
          name: 'MCP TypeScript Template',
          version: '1.0.0',
          environment: process.env.NODE_ENV || 'development',
          features: ['tools', 'resources', 'prompts'],
          transports: ['stdio', 'http+sse'],
          timestamp: new Date().toISOString(),
        }
        content = JSON.stringify(config, null, 2)
        mimeType = 'application/json'
        break

      case uri === 'greeting://demo':
        const greetings = [
          'Hello! Welcome to the MCP TypeScript Template.',
          "Greetings! Hope you're having a great day.",
          'Hi there! Ready to explore MCP capabilities?',
          'Hey! Thanks for checking out this template.',
        ]
        content = greetings[Math.floor(Math.random() * greetings.length)]
        mimeType = 'text/plain'
        break

      case uri.startsWith('greeting://'):
        const name = uri.replace('greeting://', '')
        const personalizedGreetings = [
          `Hello, ${name}! Welcome to the MCP TypeScript Template.`,
          `Greetings, ${name}! Hope you're having a great day.`,
          `Hi there, ${name}! Ready to explore MCP capabilities?`,
          `Hey ${name}! Thanks for checking out this template.`,
        ]
        content =
          personalizedGreetings[
            Math.floor(Math.random() * personalizedGreetings.length)
          ]
        mimeType = 'text/plain'
        break

      case uri === 'logs://server':
        const logs = [
          `[${new Date().toISOString()}] [INFO] Server started successfully`,
          `[${new Date(Date.now() - 1000).toISOString()}] [INFO] MCP connection established`,
          `[${new Date(Date.now() - 2000).toISOString()}] [DEBUG] Capabilities negotiated`,
          `[${new Date(Date.now() - 3000).toISOString()}] [INFO] Tools registered`,
          `[${new Date(Date.now() - 4000).toISOString()}] [INFO] Resources registered`,
        ]
        content = logs.join('\n')
        mimeType = 'text/plain'
        break

      case uri === 'status://system':
        const status = {
          status: 'healthy',
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.version,
          platform: process.platform,
          timestamp: new Date().toISOString(),
        }
        content = JSON.stringify(status, null, 2)
        mimeType = 'application/json'
        break

      default:
        logger.error(`❌ Unknown resource: ${uri}`)
        return {
          jsonrpc: '2.0',
          id: request.id,
          error: {
            code: -32601,
            message: `Unknown resource: ${uri}`,
          },
        }
    }

    const response: ResourcesReadResponse = {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        contents: [
          {
            uri,
            text: content,
            mimeType,
          },
        ],
      },
    }

    logger.info(`✅ Resource read response sent for: ${uri}`)
    return response
  } catch (error) {
    logger.error(`❌ Resource read error for ${uri}:`, error)
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: `Failed to read resource: ${uri}`,
      },
    }
  }
}
