import type {
  CompletionCompleteRequest,
  CompletionCompleteResponse,
} from '@/types/requests.js'
import { logger } from '@/utils/logger.js'

export async function handleCompletionComplete(
  request: CompletionCompleteRequest
): Promise<CompletionCompleteResponse> {
  const { ref, argument } = request.params

  logger.info('🔤 Completion complete request received', {
    refType: ref.type,
    refName: ref.name,
    refUri: ref.uri,
    argumentName: argument.name,
    argumentValue: argument.value,
  })

  try {
    let completions: string[] = []

    // Handle different reference types
    switch (ref.type) {
      case 'ref/prompt':
        completions = await getPromptCompletions(
          ref.name!,
          argument.name,
          argument.value
        )
        break

      case 'ref/resource':
        completions = await getResourceCompletions(
          ref.uri!,
          argument.name,
          argument.value
        )
        break

      default:
        logger.error(`❌ Unknown reference type: ${ref.type}`)
        return {
          jsonrpc: '2.0',
          id: request.id,
          error: {
            code: -32601,
            message: `Unknown reference type: ${ref.type}`,
          },
        }
    }

    const response: CompletionCompleteResponse = {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        completion: {
          values: completions,
          total: completions.length,
          hasMore: false,
        },
      },
    }

    logger.info(
      `✅ Completion complete response sent (${completions.length} completions)`
    )
    return response
  } catch (error) {
    logger.error('❌ Completion complete error:', error)
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: `Failed to complete: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}

async function getPromptCompletions(
  promptName: string,
  argumentName: string,
  value: string
): Promise<string[]> {
  // Provide completions based on prompt and argument
  switch (promptName) {
    case 'review-code':
      if (argumentName === 'language') {
        return [
          'javascript',
          'typescript',
          'python',
          'java',
          'go',
          'rust',
          'c++',
        ].filter(lang => lang.toLowerCase().includes(value.toLowerCase()))
      }
      if (argumentName === 'focus') {
        return ['security', 'performance', 'readability', 'all'].filter(focus =>
          focus.toLowerCase().includes(value.toLowerCase())
        )
      }
      break

    case 'explain-concept':
      if (argumentName === 'level') {
        return ['beginner', 'intermediate', 'advanced'].filter(level =>
          level.toLowerCase().includes(value.toLowerCase())
        )
      }
      if (argumentName === 'language') {
        return [
          'javascript',
          'typescript',
          'python',
          'java',
          'go',
          'rust',
          'c++',
        ].filter(lang => lang.toLowerCase().includes(value.toLowerCase()))
      }
      break

    case 'generate-tests':
      if (argumentName === 'framework') {
        return [
          'jest',
          'mocha',
          'vitest',
          'playwright',
          'cypress',
          'pytest',
          'junit',
        ].filter(framework =>
          framework.toLowerCase().includes(value.toLowerCase())
        )
      }
      break
  }

  return []
}

async function getResourceCompletions(
  uri: string,
  argumentName: string,
  value: string
): Promise<string[]> {
  // Provide completions based on resource URI and argument
  if (uri.startsWith('config://')) {
    return ['database', 'server', 'logging', 'security', 'features'].filter(
      section => section.toLowerCase().includes(value.toLowerCase())
    )
  }

  if (uri.startsWith('greeting://')) {
    return ['alice', 'bob', 'charlie', 'diana', 'eve', 'frank'].filter(name =>
      name.toLowerCase().includes(value.toLowerCase())
    )
  }

  return []
}
