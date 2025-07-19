import type { LoggingSetLevelRequest } from '@/types/requests.js'
import type { LogLevel, McpResponse } from '@/types/mcp.js'
import { logger } from '@/utils/logger.js'

let currentLogLevel: LogLevel = 'info'

export async function handleLoggingSetLevel(
  request: LoggingSetLevelRequest
): Promise<McpResponse> {
  const { level } = request.params

  logger.info(`📊 Logging setLevel request: ${level}`)

  try {
    const validLevels: LogLevel[] = [
      'debug',
      'info',
      'notice',
      'warning',
      'error',
      'critical',
      'alert',
      'emergency',
    ]

    if (!validLevels.includes(level)) {
      logger.error(`❌ Invalid log level: ${level}`)
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32602,
          message: `Invalid log level: ${level}. Valid levels are: ${validLevels.join(', ')}`,
        },
      }
    }

    const previousLevel = currentLogLevel
    currentLogLevel = level

    // In a real implementation, this would:
    // 1. Update the actual logging configuration
    // 2. Apply the new level to all loggers
    // 3. Persist the setting if needed

    logger.info(`✅ Log level changed from ${previousLevel} to ${level}`)

    const response: McpResponse = {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        previousLevel,
        currentLevel: level,
        message: `Log level updated to ${level}`,
      },
    }

    return response
  } catch (error) {
    logger.error('❌ Logging setLevel error:', error)
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: `Failed to set log level: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}

export function getCurrentLogLevel(): LogLevel {
  return currentLogLevel
}
