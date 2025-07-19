import type { ElicitationCreateRequest } from '@/types/requests.js'
import type { McpResponse } from '@/types/mcp.js'
import { logger } from '@/utils/logger.js'

export async function handleElicitationCreate(
  request: ElicitationCreateRequest
): Promise<McpResponse> {
  const { type, message, options, defaultValue } = request.params

  logger.info('❓ Elicitation create request received', {
    type,
    message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
    hasOptions: !!options,
    hasDefault: !!defaultValue,
  })

  try {
    // In a real implementation, this would:
    // 1. Display the elicitation UI to the user
    // 2. Wait for user input
    // 3. Return the user's response
    // 4. Handle different elicitation types (input, confirmation, selection)

    // For this template, we'll return a mock response
    let mockResponse: any

    switch (type) {
      case 'input':
        mockResponse = {
          type: 'input',
          value: defaultValue || 'mock-user-input',
          message:
            'User input simulation - in real implementation, this would collect actual user input',
        }
        break

      case 'confirmation':
        mockResponse = {
          type: 'confirmation',
          confirmed: Math.random() > 0.5, // Random yes/no for demo
          message:
            'User confirmation simulation - in real implementation, this would show a confirmation dialog',
        }
        break

      case 'selection':
        if (options && options.length > 0) {
          const selectedIndex = Math.floor(Math.random() * options.length)
          mockResponse = {
            type: 'selection',
            selectedIndex,
            selectedValue: options[selectedIndex],
            message:
              'User selection simulation - in real implementation, this would show selection UI',
          }
        } else {
          throw new Error('Selection type requires options array')
        }
        break

      default:
        throw new Error(`Unknown elicitation type: ${type}`)
    }

    // Simulate user thinking time
    await new Promise(resolve => setTimeout(resolve, 200))

    const response: McpResponse = {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        elicitation: mockResponse,
        timestamp: new Date().toISOString(),
      },
    }

    logger.info(`✅ Elicitation create response sent (${type})`)
    return response
  } catch (error) {
    logger.error('❌ Elicitation create error:', error)
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: `Failed to create elicitation: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}
