# VisaCheckerMcp

MCP TypeScript server: visa-checker-mcp

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
- **Hono** - Ultra-lightweight web framework (14kB, zero dependencies)
- **TypeScript** - Full type safety with native Bun support
- **ESLint + Prettier** - Code linting and formatting

### 📡 **Complete MCP Server Implementation**
- **Tools**: Parameter validation with example calculator and weather API
- **Resources**: Static config and dynamic template resources  
- **Prompts**: Code review prompt with configurable focus areas
- **Transports**: Both stdio (process communication) and HTTP+SSE (web-based)
- **Standards Compliant**: Follows official MCP specification
- **Logging**: Transport-aware logging system for proper MCP client compatibility

### 🛠️ **Built-in Capabilities**

- **Tools**: Calculator (`add`), Weather API (`fetch-weather`)
- **Resources**: Static config (`config://app`), Dynamic greeting (`greeting://{name}`)
- **Prompts**: Code review with focus options (security, performance, readability, all)
- **Transport-aware Logging**: Proper stderr logging for stdio, console logging for HTTP
- **Zod Validation**: Runtime type checking for all parameters

## 📁 Project Structure

```
visa-checker-mcp/
├── src/
│   ├── index.ts        # Main server with stdio transport
│   ├── http.ts         # HTTP server with SSE support
│   └── stdio.ts        # Stdio transport utilities
├── docs/               # Documentation and guides
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
└── README.md          # This file
```

## 🎯 Usage Examples

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