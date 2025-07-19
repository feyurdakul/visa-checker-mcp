import type {
  ResourcesTemplatesListRequest,
  ResourcesTemplatesListResponse,
} from '@/types/requests.js'
import { logger } from '@/utils/logger.js'

export async function handleResourcesTemplatesList(
  request: ResourcesTemplatesListRequest
): Promise<ResourcesTemplatesListResponse> {
  logger.info('📄 Resource templates list request received')

  const resourceTemplates = [
    {
      uriTemplate: 'greeting://{name}',
      name: 'Dynamic Greeting Generator',
      description: 'Generate personalized greetings for any name',
      mimeType: 'text/plain',
    },
    {
      uriTemplate: 'user-profile://{userId}',
      name: 'User Profile',
      description: 'Access user profile information by user ID',
      mimeType: 'application/json',
    },
    {
      uriTemplate: 'config://{section}',
      name: 'Configuration Section',
      description: 'Access specific configuration sections',
      mimeType: 'application/json',
    },
    {
      uriTemplate: 'logs://{service}/{date}',
      name: 'Service Logs by Date',
      description: 'Access log files for specific services and dates',
      mimeType: 'text/plain',
    },
    {
      uriTemplate: 'metrics://{service}/{metric}',
      name: 'Service Metrics',
      description: 'Access performance metrics for specific services',
      mimeType: 'application/json',
    },
  ]

  const response: ResourcesTemplatesListResponse = {
    jsonrpc: '2.0',
    id: request.id,
    result: {
      resourceTemplates,
    },
  }

  logger.info(
    `✅ Resource templates list response sent (${resourceTemplates.length} templates)`
  )
  return response
}
