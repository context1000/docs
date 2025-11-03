---
title: CLI Reference
description: Complete reference for the context1000 command-line interface
---

The context1000 CLI provides commands for indexing documentation and running the MCP server.

## Installation

```bash
npm install -g context1000
```

Verify installation:

```bash
context1000 --version
```

## Global Options

### --version

Display the installed version:

```bash
context1000 --version
# Output: 0.1.8
```

### --help

Display help for any command:

```bash
context1000 --help
context1000 index --help
context1000 mcp --help
```

## Commands

### index

Process and index documentation for vector search.

#### Syntax

```bash
context1000 index <docs-path>
```

#### Arguments

- `<docs-path>` (required): Path to the `.context1000` directory or documentation root

#### Description

The `index` command:

1. Recursively scans the specified directory for markdown files
2. Parses front matter and content
3. Splits documents into optimized chunks (1200 tokens with 200-token overlap)
4. Generates embeddings using OpenAI's `text-embedding-3-small`
5. Stores chunks and embeddings in Qdrant vector database
6. Displays indexing summary

#### Environment Variables

Required:
- `QDRANT_URL` - Qdrant server URL (default: `http://localhost:6333`)
- `OPENAI_API_KEY` - OpenAI API key for embeddings

Optional:
- `QDRANT_API_KEY` - Qdrant API key (if authentication is enabled)

#### Examples

Index documentation in current directory:

```bash
context1000 index .context1000
```

Index documentation in specific path:

```bash
context1000 index /path/to/project/.context1000
```

Index with custom Qdrant URL:

```bash
QDRANT_URL=http://qdrant.example.com:6333 context1000 index .context1000
```

#### Output

```
Starting document indexing...
Processing documents from: /path/to/.context1000
Processed 42 document chunks
Collection info: { name: 'context1000', count: 42, metadata: {...} }
Document indexing completed successfully!

Indexed document chunks:
- Use TypeScript for Type Safety (adr) - 2 chunks - .context1000/decisions/adr/use-typescript.adr.md
- TypeScript Development Rules (rule) - 1 chunks - .context1000/rules/typescript-rules.rules.md
- TypeScript Setup Guide (guide) - 3 chunks - .context1000/guides/typescript-setup.guide.md
...
```

#### Behavior

- **Incremental**: Re-indexing replaces the entire collection (deletes and recreates)
- **Recursive**: Processes all subdirectories
- **Filtering**: Ignores files starting with `_` (e.g., `_draft.md`)
- **Validation**: Warns about malformed files but continues processing
- **Deduplication**: Uses deterministic UUIDs based on file path + chunk index

#### Error Handling

Common errors:

**Qdrant Connection Failed**
```
Error: connect ECONNREFUSED 127.0.0.1:6333
```
**Solution**: Start Qdrant with `docker run -p 6333:6333 qdrant/qdrant`

**OpenAI API Key Missing**
```
Error: OPENAI_API_KEY not found in environment
```
**Solution**: Set `OPENAI_API_KEY` in `.env` file

**Invalid Document Format**
```
Error processing /path/to/file.md: Invalid front matter
```
**Solution**: Check YAML syntax in front matter

**Rate Limit Exceeded**
```
Error: OpenAI API rate limit exceeded
```
**Solution**: The CLI will automatically retry. Consider upgrading OpenAI tier for large documentation sets.

---

### mcp

Start the Model Context Protocol server.

#### Syntax

```bash
context1000 mcp [options]
```

#### Options

##### --transport <type>

Transport type for MCP server.

- **Values**: `stdio`, `http`, `sse`
- **Default**: `stdio`

**stdio**: Standard input/output (for direct process communication)
```bash
context1000 mcp --transport stdio
```

**http**: HTTP streaming (recommended for Claude Code)
```bash
context1000 mcp --transport http --port 3000
```

**sse**: Server-sent events (legacy)
```bash
context1000 mcp --transport sse --port 3000
```

##### --port <number>

Port for HTTP/SSE transport.

- **Default**: `3000`
- **Range**: Any valid port (1024-65535 recommended)
- **Auto-increment**: If port is in use, automatically tries next port

```bash
context1000 mcp --transport http --port 3001
```

#### Description

The `mcp` command:

1. Connects to Qdrant at `QDRANT_URL`
2. Initializes or connects to `context1000` collection
3. Starts MCP server on specified transport
4. Exposes four tools: `check_project_rules`, `search_guides`, `search_decisions`, `search_documentation`

#### Environment Variables

Required:
- `QDRANT_URL` - Qdrant server URL (default: `http://localhost:6333`)
- `OPENAI_API_KEY` - OpenAI API key for query embeddings

Optional:
- `QDRANT_API_KEY` - Qdrant API key (if authentication is enabled)

#### Examples

Start with HTTP transport (recommended):

```bash
context1000 mcp --transport http --port 3000
```

Start with stdio (for direct integration):

```bash
context1000 mcp --transport stdio
```

Start on custom port:

```bash
context1000 mcp --transport http --port 4000
```

Use with custom Qdrant:

```bash
QDRANT_URL=http://remote-qdrant:6333 context1000 mcp --transport http
```

#### Output

**HTTP Transport**:
```
context1000 RAG MCP Server running on HTTP at http://localhost:3000/mcp and legacy SSE at /sse
Initializing global RAG for context1000
Connected to existing collection: context1000
```

**STDIO Transport**:
```
context1000 RAG MCP server running on stdio
```

#### Endpoints (HTTP/SSE)

When using HTTP or SSE transport:

- **`/mcp`**: Main MCP endpoint (HTTP streaming, recommended)
- **`/sse`**: Server-sent events endpoint (legacy)
- **`/messages`**: SSE message posting endpoint
- **`/ping`**: Health check (returns "pong")

#### MCP Tools

The server exposes these tools to AI clients:

1. **check_project_rules**
   - Get project rules and constraints
   - Parameters: `project` (optional), `max_results` (default: 15)

2. **search_guides**
   - Find implementation guides
   - Parameters: `query` (required), `project`, `related_rules`, `max_results` (default: 10)

3. **search_decisions**
   - Access ADRs and RFCs
   - Parameters: `query` (required), `references`, `project`, `max_results` (default: 8)

4. **search_documentation**
   - General documentation search
   - Parameters: `query` (required), `project`, `type_filter`, `max_results` (default: 10)

#### Integration

**Claude Code**:
```bash
claude mcp add --transport http context1000 http://localhost:3000/mcp
```

**Cursor** (in `.cursor/config.json`):
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

#### Process Management

The MCP server runs as a foreground process. To run in background:

```bash
# Using nohup
nohup context1000 mcp --transport http --port 3000 > mcp.log 2>&1 &

# Using systemd (create /etc/systemd/system/context1000.service)
[Unit]
Description=context1000 MCP Server
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/project
Environment="QDRANT_URL=http://localhost:6333"
Environment="OPENAI_API_KEY=sk-..."
ExecStart=/usr/local/bin/context1000 mcp --transport http --port 3000
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

#### Error Handling

**Port Already in Use**:
```
Port 3000 is in use, trying port 3001...
```
Server automatically tries next port. To force specific port, ensure it's free first.

**Qdrant Connection Failed**:
```
Error: Failed to connect to Qdrant at http://localhost:6333
```
**Solution**: Start Qdrant or check `QDRANT_URL`

**Collection Not Found**:
```
Collection 'context1000' not found
```
**Solution**: Run `context1000 index .context1000` first

**OpenAI API Error**:
```
Error: OpenAI API request failed
```
**Solution**: Check `OPENAI_API_KEY` is valid and has sufficient quota

---

## Environment Configuration

### .env File

Create `.env` in your project root:

```bash
# Required
QDRANT_URL=http://localhost:6333
OPENAI_API_KEY=sk-...

# Optional
QDRANT_API_KEY=your-qdrant-key
```

The CLI automatically loads `.env` using `dotenv`.

### Environment Variable Precedence

1. Shell environment variables (highest priority)
2. `.env` file in current directory
3. Default values (lowest priority)

Example:

```bash
# Override .env settings
QDRANT_URL=http://remote:6333 context1000 index .context1000
```

---

## Advanced Usage

### Multiple Collections

Use different collections for different projects:

```bash
# Not directly supported via CLI, but you can:
# 1. Use different Qdrant databases
# 2. Modify collection name in code
# 3. Run multiple Qdrant instances
```

### Custom Embedding Models

The CLI currently uses `text-embedding-3-small`. To use different models, fork and modify:

```typescript
// In src/qdrant-client.ts
private embeddingModel: string = "text-embedding-3-large";
```

### Chunk Size Tuning

Default chunk size is 1200 tokens with 200-token overlap. To customize:

```typescript
// In src/document-processor.ts
private readonly MAX_CHUNK_TOKENS = 1500;
private readonly OVERLAP_TOKENS = 300;
```

### Batch Processing

For large documentation sets, process in batches:

```bash
# Index different sections separately
context1000 index .context1000/decisions
context1000 index .context1000/rules
context1000 index .context1000/guides
```

Note: This replaces the collection each time. For true batching, use the API directly.

---

## Programmatic Usage

The CLI is also available as a library:

```typescript
import { DocumentProcessor, QdrantClient, QueryInterface } from 'context1000';

// Index documents
const processor = new DocumentProcessor();
const chunks = await processor.processDocumentsToChunks('.context1000');

const qdrant = new QdrantClient();
await qdrant.initialize('my-collection');
await qdrant.addDocuments(chunks);

// Query documents
const query = new QueryInterface();
await query.initialize('my-collection');
const results = await query.queryDocs('authentication rules', {
  maxResults: 10,
  filterByType: ['rule', 'guide']
});
```

---

## Troubleshooting

### General Issues

**Command not found**:
```bash
context1000: command not found
```
**Solution**: Reinstall globally with `npm install -g context1000`

**Permission denied**:
```bash
Error: EACCES: permission denied
```
**Solution**: Run with `sudo` or fix npm permissions

### Indexing Issues

**No documents processed**:
```
Processed 0 document chunks
```
**Causes**:
1. Wrong path specified
2. No `.md` files found
3. All files start with `_` (ignored)
4. No valid front matter

**Check**:
```bash
ls -la .context1000/**/*.md
```

**Slow indexing**:
- Large documentation sets take time
- Each chunk requires OpenAI API call
- Rate limits may cause delays

### MCP Server Issues

**Server crashes on startup**:
Check logs for specific error. Common causes:
1. Missing environment variables
2. Qdrant not running
3. Invalid collection state

**No tools available in Claude**:
1. Verify server is running: `curl http://localhost:3000/ping`
2. Check MCP registration: `claude mcp list`
3. Re-add server: `claude mcp remove context1000 && claude mcp add ...`

---

## Examples

### Complete Workflow

```bash
# 1. Setup
docker run -p 6333:6333 qdrant/qdrant
echo "QDRANT_URL=http://localhost:6333" > .env
echo "OPENAI_API_KEY=sk-..." >> .env

# 2. Create documentation
mkdir -p .context1000/decisions/adr
echo '---
name: use-typescript
title: Use TypeScript
status: accepted
---

# Use TypeScript

## Context
Need type safety.

## Decision
Use TypeScript.

## Consequences
Better code quality.' > .context1000/decisions/adr/use-typescript.adr.md

# 3. Index
context1000 index .context1000

# 4. Start MCP server
context1000 mcp --transport http --port 3000

# 5. Integrate with Claude
claude mcp add --transport http context1000 http://localhost:3000/mcp

# 6. Use in Claude
# Ask Claude: "What are the project rules?"
```

### CI/CD Integration

```yaml
# .github/workflows/docs.yml
name: Index Documentation

on:
  push:
    paths:
      - '.context1000/**'

jobs:
  index:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Start Qdrant
        run: docker run -d -p 6333:6333 qdrant/qdrant

      - name: Install context1000
        run: npm install -g context1000

      - name: Index documentation
        env:
          QDRANT_URL: http://localhost:6333
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: context1000 index .context1000
```

---

## See Also

- [Getting Started Guide](/guides/getting-started/) - Initial setup walkthrough
- [MCP Integration](/guides/mcp-integration/) - Detailed MCP usage
- [Format Specification](/reference/format-specification/) - Documentation format details
