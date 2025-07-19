import type {
  SessionDestroyRequest,
  SessionDestroyResponse,
} from '@/types/requests.js'
import { logger } from '@/utils/logger.js'
import { getActiveSession } from './create.js'

const activeSessions = new Map<string, any>()

export async function handleSessionDestroy(
  request: SessionDestroyRequest
): Promise<SessionDestroyResponse> {
  const { sessionId } = request.params

  logger.info(`🔗 Session destroy request: ${sessionId}`)

  try {
    const session = getActiveSession(sessionId)

    if (!session) {
      logger.warning(`⚠️  Session not found: ${sessionId}`)
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32602,
          message: `Session not found: ${sessionId}`,
        },
      }
    }

    // Remove the session
    activeSessions.delete(sessionId)

    // In a real implementation, this would:
    // 1. Clean up session-specific state and resources
    // 2. Close any open connections or streams
    // 3. Persist any necessary session data before destruction
    // 4. Notify other components about session termination

    const response: SessionDestroyResponse = {
      jsonrpc: '2.0',
      id: request.id,
      result: {},
    }

    logger.info(`✅ Session destroyed: ${sessionId}`)
    return response
  } catch (error) {
    logger.error(`❌ Session destroy error for ${sessionId}:`, error)
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: `Failed to destroy session: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}
