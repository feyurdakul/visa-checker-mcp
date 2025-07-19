import type { ResourcesSubscribeRequest } from '@/types/requests.js'
import type { McpResponse } from '@/types/mcp.js'
import { logger } from '@/utils/logger.js'

const subscriptions = new Set<string>()

export async function handleResourcesSubscribe(
  request: ResourcesSubscribeRequest
): Promise<McpResponse> {
  const { uri } = request.params
  logger.info(`📄 Resource subscribe request: ${uri}`)

  try {
    // Check if resource exists (basic validation)
    const validUriPatterns = [
      /^config:\/\/.+/,
      /^greeting:\/\/.+/,
      /^logs:\/\/.+/,
      /^status:\/\/.+/,
    ]

    const isValidUri = validUriPatterns.some(pattern => pattern.test(uri))

    if (!isValidUri) {
      logger.error(`❌ Invalid resource URI for subscription: ${uri}`)
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32601,
          message: `Invalid resource URI: ${uri}`,
        },
      }
    }

    if (subscriptions.has(uri)) {
      logger.warning(`⚠️  Already subscribed to: ${uri}`)
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          message: `Already subscribed to ${uri}`,
        },
      }
    }

    subscriptions.add(uri)

    // In a real implementation, you would:
    // 1. Set up file watchers or periodic checks
    // 2. Send notifications when the resource changes
    // 3. Manage subscription lifecycle

    const response: McpResponse = {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        message: `Subscribed to ${uri}`,
      },
    }

    logger.info(`✅ Subscribed to resource: ${uri}`)
    return response
  } catch (error) {
    logger.error(`❌ Resource subscribe error for ${uri}:`, error)
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: `Failed to subscribe to resource: ${uri}`,
      },
    }
  }
}

export function getActiveSubscriptions(): string[] {
  return Array.from(subscriptions)
}
