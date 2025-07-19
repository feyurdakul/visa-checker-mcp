import type { InitializeRequest, InitializeResponse } from '@/types/requests.js'
import type { ServerCapabilities } from '@/types/mcp.js'
import { logger } from '@/utils/logger.js'

export async function handleInitialize(
  request: InitializeRequest
): Promise<InitializeResponse> {
  logger.info('🔗 Initialize request received', {
    protocolVersion: request.params.protocolVersion,
    clientInfo: request.params.clientInfo,
  })

  const serverCapabilities: ServerCapabilities = {
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

  const response: InitializeResponse = {
    jsonrpc: '2.0',
    id: request.id,
    result: {
      protocolVersion: '2024-11-05',
      capabilities: serverCapabilities,
      serverInfo: {
        name: 'visa-checker-mcp-server',
        version: '1.0.0',
      },
    },
  }

  logger.info('✅ Initialize response sent')
  return response
}
