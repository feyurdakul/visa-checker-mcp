export interface McpRequest {
  jsonrpc: '2.0'
  id: string | number
  method: string
  params?: any
}

export interface McpResponse {
  jsonrpc: '2.0'
  id: string | number
  result?: any
  error?: McpError
}

export interface McpError {
  code: number
  message: string
  data?: any
}

export interface McpNotification {
  jsonrpc: '2.0'
  method: string
  params?: any
}

export interface ServerCapabilities {
  logging?: {
    levels?: string[]
  }
  experimental?: Record<string, any>
  tools?: {
    listChanged?: boolean
  }
  resources?: {
    subscribe?: boolean
    listChanged?: boolean
  }
  prompts?: {
    listChanged?: boolean
  }
  sampling?: Record<string, any>
}

export interface ToolDefinition {
  name: string
  description?: string
  inputSchema: any
}

export interface ResourceDefinition {
  uri: string
  name: string
  description?: string
  mimeType?: string
}

export interface PromptDefinition {
  name: string
  description?: string
  arguments?: PromptArgument[]
}

export interface PromptArgument {
  name: string
  description?: string
  required?: boolean
}

export type LogLevel =
  | 'debug'
  | 'info'
  | 'notice'
  | 'warning'
  | 'error'
  | 'critical'
  | 'alert'
  | 'emergency'

export interface SessionInfo {
  id: string
  created: string
  lastActivity: string
  metadata?: Record<string, any>
}
