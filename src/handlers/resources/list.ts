import type {
  ResourcesListRequest,
  ResourcesListResponse,
} from '@/types/requests.js'
import type { ResourceDefinition } from '@/types/mcp.js'
import { logger } from '@/utils/logger.js'

export async function handleResourcesList(
  request: ResourcesListRequest
): Promise<ResourcesListResponse> {
  logger.info('📄 Resources list request received')

  const resources: ResourceDefinition[] = [
    {
      uri: 'config://app',
      name: 'Application Configuration',
      description: 'Static application configuration data',
      mimeType: 'application/json',
    },
    {
      uri: 'greeting://demo',
      name: 'Demo Greeting',
      description: 'Generate a demo greeting message',
      mimeType: 'text/plain',
    },
    {
      uri: 'logs://server',
      name: 'Server Logs',
      description: 'Recent server log entries',
      mimeType: 'text/plain',
    },
    {
      uri: 'status://system',
      name: 'System Status',
      description: 'Current system status and metrics',
      mimeType: 'application/json',
    },
  ]

  const response: ResourcesListResponse = {
    jsonrpc: '2.0',
    id: request.id,
    result: {
      resources,
    },
  }

  logger.info(`✅ Resources list response sent (${resources.length} resources)`)
  return response
}
