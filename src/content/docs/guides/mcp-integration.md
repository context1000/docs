---
title: MCP Integration
description: Integrating context1000 with Model Context Protocol and AI tools
---

context1000 exposes documentation through the Model Context Protocol (MCP), enabling AI agents to query and retrieve architectural context dynamically.

## What is MCP?

The Model Context Protocol is a standard for connecting AI assistants to external data sources and tools. context1000 implements MCP to provide four specialized tools for retrieving documentation.

## MCP Server

### Starting the Server

Start the MCP server with your preferred transport:

#### HTTP Transport (Recommended)

```bash
context1000 mcp --transport http --port 3000
```

The server exposes endpoints at:
- `/mcp` - Main MCP endpoint (HTTP streaming)
- `/sse` - Legacy SSE endpoint
- `/ping` - Health check

#### STDIO Transport

For direct process communication:

```bash
context1000 mcp --transport stdio
```

#### SSE Transport

For server-sent events:

```bash
context1000 mcp --transport sse --port 3000
```

### Server Configuration

The server automatically:
1. Connects to Qdrant at `QDRANT_URL` (from `.env`)
2. Initializes the `context1000` collection
3. Uses `text-embedding-3-small` for query embeddings (requires `OPENAI_API_KEY`)
4. Enables CORS for browser access
5. Implements automatic port fallback if port is in use

## Available MCP Tools

The MCP server exposes four tools for AI agents:

### 1. check_project_rules

**Purpose**: Retrieve project rules, constraints, and requirements

**When to call**: FIRST when starting any project task

**Parameters**:
```typescript
{
  project?: string;      // Project name filter (optional)
  max_results?: number;  // Max chunks to return (default: 15)
}
```

**Returns**:
```typescript
{
  rules: Array<{
    document: string;           // Rule content
    metadata: {
      title: string;
      type: "rule";
      filePath: string;
      tags: string[];
      projects: string[];
    };
    relevanceScore: number;     // 0-1 similarity score
  }>;
  rule_references: string[];    // Titles for further queries
  summary: string;              // Result summary
}
```

**Example usage**:
```typescript
// Get all rules
await tools.check_project_rules({});

// Get rules for specific project
await tools.check_project_rules({
  project: "frontend",
  max_results: 20
});
```

### 2. search_guides

**Purpose**: Find implementation guides and best practices

**When to call**: AFTER check_project_rules when specific guidance is needed

**Parameters**:
```typescript
{
  query: string;              // Required: what guidance you need
  project?: string;           // Project filter (optional)
  related_rules?: string[];   // Rule refs from check_project_rules
  max_results?: number;       // Max chunks (default: 10)
}
```

**Returns**:
```typescript
{
  guides: Array<{
    document: string;
    metadata: { /* ... */ };
    relevanceScore: number;
  }>;
  decision_references: string[];  // ADR/RFC refs found in guides
  summary: string;
}
```

**Example usage**:
```typescript
// Search for authentication guidance
await tools.search_guides({
  query: "authentication implementation",
  project: "backend",
  related_rules: ["auth-rules", "security-rules"]
});

// Find deployment process
await tools.search_guides({
  query: "deployment process kubernetes"
});
```

### 3. search_decisions

**Purpose**: Access architectural decisions (ADRs) and RFCs

**When to call**: When guides or rules reference specific decisions, or to understand rationale

**Parameters**:
```typescript
{
  query: string;              // Required: decision topic
  references?: string[];      // Specific ADR/RFC names
  project?: string;           // Project filter
  max_results?: number;       // Max chunks (default: 8)
}
```

**Returns**:
```typescript
{
  decisions: Array<{
    document: string;
    metadata: {
      title: string;
      type: "adr" | "rfc";
      status: string;
      // ...
    };
    relevanceScore: number;
  }>;
  summary: string;
}
```

**Example usage**:
```typescript
// Find decision about database choice
await tools.search_decisions({
  query: "database selection mongodb",
  references: ["ADR-042", "RFC-015"]
});

// Understand API versioning decision
await tools.search_decisions({
  query: "API versioning strategy GraphQL"
});
```

### 4. search_documentation

**Purpose**: General documentation search across all types

**When to call**: Fallback when specific tools don't provide enough information

**Parameters**:
```typescript
{
  query: string;                    // Required: search query
  project?: string;                 // Project filter
  type_filter?: Array<"adr" | "rfc" | "guide" | "rule" | "project">;
  max_results?: number;             // Max chunks (default: 10)
}
```

**Returns**:
```typescript
{
  documents: Array<{
    document: string;
    metadata: { /* ... */ };
    relevanceScore: number;
  }>;
  summary: string;
}
```

**Example usage**:
```typescript
// Search everything about caching
await tools.search_documentation({
  query: "caching strategy redis"
});

// Search only ADRs about testing
await tools.search_documentation({
  query: "testing strategy",
  type_filter: ["adr"]
});
```

## Recommended Tool Usage Flow

AI agents should follow this sequence:

```
1. check_project_rules({})
   → Get project constraints and requirements

2. search_guides({
     query: "specific need",
     related_rules: [...]
   })
   → Find implementation guidance

3. search_decisions({
     query: "topic",
     references: [...]
   })
   → Understand decision rationale (if needed)

4. search_documentation({ query: "..." })
   → Fallback for additional context
```

### Example: Implementing Authentication

```typescript
// Step 1: Check rules
const rules = await check_project_rules({
  project: "backend"
});
// Returns: JWT rules, auth requirements, security constraints

// Step 2: Find guides
const guides = await search_guides({
  query: "JWT authentication implementation",
  project: "backend",
  related_rules: ["jwt-rules", "security-rules"]
});
// Returns: Setup guide, code examples, best practices

// Step 3: Check decisions (if guide references them)
const decisions = await search_decisions({
  query: "JWT authentication",
  references: ["ADR-023"]  // Found in guide
});
// Returns: Why JWT was chosen, alternatives considered

// Now implement with full context
```

## Integrating with Claude Code

### Installation

Add the MCP server to Claude Code:

```bash
# Start the server first
context1000 mcp --transport http --port 3000

# In another terminal
claude mcp add --transport http context1000 http://localhost:3000/mcp
```

### Verification

List configured MCP servers:

```bash
claude mcp list
```

You should see `context1000` in the list.

### Usage in Claude Code

Claude Code will automatically use the MCP tools when relevant. For example:

**User**: "What are the coding standards for this project?"

**Claude**: *Automatically calls `check_project_rules({})`*
→ Returns and displays the rules

**User**: "How do I implement authentication?"

**Claude**:
1. *Calls `check_project_rules({ project: "backend" })`* → Gets auth rules
2. *Calls `search_guides({ query: "authentication", related_rules: [...] })`* → Gets setup guide
3. *Calls `search_decisions({ query: "authentication" })`* → Gets decision context
→ Provides comprehensive answer with context

### Manual Tool Invocation

You can explicitly request tool usage:

```
User: "Use check_project_rules to show me all TypeScript rules"

Claude: *Calls check_project_rules({})*
        *Filters results for TypeScript*
```

## Integration with Other AI Tools

### Cursor IDE

If using Cursor with MCP support:

1. Configure in `.cursor/config.json`:

```json
{
  "mcp": {
    "servers": {
      "context1000": {
        "command": "context1000",
        "args": ["mcp", "--transport", "stdio"]
      }
    }
  }
}
```

2. Restart Cursor
3. MCP tools will be available in AI commands

### Custom Integrations

Use the MCP SDK to integrate with your own tools:

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Connect to context1000 MCP server
const transport = new StdioClientTransport({
  command: 'context1000',
  args: ['mcp', '--transport', 'stdio']
});

const client = new Client({
  name: 'my-tool',
  version: '1.0.0'
}, {
  capabilities: {}
});

await client.connect(transport);

// Call tools
const result = await client.request({
  method: 'tools/call',
  params: {
    name: 'check_project_rules',
    arguments: {}
  }
});

console.log(JSON.parse(result.content[0].text));
```

## Advanced Configuration

### Custom Collection Name

Use a different Qdrant collection:

```typescript
// In your MCP server setup
await queryInterface.initialize("my-custom-collection");
```

### Custom Port Range

Try multiple ports automatically:

```bash
context1000 mcp --transport http --port 3000
```

If 3000 is in use, automatically tries 3001, 3002, etc.

### Multiple Project Collections

Run multiple MCP servers for different projects:

```bash
# Project A
QDRANT_URL=http://localhost:6333 \
context1000 mcp --transport http --port 3000

# Project B
QDRANT_URL=http://localhost:6334 \
context1000 mcp --transport http --port 3001
```

Configure different collections in Qdrant for isolation.

## Query Optimization

### Chunk Retrieval Strategy

The MCP server retrieves document chunks (not full documents) optimized for:
- **Max chunk size**: 1200 tokens
- **Overlap**: 200 tokens
- **Context**: Each chunk includes document title
- **Metadata**: Section type, tags, projects, cross-references

### Relevance Scoring

Results are scored using cosine similarity:
- **1.0**: Exact semantic match
- **0.8-0.9**: Highly relevant
- **0.6-0.7**: Moderately relevant
- **< 0.6**: Lower relevance

Scores help AI agents prioritize information.

### Filter Strategies

Combine filters for precision:

```typescript
// Type filter
await search_documentation({
  query: "authentication",
  type_filter: ["adr", "guide"]  // Only decisions and guides
});

// Project filter
await search_guides({
  query: "setup",
  project: "frontend"  // Only frontend guides
});

// Combined
await search_documentation({
  query: "testing patterns",
  project: "backend",
  type_filter: ["guide", "rule"]
});
```

## Monitoring and Debugging

### Health Check

```bash
curl http://localhost:3000/ping
# Should return: pong
```

### MCP Request Logging

The server logs all MCP requests:

```
context1000 RAG MCP Server running on HTTP at http://localhost:3000/mcp
Initializing global RAG for context1000
Connected to existing collection: context1000
```

### Testing Tools Directly

Use the MCP inspector (if available):

```bash
npx @modelcontextprotocol/inspector context1000 mcp --transport stdio
```

Or test via HTTP:

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

## Troubleshooting

### Server Won't Start

**Problem**: `EADDRINUSE` error

**Solution**: Port is in use. Server will auto-increment:
```bash
Port 3000 is in use, trying port 3001...
```

Or specify different port:
```bash
context1000 mcp --transport http --port 4000
```

### No Results Returned

**Problem**: Queries return empty results

**Causes**:
1. Collection not indexed: Run `context1000 index .context1000`
2. Query too specific: Broaden search terms
3. Filters too restrictive: Remove type/project filters

**Debug**:
```bash
# Check collection status
context1000 index .context1000  # Re-index
```

### Claude Code Not Using Tools

**Problem**: Claude doesn't invoke MCP tools

**Solutions**:
1. Verify MCP server is running: `curl http://localhost:3000/ping`
2. Check Claude MCP config: `claude mcp list`
3. Re-add server: `claude mcp remove context1000` then `claude mcp add ...`
4. Restart Claude Code

### Slow Query Performance

**Problem**: Queries take > 2 seconds

**Causes**:
1. Large collection (> 10K chunks)
2. High `max_results` parameter
3. Qdrant not optimized

**Solutions**:
1. Reduce `max_results`: Use 5-10 instead of 50
2. Add Qdrant indices (automatic for small collections)
3. Use filters to narrow search space

## Best Practices

### For AI Agents

1. **Always start with rules**: Call `check_project_rules` first
2. **Use related references**: Pass rule/decision refs to subsequent queries
3. **Filter by project**: When working in specific codebase
4. **Check relevance scores**: Ignore results < 0.6
5. **Follow decision chains**: Use `depends-on` metadata to trace context

### For Developers

1. **Keep documentation updated**: Stale docs = bad AI outputs
2. **Use cross-references**: Link ADRs → Rules → Guides
3. **Write clear titles**: They're used for chunk context
4. **Tag appropriately**: Improves filtering
5. **Re-index after changes**: `context1000 index .context1000`

## Summary

- MCP server exposes four specialized tools for documentation retrieval
- Start with `check_project_rules`, then `search_guides`, then `search_decisions`
- Integrate with Claude Code via HTTP transport
- Use filters and references for precise results
- Monitor relevance scores to gauge result quality

The MCP integration turns static documentation into dynamic, queryable context for AI agents.
