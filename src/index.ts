import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

// Import utilities and configuration
import { logger } from '@/utils/logger.js'
import { serverConfig } from '@/config/server.js'

// Import all handlers
// import { handleInitialize } from '@/handlers/initialize/index.js'
// import { handleDiscovery } from '@/handlers/discovery/index.js'
// import { handleToolsList } from '@/handlers/tools/list.js'
// import { handleToolsCall } from '@/handlers/tools/call.js'
// import { handleResourcesList } from '@/handlers/resources/list.js'
// import { handleResourcesRead } from '@/handlers/resources/read.js'
// import { handleResourcesSubscribe } from '@/handlers/resources/subscribe.js'
// import { handleResourcesUnsubscribe } from '@/handlers/resources/unsubscribe.js'
// import { handleResourcesTemplatesList } from '@/handlers/resources/templates/list.js'
// import { handlePromptsList } from '@/handlers/prompts/list.js'
// import { handlePromptsGet } from '@/handlers/prompts/get.js'
// import { handleSamplingCreateMessage } from '@/handlers/sampling/createMessage.js'
// import { handleCompletionComplete } from '@/handlers/completion/complete.js'
// import { handleElicitationCreate } from '@/handlers/elicitation/create.js'
// import { handleRootsList } from '@/handlers/roots/list.js'
// import { handleLoggingSetLevel } from '@/handlers/logging/setLevel.js'
// import { handlePing } from '@/handlers/ping/index.js'
// import { handleSessionCreate } from '@/handlers/session/create.js'
// import { handleSessionDestroy } from '@/handlers/session/destroy.js'
// Import services for tool registration
import { VisaService } from '@/services/visa.js'

// Create the MCP server
const server = new McpServer({
  name: serverConfig.name,
  version: serverConfig.version,
})

// Register Tools
logger.info('🔧 Registering visa tools...')

// Visa tools
server.registerTool(
  'fetch-visa-appointments',
  {
    title: 'Fetch Visa Appointments',
    description: 'Get current visa appointment availability from all centers',
    inputSchema: {
      country_code: z
        .string()
        .optional()
        .describe('Filter by origin country code (e.g., tur, are, egy)'),
      mission_code: z
        .string()
        .optional()
        .describe('Filter by destination country code (e.g., nld, fra, ita)'),
      status: z
        .enum(['open', 'closed', 'waitlist_open', 'waitlist_closed'])
        .optional()
        .describe('Filter by status'),
      visa_type: z
        .string()
        .optional()
        .describe('Filter by visa type (partial match)'),
    },
  },
  async ({ country_code, mission_code, status, visa_type }) => {
    try {
      const data = await VisaService.getVisaListWithCache({
        country_code,
        mission_code,
        status,
        visa_type,
      })

      const totalResults = data.visas.length
      const openCenters = data.visas.filter(v => v.status === 'open').length

      return {
        content: [
          {
            type: 'text',
            text: `Found ${totalResults} visa centers (${openCenters} currently open for appointments)

Summary:
${
  data.summary
    ? `• Total Results: ${data.summary.total_results}
• Countries: ${data.summary.countries.join(', ')}
• Missions: ${data.summary.missions.join(', ')}
• Last Updated: ${new Date(data.summary.last_updated).toLocaleString()}`
    : ''
}

Status Breakdown:
${
  data.summary
    ? Object.entries(data.summary.status_breakdown)
        .map(
          ([status, count]) =>
            `• ${status.replace('_', ' ').toUpperCase()}: ${count}`
        )
        .join('\n')
    : ''
}`,
          },
        ],
      }
    } catch (error) {
      // Try to get cached data as fallback
      const cachedData = await VisaService.getCachedVisaList()
      if (cachedData) {
        const totalResults = cachedData.visas.length
        const openCenters = cachedData.visas.filter(
          v => v.status === 'open'
        ).length

        return {
          content: [
            {
              type: 'text',
              text: `⚠️ API temporarily unavailable. Showing cached data:

Found ${totalResults} visa centers (${openCenters} currently open for appointments)

Summary (Cached):
${
  cachedData.summary
    ? `• Total Results: ${cachedData.summary.total_results}
• Countries: ${cachedData.summary.countries.join(', ')}
• Missions: ${cachedData.summary.missions.join(', ')}
• Last Updated: ${new Date(cachedData.summary.last_updated).toLocaleString()} (cached)`
    : ''
}

Status Breakdown:
${
  cachedData.summary
    ? Object.entries(cachedData.summary.status_breakdown)
        .map(
          ([status, count]) =>
            `• ${status.replace('_', ' ').toUpperCase()}: ${count}`
        )
        .join('\n')
    : ''
}

Note: Data may be outdated. Please try again later for live data.`,
            },
          ],
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: `❌ Error fetching visa appointments: ${error instanceof Error ? error.message : 'Unknown error'}

The visa appointment API is currently unavailable. Please try again later.`,
          },
        ],
        isError: true,
      }
    }
  }
)

server.registerTool(
  'get-open-appointments',
  {
    title: 'Get Open Appointments',
    description: 'Get only visa centers with open appointments',
    inputSchema: {
      country_code: z
        .string()
        .optional()
        .describe('Filter by origin country code'),
      mission_code: z
        .string()
        .optional()
        .describe('Filter by destination country code'),
    },
  },
  async ({ country_code, mission_code }) => {
    try {
      const data = await VisaService.getVisaListWithCache()
      const openAppointments = VisaService.getOpenAppointments(data)

      let filtered = openAppointments
      if (country_code) {
        filtered = filtered.filter(
          v => v.country_code.toLowerCase() === country_code.toLowerCase()
        )
      }
      if (mission_code) {
        filtered = filtered.filter(
          v => v.mission_code.toLowerCase() === mission_code.toLowerCase()
        )
      }

      if (filtered.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No open appointments found with the specified criteria.',
            },
          ],
        }
      }

      const formattedResults = filtered
        .map(visa => VisaService.formatVisaCenter(visa))
        .join('\n\n')

      return {
        content: [
          {
            type: 'text',
            text: `🎯 Found ${filtered.length} visa centers with open appointments:\n\n${formattedResults}`,
          },
        ],
      }
    } catch (error) {
      // Try to get cached data as fallback
      const cachedData = await VisaService.getCachedVisaList()
      if (cachedData) {
        const openAppointments = VisaService.getOpenAppointments(cachedData)

        let filtered = openAppointments
        if (country_code) {
          filtered = filtered.filter(
            v => v.country_code.toLowerCase() === country_code.toLowerCase()
          )
        }
        if (mission_code) {
          filtered = filtered.filter(
            v => v.mission_code.toLowerCase() === mission_code.toLowerCase()
          )
        }

        if (filtered.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: '⚠️ API temporarily unavailable. No open appointments found in cached data with the specified criteria.',
              },
            ],
          }
        }

        const formattedResults = filtered
          .map(visa => VisaService.formatVisaCenter(visa))
          .join('\n\n')

        return {
          content: [
            {
              type: 'text',
              text: `⚠️ API temporarily unavailable. Showing cached data:

🎯 Found ${filtered.length} visa centers with open appointments (cached data):

${formattedResults}

Note: Data may be outdated. Please try again later for live data.`,
            },
          ],
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: `❌ Error fetching open appointments: ${error instanceof Error ? error.message : 'Unknown error'}

The visa appointment API is currently unavailable. Please try again later.`,
          },
        ],
        isError: true,
      }
    }
  }
)

server.registerTool(
  'search-visa-centers',
  {
    title: 'Search Visa Centers',
    description: 'Search visa centers with detailed filtering options',
    inputSchema: {
      country_code: z
        .string()
        .optional()
        .describe('Origin country code (3 letters)'),
      mission_code: z
        .string()
        .optional()
        .describe('Destination country code (3 letters)'),
      visa_type: z.string().optional().describe('Visa type to search for'),
      status: z
        .enum(['open', 'closed', 'waitlist_open', 'waitlist_closed'])
        .optional()
        .describe('Filter by status'),
    },
  },
  async ({ country_code, mission_code, visa_type, status }) => {
    try {
      const data = await VisaService.getVisaListWithCache()
      const filtered = VisaService.filterVisaData(data, {
        country_code,
        mission_code,
        visa_type,
        status,
      })

      if (filtered.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No visa centers found matching your criteria.',
            },
          ],
        }
      }

      const formattedResults = filtered
        .slice(0, 10) // Limit to first 10 results
        .map(visa => VisaService.formatVisaCenter(visa))
        .join('\n\n')

      const moreResults =
        filtered.length > 10
          ? `\n\n... and ${filtered.length - 10} more results`
          : ''

      return {
        content: [
          {
            type: 'text',
            text: `🔍 Found ${filtered.length} matching visa centers:\n\n${formattedResults}${moreResults}`,
          },
        ],
      }
    } catch (error) {
      // Try to get cached data as fallback
      const cachedData = await VisaService.getCachedVisaList()
      if (cachedData) {
        const filtered = VisaService.filterVisaData(cachedData, {
          country_code,
          mission_code,
          visa_type,
          status,
        })

        if (filtered.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: '⚠️ API temporarily unavailable. No visa centers found in cached data matching your criteria.',
              },
            ],
          }
        }

        const formattedResults = filtered
          .slice(0, 10) // Limit to first 10 results
          .map(visa => VisaService.formatVisaCenter(visa))
          .join('\n\n')

        const moreResults =
          filtered.length > 10
            ? `\n\n... and ${filtered.length - 10} more results`
            : ''

        return {
          content: [
            {
              type: 'text',
              text: `⚠️ API temporarily unavailable. Showing cached data:

🔍 Found ${filtered.length} matching visa centers (cached data):

${formattedResults}${moreResults}

Note: Data may be outdated. Please try again later for live data.`,
            },
          ],
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: `❌ Error searching visa centers: ${error instanceof Error ? error.message : 'Unknown error'}

The visa appointment API is currently unavailable. Please try again later.`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Register Resources
logger.info('📄 Registering visa resources...')

// Visa data resource
server.registerResource(
  'visa-appointments',
  'visa://appointments',
  {
    title: 'Current Visa Appointment Data',
    description: 'Live visa appointment availability data from all centers',
    mimeType: 'application/json',
  },
  async uri => {
    try {
      const data = await VisaService.getVisaListWithCache()
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(data, null, 2),
          },
        ],
      }
    } catch (error) {
      // Check if we have any cached data to fall back to
      const cachedData = await VisaService.getCachedVisaList()
      if (cachedData) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'application/json',
              text: JSON.stringify(
                {
                  ...cachedData,
                  warning: `API currently unavailable. Showing cached data from ${cachedData.summary?.last_updated || 'unknown time'}.`,
                  error:
                    error instanceof Error ? error.message : 'Unknown error',
                },
                null,
                2
              ),
            },
          ],
        }
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                error: `Failed to fetch visa data: ${error instanceof Error ? error.message : 'Unknown error'}`,
                success: false,
                message:
                  'The visa appointment API is currently unavailable. Please try again later.',
                timestamp: new Date().toISOString(),
              },
              null,
              2
            ),
          },
        ],
      }
    }
  }
)

// Filtered visa data resource
server.registerResource(
  'visa-appointments-filtered',
  'visa://appointments/{country_code}/{mission_code}',
  {
    title: 'Filtered Visa Appointment Data',
    description: 'Visa appointment data filtered by country and mission codes',
    mimeType: 'application/json',
  },
  async uri => {
    try {
      const urlPath = new URL(uri.href).pathname
      const pathParts = urlPath.split('/').filter(Boolean)
      const country_code = pathParts[1] || undefined
      const mission_code = pathParts[2] || undefined

      const data = await VisaService.getVisaListWithCache()
      const filtered = VisaService.filterVisaData(data, {
        country_code,
        mission_code,
      })

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                success: true,
                filters: { country_code, mission_code },
                total_results: filtered.length,
                visas: filtered,
                last_updated: data.summary?.last_updated,
              },
              null,
              2
            ),
          },
        ],
      }
    } catch (error) {
      // Try to get cached data for filtered results
      const cachedData = await VisaService.getCachedVisaList()
      if (cachedData) {
        const urlPath = new URL(uri.href).pathname
        const pathParts = urlPath.split('/').filter(Boolean)
        const country_code = pathParts[1] || undefined
        const mission_code = pathParts[2] || undefined

        const filtered = VisaService.filterVisaData(cachedData, {
          country_code,
          mission_code,
        })

        return {
          contents: [
            {
              uri: uri.href,
              mimeType: 'application/json',
              text: JSON.stringify(
                {
                  success: true,
                  filters: { country_code, mission_code },
                  total_results: filtered.length,
                  visas: filtered,
                  warning: `API currently unavailable. Showing cached data from ${cachedData.summary?.last_updated || 'unknown time'}.`,
                  last_updated: cachedData.summary?.last_updated,
                },
                null,
                2
              ),
            },
          ],
        }
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                error: `Failed to fetch filtered visa data: ${error instanceof Error ? error.message : 'Unknown error'}`,
                success: false,
                message:
                  'The visa appointment API is currently unavailable. Please try again later.',
                timestamp: new Date().toISOString(),
              },
              null,
              2
            ),
          },
        ],
      }
    }
  }
)

// Function to start the server
export async function startServer(transport?: 'stdio' | 'http') {
  // Set the logger transport mode
  logger.setTransport(transport || 'stdio')

  logger.info('🚀 Starting Visa Checker MCP Server...')
  logger.info(`📦 Server name: ${serverConfig.name}`)
  logger.info(`📋 Version: ${serverConfig.version}`)
  logger.info('🎯 Visa appointment checking capabilities:')
  logger.info(
    '   ✅ Tools: fetch-visa-appointments, get-open-appointments, search-visa-centers'
  )
  logger.info(
    '   ✅ Resources: visa://appointments, visa://appointments/{country}/{mission}'
  )
  logger.info(
    '   ✅ Features: Live data, smart caching, error handling with fallback'
  )
  logger.info('🎯 MCP protocol support:')
  logger.info(
    '   ✅ Core: initialize, tools/list, tools/call, resources/list, resources/read, ping'
  )

  if (!transport || transport === 'stdio') {
    // Use stdio transport for local development
    logger.info('🔗 Transport: stdio')
    const stdioTransport = new StdioServerTransport()
    await server.connect(stdioTransport)
    logger.info('✅ Server connected via stdio transport')
  } else {
    // HTTP transport will be implemented in Phase 4
    throw new Error('HTTP transport not implemented yet')
  }
}

// Default export for the server
export default server

// Auto-start if this file is run directly
if (import.meta.main) {
  startServer('stdio').catch(error => {
    logger.error('Failed to start server:', error)
    process.exit(1)
  })
}
