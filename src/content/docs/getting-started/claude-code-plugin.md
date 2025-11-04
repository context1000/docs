---
title: Claude Code Plugin
description: Set up context1000 as a Claude Code plugin
---

This guide walks you through integrating context1000 with Claude Code using the Model Context Protocol (MCP).

## Prerequisites

- Claude Code installed
- context1000 CLI installed (`npm install -g context1000`)
- Qdrant running locally (see [Local RAG Setup](/getting-started/local-rag/))
- Documentation already indexed

## Quick Setup

### 1. Start the MCP Server

Start the context1000 MCP server with HTTP transport:

```bash
context1000 mcp --transport http --port 3000
```

The server will start on `http://localhost:3000/mcp`.

### 2. Add to Claude Code

Add the MCP server to Claude Code:

```bash
claude mcp add --transport http context1000 http://localhost:3000/mcp
```

### 3. Verify Installation

List configured MCP servers to confirm:

```bash
claude mcp list
```

You should see `context1000` in the list.

## Usage

Claude Code will automatically use the context1000 MCP tools when relevant to your queries.

### Available Tools

The plugin provides four specialized tools:

1. **check_project_rules** - Retrieve project constraints and requirements
2. **search_guides** - Find implementation patterns and examples
3. **search_decisions** - Access architectural decision context
4. **search_documentation** - General documentation search

### Example Usage

**User**: "What are the coding standards for this project?"

**Claude**: *Automatically calls `check_project_rules({})`* and displays the rules

**User**: "How do I implement authentication?"

**Claude**:
1. Calls `check_project_rules()` to get auth rules
2. Calls `search_guides()` to find setup guides
3. Calls `search_decisions()` for decision context
4. Provides comprehensive answer with full context

### Manual Tool Invocation

You can explicitly request tool usage:

```
User: "Use check_project_rules to show me all TypeScript rules"

Claude: [Calls check_project_rules() and filters for TypeScript]
```

## Configuration Options

### Custom Port

If port 3000 is in use, specify a different port:

```bash
context1000 mcp --transport http --port 3001
```

Then update Claude Code configuration:

```bash
claude mcp remove context1000
claude mcp add --transport http context1000 http://localhost:3001/mcp
```

### Multiple Projects

Run multiple MCP servers for different projects on different ports:

```bash
# Project A
context1000 mcp --transport http --port 3000

# Project B
context1000 mcp --transport http --port 3001
```

Add each to Claude Code:

```bash
claude mcp add --transport http project-a http://localhost:3000/mcp
claude mcp add --transport http project-b http://localhost:3001/mcp
```

## Troubleshooting

### Server Won't Start

**Problem**: `EADDRINUSE` error

**Solution**: Port is in use. The server will auto-increment to the next available port, or specify a different port:

```bash
context1000 mcp --transport http --port 4000
```

### Claude Code Not Using Tools

**Problem**: Claude doesn't invoke MCP tools

**Solutions**:
1. Verify MCP server is running: `curl http://localhost:3000/ping`
2. Check Claude MCP config: `claude mcp list`
3. Re-add server:
   ```bash
   claude mcp remove context1000
   claude mcp add --transport http context1000 http://localhost:3000/mcp
   ```
4. Restart Claude Code

### No Results Returned

**Problem**: Queries return empty results

**Causes**:
1. Collection not indexed: Run `context1000 index .context1000`
2. Query too specific: Try broader search terms
3. Filters too restrictive: Remove type/project filters

**Debug**:
```bash
# Re-index documentation
context1000 index .context1000

# Verify Qdrant connection
curl http://localhost:6333/collections/context1000
```

### Health Check

Verify the server is running:

```bash
curl http://localhost:3000/ping
# Should return: pong
```

## Best Practices

### For Effective AI Assistance

1. **Keep documentation updated** - Stale docs lead to poor AI outputs
2. **Use cross-references** - Link ADRs → Rules → Guides
3. **Write clear titles** - They provide context for chunks
4. **Tag appropriately** - Improves filtering accuracy
5. **Re-index after changes** - Run `context1000 index .context1000` after updating docs

### Query Patterns

Claude Code works best when:
- Starting broad ("What are the project rules?")
- Then narrowing down ("How do I implement feature X?")
- Following up with specific questions about decisions

## Advanced Configuration

### STDIO Transport

For direct process communication instead of HTTP:

```bash
context1000 mcp --transport stdio
```

Configure in Claude Code with STDIO transport (consult Claude Code documentation for STDIO setup).

### Custom Collection

Use a different Qdrant collection name:

```bash
# Index with custom collection
context1000 index .context1000 --collection my-project

# Start MCP server with same collection
context1000 mcp --transport http --port 3000 --collection my-project
```

## Next Steps

- [Learn about MCP Integration](/guides/mcp-integration/) for advanced usage
- [Explore tool usage patterns](/guides/mcp-integration/#recommended-tool-usage-flow) for optimal results
- [Understand artifact types](/core-concepts/decisions/) to write better documentation
