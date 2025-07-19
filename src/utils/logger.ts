export class Logger {
  private static instance: Logger
  private transport: 'stdio' | 'http' = 'stdio'

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  setTransport(transport: 'stdio' | 'http') {
    this.transport = transport
  }

  info(message: string, data?: any) {
    this.log('info', message, data)
  }

  error(message: string, data?: any) {
    this.log('error', message, data)
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data)
  }

  warning(message: string, data?: any) {
    this.log('warning', message, data)
  }

  private log(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString()

    if (this.transport === 'stdio') {
      // For stdio transport, use stderr to avoid interfering with JSON-RPC on stdout
      console.error(
        `[${timestamp}] [${level.toUpperCase()}] ${message}`,
        data ? data : ''
      )
    } else {
      // For HTTP transport, use regular console.log
      console.log(
        `[${timestamp}] [${level.toUpperCase()}] ${message}`,
        data ? data : ''
      )
    }
  }
}

export const logger = Logger.getInstance()
