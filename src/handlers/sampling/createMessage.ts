import type {
  SamplingCreateMessageRequest,
  SamplingCreateMessageResponse,
} from '@/types/requests.js'
import { logger } from '@/utils/logger.js'

export async function handleSamplingCreateMessage(
  request: SamplingCreateMessageRequest
): Promise<SamplingCreateMessageResponse> {
  const {
    messages,
    modelPreferences,
    systemPrompt,
    includeContext,
    temperature,
    maxTokens,
    stopSequences,
    metadata,
  } = request.params

  logger.info('🎯 Sampling createMessage request received', {
    messageCount: messages.length,
    temperature,
    maxTokens,
    includeContext,
  })

  try {
    // In a real implementation, this would:
    // 1. Forward the request to an LLM API (OpenAI, Anthropic, etc.)
    // 2. Handle model preferences and context inclusion
    // 3. Apply temperature and token limits
    // 4. Return the actual LLM response

    // For this template, we'll return a mock response
    const mockResponses = [
      "I understand you'd like me to help with that. In a real implementation, this would be handled by an actual language model.",
      'This is a template response from the MCP sampling handler. The actual implementation would integrate with your preferred LLM provider.',
      'Thank you for your request. This sampling endpoint would typically forward your message to a language model and return the response.',
      'In a production implementation, this handler would process your messages through an LLM API and return the generated response.',
    ]

    const responseText =
      mockResponses[Math.floor(Math.random() * mockResponses.length)]

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100))

    const response: SamplingCreateMessageResponse = {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        role: 'assistant',
        content: {
          type: 'text',
          text: responseText,
        },
        model: 'mcp-template-mock-model',
        stopReason: 'endTurn',
      },
    }

    logger.info('✅ Sampling createMessage response sent')
    return response
  } catch (error) {
    logger.error('❌ Sampling createMessage error:', error)
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: `Failed to create message: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}
