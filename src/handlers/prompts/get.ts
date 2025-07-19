import type { PromptsGetRequest, PromptsGetResponse } from '@/types/requests.js'
import { logger } from '@/utils/logger.js'

export async function handlePromptsGet(
  request: PromptsGetRequest
): Promise<PromptsGetResponse> {
  const { name, arguments: args = {} } = request.params
  logger.info(`💭 Prompt get request: ${name}`, args)

  try {
    let messages: any[]
    let description: string

    switch (name) {
      case 'review-code':
        description =
          'Generate a comprehensive code review with best practices and suggestions'
        const { code, language, focus = 'all' } = args

        const focusAreas = {
          security:
            'Focus on security vulnerabilities, input validation, and secure coding practices.',
          performance:
            'Focus on performance optimizations, algorithmic efficiency, and resource usage.',
          readability:
            'Focus on code clarity, naming conventions, and maintainability.',
          all: 'Provide a comprehensive review covering security, performance, readability, and best practices.',
        }

        messages = [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please review the following ${language || 'code'} and provide detailed feedback. ${focusAreas[focus as keyof typeof focusAreas] || focusAreas.all}

\`\`\`${language || ''}
${code}
\`\`\`

Please provide:
1. Overall assessment
2. Specific issues and suggestions
3. Best practices recommendations
4. Security considerations (if applicable)
5. Performance considerations (if applicable)`,
            },
          },
        ]
        break

      case 'explain-concept':
        description = 'Explain a programming concept with examples'
        const { concept, level = 'intermediate', language: conceptLang } = args

        messages = [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please explain the programming concept "${concept}" at a ${level} level. ${conceptLang ? `Use ${conceptLang} for examples.` : 'Include practical examples where appropriate.'}

Please structure your explanation with:
1. Clear definition
2. When and why to use it
3. Practical examples
4. Common pitfalls to avoid
5. Best practices`,
            },
          },
        ]
        break

      case 'debug-help':
        description = 'Get help debugging code issues'
        const { code: debugCode, error, context } = args

        messages = [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `I'm having trouble with this code. Please help me debug it.

**Code:**
\`\`\`
${debugCode}
\`\`\`

**Error/Issue:**
${error}

${context ? `**Additional Context:**\n${context}` : ''}

Please provide:
1. Analysis of the problem
2. Step-by-step debugging approach
3. Suggested fixes
4. Prevention strategies for similar issues`,
            },
          },
        ]
        break

      case 'optimize-code':
        description = 'Get suggestions for code optimization'
        const { code: optimizeCode, target = 'speed', constraints } = args

        messages = [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please help optimize this code for ${target}.

**Code:**
\`\`\`
${optimizeCode}
\`\`\`

${constraints ? `**Constraints:**\n${constraints}` : ''}

Please provide:
1. Performance analysis of current code
2. Specific optimization suggestions
3. Optimized code examples
4. Trade-offs and considerations
5. Performance measurement recommendations`,
            },
          },
        ]
        break

      case 'generate-tests':
        description = 'Generate unit tests for the provided code'
        const { code: testCode, framework, coverage = 'comprehensive' } = args

        messages = [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please generate ${coverage} unit tests for this code${framework ? ` using ${framework}` : ''}.

**Code to test:**
\`\`\`
${testCode}
\`\`\`

Please provide:
1. Test cases covering normal scenarios
2. Edge cases and error conditions
3. Mock setup if needed
4. Assertions and expected outcomes
5. Test organization and structure recommendations`,
            },
          },
        ]
        break

      default:
        logger.error(`❌ Unknown prompt: ${name}`)
        return {
          jsonrpc: '2.0',
          id: request.id,
          error: {
            code: -32601,
            message: `Unknown prompt: ${name}`,
          },
        }
    }

    const response: PromptsGetResponse = {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        description,
        messages,
      },
    }

    logger.info(`✅ Prompt get response sent for: ${name}`)
    return response
  } catch (error) {
    logger.error(`❌ Prompt get error for ${name}:`, error)
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32603,
        message: `Failed to get prompt: ${name}`,
      },
    }
  }
}
