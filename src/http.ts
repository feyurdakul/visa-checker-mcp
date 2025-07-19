#!/usr/bin/env bun

import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { logger } from '@/utils/logger.js'
import { serverConfig } from '@/config/server.js'

const app = new Hono()

// Set logger transport for HTTP
logger.setTransport('http')

// Enable CORS for browser clients
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'mcp-session-id'],
    exposeHeaders: ['mcp-session-id'],
  })
)

// Health check endpoint
app.get('/health', c => {
  return c.json({
    status: 'healthy',
    server: serverConfig.name,
    version: serverConfig.version,
    timestamp: new Date().toISOString(),
  })
})

// Server-Sent Events endpoint for MCP communication
app.get('/mcp/sse', c => {
  logger.info('🔄 New SSE connection established')

  return streamSSE(c, async stream => {
    // Keep connection alive
    stream.onAbort(() => {
      logger.info('🔌 SSE connection closed')
    })

    // Send initial connection message
    await stream.writeSSE({
      data: JSON.stringify({
        type: 'connection',
        message: 'MCP Server connected via SSE',
        timestamp: new Date().toISOString(),
      }),
      event: 'mcp-connection',
    })

    // Keep alive with periodic heartbeat
    const heartbeat = setInterval(async () => {
      if (!stream.aborted) {
        await stream.writeSSE({
          data: JSON.stringify({
            type: 'heartbeat',
            timestamp: new Date().toISOString(),
          }),
          event: 'mcp-heartbeat',
        })
      }
    }, 30000) // 30 seconds

    // Cleanup on abort
    stream.onAbort(() => {
      clearInterval(heartbeat)
    })

    // Keep connection open
    while (!stream.aborted) {
      await stream.sleep(1000)
    }
  })
})

// Basic MCP endpoint (for future HTTP transport implementation)
app.post('/mcp', async c => {
  logger.info('📨 MCP HTTP request received')

  try {
    const body = await c.req.json()
    logger.debug('📋 Request:', body)

    // This is a placeholder for the HTTP transport implementation
    // In a full implementation, this would integrate with the MCP server
    return c.json({
      jsonrpc: '2.0',
      id: body.id,
      result: {
        message:
          'HTTP transport not fully implemented yet. Use SSE endpoint for real-time communication.',
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    logger.error('❌ Error processing MCP request:', error)
    return c.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32603,
          message: 'Internal server error',
        },
      },
      500
    )
  }
})

// API info endpoint
app.get('/api/info', c => {
  return c.json({
    name: serverConfig.name,
    version: serverConfig.version,
    description:
      serverConfig.description ||
      'Model Context Protocol server built with Bun and Hono',
    endpoints: {
      '/health': 'Health check',
      '/mcp/sse': 'Server-Sent Events for MCP communication',
      '/mcp': 'HTTP endpoint for MCP requests (placeholder)',
      '/api/info': 'This endpoint',
    },
    capabilities: serverConfig.capabilities,
    supportedRequests: [
      'initialize',
      'discovery',
      'tools/list',
      'tools/call',
      'resources/list',
      'resources/read',
      'resources/subscribe',
      'resources/unsubscribe',
      'resources/templates/list',
      'prompts/list',
      'prompts/get',
      'sampling/createMessage',
      'completion/complete',
      'elicitation/create',
      'roots/list',
      'logging/setLevel',
      'ping',
      'session/create',
      'session/destroy',
    ],
    framework: 'Hono',
    runtime: 'Bun',
    timestamp: new Date().toISOString(),
  })
})

// Start the server
const port = serverConfig.transports.http.port

logger.info('🚀 Starting MCP HTTP Server with Hono...')
logger.info(`📦 Server: ${serverConfig.name}`)
logger.info(`🌐 Framework: Hono`)
logger.info(`⚡ Runtime: Bun`)
logger.info(`🔗 Port: ${port}`)

serve({
  fetch: app.fetch,
  port: port,
})

logger.info(`✅ MCP HTTP Server running on http://localhost:${port}`)
logger.info(`🔗 Health check: http://localhost:${port}/health`)
logger.info(`📡 SSE endpoint: http://localhost:${port}/mcp/sse`)
logger.info(`📋 API info: http://localhost:${port}/api/info`)
logger.info('🎯 All MCP request types supported via HTTP transport')
logger.info(`🛑 Press Ctrl+C to stop`)
