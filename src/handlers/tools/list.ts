import type { ToolsListRequest, ToolsListResponse } from '@/types/requests.js'
import type { ToolDefinition } from '@/types/mcp.js'
import { logger } from '@/utils/logger.js'

export async function handleToolsList(
  request: ToolsListRequest
): Promise<ToolsListResponse> {
  logger.info('🔧 Tools list request received')

  const tools: ToolDefinition[] = [
    {
      name: 'add',
      description: 'Add two numbers together',
      inputSchema: {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            description: 'First number',
          },
          b: {
            type: 'number',
            description: 'Second number',
          },
        },
        required: ['a', 'b'],
      },
    },
    {
      name: 'subtract',
      description: 'Subtract two numbers',
      inputSchema: {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            description: 'First number',
          },
          b: {
            type: 'number',
            description: 'Second number',
          },
        },
        required: ['a', 'b'],
      },
    },
    {
      name: 'multiply',
      description: 'Multiply two numbers',
      inputSchema: {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            description: 'First number',
          },
          b: {
            type: 'number',
            description: 'Second number',
          },
        },
        required: ['a', 'b'],
      },
    },
    {
      name: 'divide',
      description: 'Divide two numbers',
      inputSchema: {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            description: 'Dividend',
          },
          b: {
            type: 'number',
            description: 'Divisor',
          },
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
          city: {
            type: 'string',
            description: 'Name of the city',
          },
        },
        required: ['city'],
      },
    },
    {
      name: 'get-forecast',
      description: 'Get weather forecast for a city',
      inputSchema: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'Name of the city',
          },
          days: {
            type: 'number',
            description: 'Number of days for forecast (default: 5)',
            minimum: 1,
            maximum: 14,
          },
        },
        required: ['city'],
      },
    },
  ]

  const response: ToolsListResponse = {
    jsonrpc: '2.0',
    id: request.id,
    result: {
      tools,
    },
  }

  logger.info(`✅ Tools list response sent (${tools.length} tools)`)
  return response
}
