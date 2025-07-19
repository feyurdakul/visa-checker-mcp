# Visa Checker MCP Server

A specialized MCP (Model Context Protocol) server for checking visa appointment availability in real-time

## ⚡ Quick Start

```bash
# Navigate to your project
cd visa-checker-mcp

# Install dependencies (20-30x faster than npm!)
bun install

# Run stdio transport server
bun run dev:stdio

# Run HTTP server with SSE support
bun run dev:http
```

## 🚀 Features

### 🔧 **Modern Tooling**
- **Bun** - Lightning-fast package manager and runtime
- **TypeScript** - Full type safety with comprehensive validation
- **ESLint + Prettier** - Code linting and formatting
- **Vitest** - Fast unit testing framework

### 📡 **Visa Appointment Checking**
- **Live Data**: Real-time visa appointment availability from visasbot.com API
- **Smart Caching**: 5-minute intelligent caching to reduce API load
- **Error Resilience**: Automatic fallback to cached data when API is unavailable
- **Comprehensive Filtering**: Filter by country, mission, status, and visa type
- **Rich Formatting**: Emoji-enhanced status indicators and detailed information

### 🛠️ **MCP Capabilities**

- **Tools**: 
  - `fetch-visa-appointments` - Get comprehensive appointment data with filtering
  - `get-open-appointments` - Get only centers with available appointments
  - `search-visa-centers` - Advanced search with multiple filter options
- **Resources**: 
  - `visa://appointments` - Complete live visa appointment data (JSON)
  - `visa://appointments/{country_code}/{mission_code}` - Filtered data by country codes
- **Features**:
  - **Transport-aware Logging**: Proper stderr logging for stdio compatibility
  - **Zod Validation**: Runtime type checking for all parameters
  - **Error Handling**: Graceful degradation with cached data fallback
  - **Standards Compliant**: Follows official MCP specification

## 📁 Project Structure

```
visa-checker-mcp/
├── src/
│   ├── index.ts            # Main MCP server with visa tools and resources
│   ├── services/
│   │   ├── visa.ts         # Visa API client and data processing
│   │   └── visa.test.ts    # Unit tests for visa service
│   ├── config/
│   │   └── server.ts       # Server configuration
│   └── utils/
│       └── logger.ts       # Transport-aware logging
├── package.json            # Project configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🎯 Usage Examples

### Visa Appointment Checking

The server provides powerful visa appointment checking capabilities through the visasbot.com API:

#### Available Tools:

1. **`fetch-visa-appointments`** - Get comprehensive visa appointment data
   ```typescript
   // Get all appointments
   await tool.call('fetch-visa-appointments', {})
   
   // Filter by country (Turkey to Netherlands)
   await tool.call('fetch-visa-appointments', {
     country_code: 'tur',
     mission_code: 'nld'
   })
   
   // Filter by status
   await tool.call('fetch-visa-appointments', {
     status: 'open'
   })
   ```

2. **`get-open-appointments`** - Get only centers with available appointments
   ```typescript
   // Get all open appointments
   await tool.call('get-open-appointments', {})
   
   // Filter open appointments by country
   await tool.call('get-open-appointments', {
     country_code: 'tur'
   })
   ```

3. **`search-visa-centers`** - Advanced search with multiple filters
   ```typescript
   await tool.call('search-visa-centers', {
     country_code: 'tur',
     mission_code: 'nld',
     visa_type: 'tourism',
     status: 'open'
   })
   ```

#### Available Resources:

- **`visa://appointments`** - Complete live visa appointment data (JSON)
- **`visa://appointments/{country_code}/{mission_code}`** - Filtered data by country codes

#### Features:
- 🚀 **Live Data**: Fetches real-time appointment availability
- ⚡ **Smart Caching**: 5-minute cache to reduce API calls
- 🔍 **Advanced Filtering**: By country, mission, status, and visa type
- 📊 **Rich Formatting**: Emoji-enhanced status indicators
- 🛡️ **Error Resilience**: Automatic fallback to cached data when API is unavailable
- ⚠️ **Graceful Degradation**: Clear warnings when using cached data
- ✅ **Type Safety**: Full TypeScript validation with Zod schemas
- 🔄 **Timeout Protection**: 10-second timeout with proper error handling

### Development

```bash
# Run stdio transport server (for process communication)
bun run dev:stdio

# Run HTTP server with SSE support (for web-based communication)
bun run dev:http

# Type checking
bun run typecheck

# Linting and formatting
bun run lint
bun run format
```

### Testing Your Server

To test your MCP server, you can:

1. **Use Claude Desktop**: Add your server to Claude Desktop configuration
2. **Use an MCP client library**: Connect programmatically via stdio or HTTP
3. **Manual testing**: Send JSON-RPC messages directly to the server

Example Claude Desktop configuration:
```json
{
  "mcpServers": {
    "visa-checker-mcp": {
      "command": "/path/to/bun",
      "args": ["/absolute/path/to/visa-checker-mcp/src/index.ts"]
    }
  }
}
```

**Getting the correct paths:**
```bash
# Get your bun path
which bun
# Example output: /Users/username/.bun/bin/bun

# Get your project path  
echo "$(pwd)/src/index.ts"
# Example output: /Users/username/Dev/visa-checker-mcp/src/index.ts
```

**Complete working example:**
```json
{
  "mcpServers": {
    "visa-checker-mcp": {
      "command": "/Users/username/.bun/bin/bun",
      "args": ["/Users/username/Dev/visa-checker-mcp/src/index.ts"]
    }
  }
}
```

## 🔗 Transport Support

### stdio Transport
Perfect for local development and CLI tools:
- Direct process communication
- Low latency
- Simple debugging

### HTTP + SSE Transport  
Ideal for web applications and remote services:
- RESTful API endpoints
- Server-Sent Events for real-time updates
- CORS support for browser clients
- Session management

## 🏗️ Development

```bash
# Install dependencies
bun install

# Lint and format
bun run lint
bun run format

# Build server
bun run build

# Clean build artifacts
bun run clean
```

## 📊 Performance Benefits

| Metric | npm/Express | Bun/Hono | Improvement |
|--------|-------------|-----------|-------------|
| Install Speed | ~15s | ~2s | **7.5x faster** |
| Framework Size | ~200kB | ~14kB | **93% smaller** |
| Runtime Overhead | High | Minimal | **Native TypeScript** |
| Cold Start | ~500ms | ~50ms | **10x faster** |

## 🤝 Contributing

1. Fork the repository at https://github.com/kiliczsh/visa-checker-mcp
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**MCP Server JSON Parsing Errors**
If you see: `Unexpected token '🔧', "🔧 Registe"... is not valid JSON`

This occurs when using console.log() with stdio transport. The template uses transport-aware logging that automatically uses stderr for stdio transport to avoid interfering with JSON-RPC messages on stdout.

**Claude Desktop Configuration Issues**
1. **Use absolute paths**: Relative paths won't work
2. **Check bun path**: Run `which bun` to get the correct command
3. **Verify file exists**: Make sure the TypeScript file path is correct
4. **Restart Claude Desktop**: Required after config changes

**Type Checking Errors**
Run `bun run typecheck` to check for TypeScript issues.

**Server Connection Issues**
1. Test locally first: `bun run dev:stdio`
2. Check Claude Desktop logs for error messages  
3. Ensure the server process has started and the specified command/args are correct
4. Verify bun is installed and accessible at the specified path

**Path Issues**
```bash
# Test if bun command works
/path/to/bun --version

# Test if your server starts
/path/to/bun /path/to/your/project/src/index.ts
```

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) - The open standard this template implements
- [Bun](https://bun.sh/) - The incredibly fast JavaScript runtime and toolkit  
- [Hono](https://hono.dev/) - The ultrafast web framework for the Edges