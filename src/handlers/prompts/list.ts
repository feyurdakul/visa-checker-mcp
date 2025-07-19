import type {
  PromptsListRequest,
  PromptsListResponse,
} from '@/types/requests.js'
import type { PromptDefinition } from '@/types/mcp.js'
import { logger } from '@/utils/logger.js'

export async function handlePromptsList(
  request: PromptsListRequest
): Promise<PromptsListResponse> {
  logger.info('💭 Prompts list request received')

  const prompts: PromptDefinition[] = [
    {
      name: 'review-code',
      description:
        'Generate a comprehensive code review with best practices and suggestions',
      arguments: [
        {
          name: 'code',
          description: 'The code to review',
          required: true,
        },
        {
          name: 'language',
          description: 'Programming language (auto-detected if not provided)',
          required: false,
        },
        {
          name: 'focus',
          description:
            'Review focus area (security, performance, readability, all)',
          required: false,
        },
      ],
    },
    {
      name: 'explain-concept',
      description: 'Explain a programming concept with examples',
      arguments: [
        {
          name: 'concept',
          description: 'The programming concept to explain',
          required: true,
        },
        {
          name: 'level',
          description: 'Explanation level (beginner, intermediate, advanced)',
          required: false,
        },
        {
          name: 'language',
          description: 'Programming language for examples',
          required: false,
        },
      ],
    },
    {
      name: 'debug-help',
      description: 'Get help debugging code issues',
      arguments: [
        {
          name: 'code',
          description: 'The problematic code',
          required: true,
        },
        {
          name: 'error',
          description: 'Error message or description of the issue',
          required: true,
        },
        {
          name: 'context',
          description: 'Additional context about when the error occurs',
          required: false,
        },
      ],
    },
    {
      name: 'optimize-code',
      description: 'Get suggestions for code optimization',
      arguments: [
        {
          name: 'code',
          description: 'The code to optimize',
          required: true,
        },
        {
          name: 'target',
          description: 'Optimization target (speed, memory, readability)',
          required: false,
        },
        {
          name: 'constraints',
          description: 'Any constraints or requirements to consider',
          required: false,
        },
      ],
    },
    {
      name: 'generate-tests',
      description: 'Generate unit tests for the provided code',
      arguments: [
        {
          name: 'code',
          description: 'The code to generate tests for',
          required: true,
        },
        {
          name: 'framework',
          description: 'Testing framework to use',
          required: false,
        },
        {
          name: 'coverage',
          description: 'Desired test coverage level',
          required: false,
        },
      ],
    },
  ]

  const response: PromptsListResponse = {
    jsonrpc: '2.0',
    id: request.id,
    result: {
      prompts,
    },
  }

  logger.info(`✅ Prompts list response sent (${prompts.length} prompts)`)
  return response
}
