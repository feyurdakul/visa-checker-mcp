import type { ToolsCallRequest, ToolsCallResponse } from '@/types/requests.js'
import { logger } from '@/utils/logger.js'

export async function handleToolsCall(
  request: ToolsCallRequest
): Promise<ToolsCallResponse> {
  const { name } = request.params
  logger.info(`🔧 Tool call request: ${name}`)

  // This handler is not used in the current implementation
  // Tools are registered directly in the main server file
  logger.error(`❌ Unknown tool: ${name}`)
  return {
    jsonrpc: '2.0',
    id: request.id,
    error: {
      code: -32601,
      message: `Unknown tool: ${name}`,
    },
  }
}
