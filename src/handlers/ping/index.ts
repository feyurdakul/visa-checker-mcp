import type { PingRequest, PingResponse } from '@/types/requests.js'
import { logger } from '@/utils/logger.js'

export async function handlePing(request: PingRequest): Promise<PingResponse> {
  logger.debug('🏓 Ping request received')

  const response: PingResponse = {
    jsonrpc: '2.0',
    id: request.id,
    result: {},
  }

  logger.debug('🏓 Pong response sent')
  return response
}
