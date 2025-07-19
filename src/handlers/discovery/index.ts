import type { DiscoveryRequest, DiscoveryResponse } from '@/types/requests.js'
import type {
  PromptDefinition,
  ResourceDefinition,
  ServerCapabilities,
  ToolDefinition,
} from '@/types/mcp.js'
import { logger } from '@/utils/logger.js'

export async function handleDiscovery(
  request: DiscoveryRequest
): Promise<DiscoveryResponse> {
  logger.info('🔍 Discovery request received')

  const capabilities: ServerCapabilities = {
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
      ],
    },
    tools: {
      listChanged: true,
    },
    resources: {
      subscribe: true,
      listChanged: true,
    },
    prompts: {
      listChanged: true,
    },
    sampling: {},
    experimental: {},
  }

  const tools: ToolDefinition[] = [
    {
      name: 'add',
      description: 'Add two numbers together',
      inputSchema: {
        type: 'object',
        properties: {
          a: { type: 'number', description: 'First number' },
          b: { type: 'number', description: 'Second number' },
        },
        required: ['a', 'b'],
      },
    },
    {
      name: 'fetch-weather',
      description: 'Get current weather information for a city',
      inputSchema: {
        type: 'object',
        properties: {
          city: { type: 'string', description: 'Name of the city' },
        },
        required: ['city'],
      },
    },
  ]

  const resources: ResourceDefinition[] = [
    {
      uri: 'config://app',
      name: 'Application Configuration',
      description: 'Static application configuration data',
      mimeType: 'application/json',
    },
    {
      uri: 'greeting://demo',
      name: 'Demo Greeting',
      description: 'Generate a demo greeting message',
      mimeType: 'text/plain',
    },
  ]

  const prompts: PromptDefinition[] = [
    {
      name: 'review-code',
      description:
        'Generate a comprehensive code review with best practices and suggestions',
      arguments: [
        { name: 'code', description: 'The code to review', required: true },
        {
          name: 'language',
          description: 'Programming language',
          required: false,
        },
        { name: 'focus', description: 'Review focus area', required: false },
      ],
    },
  ]

  const response: DiscoveryResponse = {
    jsonrpc: '2.0',
    id: request.id,
    result: {
      capabilities,
      tools,
      resources,
      prompts,
    },
  }

  logger.info('✅ Discovery response sent')
  return response
}
