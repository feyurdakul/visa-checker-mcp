import type {
  SessionCreateRequest,
  SessionCreateResponse,
} from '@/types/requests.js'
import type { SessionInfo } from '@/types/mcp.js'
import { logger } from '@/utils/logger.js'

const activeSessions = new Map<string, SessionInfo>()

export async function handleSessionCreate(
  request: SessionCreateRequest
): Promise<SessionCreateResponse> {
  const { metadata } = request.params || {}

  logger.info('🔗 Session create request received', { metadata })

  try {
    // Generate a unique session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    const session: SessionInfo = {
      id: sessionId,
      created: now,
      lastActivity: now,
      metadata: metadata || {},
    }

    // Store the session
    activeSessions.set(sessionId, session)

    // In a real implementation, this would:
    // 1. Set up session-specific state and context
    // 2. Initialize any session-specific resources
    // 3. Configure session isolation
    // 4. Possibly persist session data

    const response: SessionCreateResponse = {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        session,
      },
    }

    logger.info(`✅ Session created: ${sessionId}`)
    return response
  } catch (error) {
    logger.error('❌ Session create error:', error)
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: `Failed to create session: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}

export function getActiveSession(sessionId: string): SessionInfo | undefined {
  return activeSessions.get(sessionId)
}

export function updateSessionActivity(sessionId: string): void {
  const session = activeSessions.get(sessionId)
  if (session) {
    session.lastActivity = new Date().toISOString()
  }
}

export function getActiveSessions(): SessionInfo[] {
  return Array.from(activeSessions.values())
}
