import type { McpResponse } from '@/types/mcp.js'

export function createErrorResponse(
  id: string | number,
  code: number,
  message: string,
  data?: any
): McpResponse {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      ...(data && { data }),
    },
  }
}

export function createSuccessResponse<T>(
  id: string | number,
  result: T
): McpResponse {
  return {
    jsonrpc: '2.0',
    id,
    result,
  }
}

// Common error codes for MCP
export const ErrorCodes = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
} as const
