import type { ResourcesUnsubscribeRequest } from '@/types/requests.js'
import type { McpResponse } from '@/types/mcp.js'
import { logger } from '@/utils/logger.js'

const subscriptions = new Set<string>()

export async function handleResourcesUnsubscribe(
  request: ResourcesUnsubscribeRequest
): Promise<McpResponse> {
  const { uri } = request.params
  logger.info(`📄 Resource unsubscribe request: ${uri}`)

  try {
    if (!subscriptions.has(uri)) {
      logger.warning(`⚠️  Not subscribed to: ${uri}`)
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          message: `Not subscribed to ${uri}`,
        },
      }
    }

    subscriptions.delete(uri)

    // In a real implementation, you would:
    // 1. Clean up file watchers or periodic checks
    // 2. Stop sending notifications for this resource
    // 3. Free up any resources associated with the subscription

    const response: McpResponse = {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        message: `Unsubscribed from ${uri}`,
      },
    }

    logger.info(`✅ Unsubscribed from resource: ${uri}`)
    return response
  } catch (error) {
    logger.error(`❌ Resource unsubscribe error for ${uri}:`, error)
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: `Failed to unsubscribe from resource: ${uri}`,
      },
    }
  }
}
