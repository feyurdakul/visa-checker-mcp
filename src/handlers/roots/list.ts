import type { RootsListRequest, RootsListResponse } from '@/types/requests.js'
import { logger } from '@/utils/logger.js'

export async function handleRootsList(
  request: RootsListRequest
): Promise<RootsListResponse> {
  logger.info('🌳 Roots list request received')

  const roots = [
    {
      uri: 'file:///project',
      name: 'Project Root',
    },
    {
      uri: 'file:///src',
      name: 'Source Code',
    },
    {
      uri: 'file:///docs',
      name: 'Documentation',
    },
    {
      uri: 'file:///tests',
      name: 'Test Files',
    },
    {
      uri: 'config://app',
      name: 'Application Configuration',
    },
    {
      uri: 'logs://system',
      name: 'System Logs',
    },
    {
      uri: 'metrics://performance',
      name: 'Performance Metrics',
    },
  ]

  const response: RootsListResponse = {
    jsonrpc: '2.0',
    id: request.id,
    result: {
      roots,
    },
  }

  logger.info(`✅ Roots list response sent (${roots.length} roots)`)
  return response
}
