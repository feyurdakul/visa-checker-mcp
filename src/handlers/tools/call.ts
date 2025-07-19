import type { ToolsCallRequest, ToolsCallResponse } from '@/types/requests.js'
import { logger } from '@/utils/logger.js'
import { CalculatorService } from '@/services/calculator.js'
import { WeatherService } from '@/services/weather.js'

export async function handleToolsCall(
  request: ToolsCallRequest
): Promise<ToolsCallResponse> {
  const { name, arguments: args } = request.params
  logger.info(`🔧 Tool call request: ${name}`, args)

  // Validate arguments exist
  if (!args) {
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32602,
        message: 'Invalid params: arguments required',
      },
    }
  }

  try {
    let result: any

    switch (name) {
      case 'add':
        result = CalculatorService.add(args.a, args.b)
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            content: [
              {
                type: 'text',
                text: `${args.a} + ${args.b} = ${result}`,
              },
            ],
          },
        }

      case 'subtract':
        result = CalculatorService.subtract(args.a, args.b)
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            content: [
              {
                type: 'text',
                text: `${args.a} - ${args.b} = ${result}`,
              },
            ],
          },
        }

      case 'multiply':
        result = CalculatorService.multiply(args.a, args.b)
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            content: [
              {
                type: 'text',
                text: `${args.a} × ${args.b} = ${result}`,
              },
            ],
          },
        }

      case 'divide':
        result = CalculatorService.divide(args.a, args.b)
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            content: [
              {
                type: 'text',
                text: `${args.a} ÷ ${args.b} = ${result}`,
              },
            ],
          },
        }

      case 'fetch-weather':
        result = await WeatherService.fetchWeatherData(args.city)
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          },
        }

      case 'get-forecast':
        const forecast = await WeatherService.getForecast(
          args.city,
          args.days || 5
        )
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            content: [
              {
                type: 'text',
                text: forecast.join('\n'),
              },
            ],
          },
        }

      default:
        logger.error(`❌ Unknown tool: ${name}`)
        return {
          jsonrpc: '2.0',
          id: request.id,
          error: {
            code: -32601,
            message: `Unknown tool: ${name}`,
          },
        }
    }
  } catch (error) {
    logger.error(`❌ Tool call error for ${name}:`, error)
    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      },
    }
  }
}
