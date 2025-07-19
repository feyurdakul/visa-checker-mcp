import type {
  LogLevel,
  McpRequest,
  McpResponse,
  PromptDefinition,
  ResourceDefinition,
  ServerCapabilities,
  SessionInfo,
  ToolDefinition,
} from './mcp.js'

// Initialize request/response
export interface InitializeRequest extends McpRequest {
  method: 'initialize'
  params: {
    protocolVersion: string
    capabilities: {
      roots?: {
        listChanged?: boolean
      }
      sampling?: Record<string, any>
      experimental?: Record<string, any>
    }
    clientInfo: {
      name: string
      version: string
    }
  }
}

export interface InitializeResponse extends McpResponse {
  result: {
    protocolVersion: string
    capabilities: ServerCapabilities
    serverInfo: {
      name: string
      version: string
    }
  }
}

// Discovery request/response
export interface DiscoveryRequest extends McpRequest {
  method: 'discovery'
}

export interface DiscoveryResponse extends McpResponse {
  result: {
    capabilities: ServerCapabilities
    tools: ToolDefinition[]
    resources: ResourceDefinition[]
    prompts: PromptDefinition[]
  }
}

// Tools requests/responses
export interface ToolsListRequest extends McpRequest {
  method: 'tools/list'
}

export interface ToolsListResponse extends McpResponse {
  result: {
    tools: ToolDefinition[]
  }
}

export interface ToolsCallRequest extends McpRequest {
  method: 'tools/call'
  params: {
    name: string
    arguments?: Record<string, any>
  }
}

export interface ToolsCallResponse extends McpResponse {
  result?: {
    content: Array<{
      type: 'text' | 'image' | 'resource'
      text?: string
      data?: string
      uri?: string
      mimeType?: string
    }>
    isError?: boolean
  }
}

// Resources requests/responses
export interface ResourcesListRequest extends McpRequest {
  method: 'resources/list'
}

export interface ResourcesListResponse extends McpResponse {
  result: {
    resources: ResourceDefinition[]
  }
}

export interface ResourcesReadRequest extends McpRequest {
  method: 'resources/read'
  params: {
    uri: string
  }
}

export interface ResourcesReadResponse extends McpResponse {
  result?: {
    contents: Array<{
      uri: string
      text?: string
      blob?: string
      mimeType?: string
    }>
  }
}

export interface ResourcesSubscribeRequest extends McpRequest {
  method: 'resources/subscribe'
  params: {
    uri: string
  }
}

export interface ResourcesUnsubscribeRequest extends McpRequest {
  method: 'resources/unsubscribe'
  params: {
    uri: string
  }
}

export interface ResourcesTemplatesListRequest extends McpRequest {
  method: 'resources/templates/list'
}

export interface ResourcesTemplatesListResponse extends McpResponse {
  result: {
    resourceTemplates: Array<{
      uriTemplate: string
      name: string
      description?: string
      mimeType?: string
    }>
  }
}

// Prompts requests/responses
export interface PromptsListRequest extends McpRequest {
  method: 'prompts/list'
}

export interface PromptsListResponse extends McpResponse {
  result: {
    prompts: PromptDefinition[]
  }
}

export interface PromptsGetRequest extends McpRequest {
  method: 'prompts/get'
  params: {
    name: string
    arguments?: Record<string, any>
  }
}

export interface PromptsGetResponse extends McpResponse {
  result?: {
    description?: string
    messages: Array<{
      role: 'user' | 'assistant' | 'system'
      content: {
        type: 'text' | 'image' | 'resource'
        text?: string
        data?: string
        uri?: string
        mimeType?: string
      }
    }>
  }
}

// Sampling request/response
export interface SamplingCreateMessageRequest extends McpRequest {
  method: 'sampling/createMessage'
  params: {
    messages: Array<{
      role: 'user' | 'assistant' | 'system'
      content: any
    }>
    modelPreferences?: {
      hints?: Array<{
        name?: string
      }>
      costPriority?: number
      speedPriority?: number
      intelligencePriority?: number
    }
    systemPrompt?: string
    includeContext?: 'none' | 'thisServer' | 'allServers'
    temperature?: number
    maxTokens?: number
    stopSequences?: string[]
    metadata?: Record<string, any>
  }
}

export interface SamplingCreateMessageResponse extends McpResponse {
  result?: {
    role: 'assistant'
    content: {
      type: 'text'
      text: string
    }
    model: string
    stopReason?: 'endTurn' | 'stopSequence' | 'maxTokens'
  }
}

// Completion request/response
export interface CompletionCompleteRequest extends McpRequest {
  method: 'completion/complete'
  params: {
    ref: {
      type: 'ref/prompt' | 'ref/resource'
      name?: string
      uri?: string
    }
    argument: {
      name: string
      value: string
    }
  }
}

export interface CompletionCompleteResponse extends McpResponse {
  result?: {
    completion: {
      values: string[]
      total?: number
      hasMore?: boolean
    }
  }
}

// Other requests
export interface ElicitationCreateRequest extends McpRequest {
  method: 'elicitation/create'
  params: {
    type: 'input' | 'confirmation' | 'selection'
    message: string
    options?: string[]
    defaultValue?: string
  }
}

export interface RootsListRequest extends McpRequest {
  method: 'roots/list'
}

export interface RootsListResponse extends McpResponse {
  result: {
    roots: Array<{
      uri: string
      name?: string
    }>
  }
}

export interface LoggingSetLevelRequest extends McpRequest {
  method: 'logging/setLevel'
  params: {
    level: LogLevel
  }
}

export interface PingRequest extends McpRequest {
  method: 'ping'
}

export interface PingResponse extends McpResponse {
  result: Record<string, never>
}

export interface SessionCreateRequest extends McpRequest {
  method: 'session/create'
  params?: {
    metadata?: Record<string, any>
  }
}

export interface SessionCreateResponse extends McpResponse {
  result?: {
    session: SessionInfo
  }
}

export interface SessionDestroyRequest extends McpRequest {
  method: 'session/destroy'
  params: {
    sessionId: string
  }
}

export interface SessionDestroyResponse extends McpResponse {
  result?: Record<string, never>
}
