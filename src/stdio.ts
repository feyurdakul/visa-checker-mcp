#!/usr/bin/env bun

import { startServer } from './index.js'

// Start server with stdio transport
startServer('stdio').catch(error => {
  console.error('❌ Failed to start stdio server:', error)
  process.exit(1)
})
