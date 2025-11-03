---
title: Getting Started
description: Set up context1000 in your project
---

This guide walks you through setting up context1000 for your project, from installation to your first documentation artifacts.

## Prerequisites

- Node.js 18+ installed
- Docker installed (for Qdrant vector database)
- OpenAI API key (for embeddings)

## Installation

Install the context1000 CLI globally:

```bash
npm install -g context1000
```

Verify the installation:

```bash
context1000 --version
```

## Environment Setup

### 1. Start Qdrant Vector Database

Qdrant is used for storing and searching document embeddings:

```bash
docker run -p 6333:6333 qdrant/qdrant
```

This starts Qdrant on `http://localhost:6333`.

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```bash
touch .env
```

Add the following configuration:

```bash
QDRANT_URL=http://localhost:6333
OPENAI_API_KEY=your-openai-api-key-here
```

Replace `your-openai-api-key-here` with your actual OpenAI API key. This is used for generating embeddings with the `text-embedding-3-small` model.

## Create Your First Documentation Structure

### 1. Initialize Directory Structure

Create the `.context1000` directory in your project root:

```bash
mkdir -p .context1000/{decisions/{adr,rfc},rules,guides,projects}
```

This creates the complete directory structure:

```
.context1000/
├── decisions/
│   ├── adr/
│   └── rfc/
├── rules/
├── guides/
└── projects/
```

### 2. Create an Index File

Create `.context1000/index.md`:

```markdown
---
name: project-name
title: Your Project Name
tags: [project, documentation]
---

# Project Documentation

This is the main index for your project's context1000 documentation.

## Overview

Brief description of your project and its documentation structure.

## Key Resources

- [Decisions](/decisions/)
- [Rules](/rules/)
- [Guides](/guides/)
```

### 3. Create Your First ADR

Create `.context1000/decisions/adr/use-typescript.adr.md`:

```markdown
---
name: use-typescript
title: Use TypeScript for Type Safety
status: accepted
tags: [typescript, tooling]
related:
  rules: [typescript-rules]
---

# Use TypeScript for Type Safety

## Context

Our codebase has grown and we're experiencing runtime errors that could be caught at compile time.

## Decision

We will use TypeScript for all new code and gradually migrate existing JavaScript code.

## Consequences

### Positive
- Catch type errors at compile time
- Better IDE support and autocomplete
- Self-documenting code through types

### Negative
- Learning curve for team members unfamiliar with TypeScript
- Additional build step required
- Some third-party libraries lack type definitions
```

### 4. Create Corresponding Rules

Create `.context1000/rules/typescript-rules.rules.md`:

```markdown
---
name: typescript-rules
title: TypeScript Development Rules
tags: [typescript, coding-standards]
related:
  depends-on:
    adrs: [use-typescript]
---

# TypeScript Development Rules

1. All new files MUST use `.ts` or `.tsx` extensions
2. Use `strict` mode in `tsconfig.json`
3. Avoid using `any` type - use `unknown` if type is truly unknown
4. Define interfaces for all public APIs
5. Use type inference where possible
6. Export types alongside implementation
```

### 5. Create an Implementation Guide

Create `.context1000/guides/typescript-setup.guide.md`:

```markdown
---
name: typescript-setup
title: TypeScript Setup Guide
tags: [typescript, setup]
related:
  adrs: [use-typescript]
  rules: [typescript-rules]
---

# TypeScript Setup Guide

This guide explains how to set up TypeScript in this project.

## Installation

```bash
npm install --save-dev typescript @types/node
```

## Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Build

```bash
npx tsc
```

## IDE Setup

For VS Code, install the TypeScript extension and enable:
- Format on save
- Auto imports
```

## Index Your Documentation

Process and index your documentation:

```bash
context1000 index .context1000
```

You should see output like:

```
Starting document indexing...
Processing documents from: /path/to/project/.context1000
Processed 3 document chunks
Collection info: { name: 'context1000', count: 3 }
Document indexing completed successfully!

Indexed document chunks:
- Use TypeScript for Type Safety (adr) - 1 chunks
- TypeScript Development Rules (rule) - 1 chunks
- TypeScript Setup Guide (guide) - 1 chunks
```

## Start the MCP Server

Start the Model Context Protocol server to expose your documentation to AI tools:

```bash
context1000 mcp --transport http --port 3000
```

The server will start on `http://localhost:3000/mcp`.

## Integrate with Claude Code

Add the MCP server to Claude Code:

```bash
claude mcp add --transport http context1000 http://localhost:3000/mcp
```

Now Claude Code can access your documentation through the four tools:
- `check_project_rules`
- `search_guides`
- `search_decisions`
- `search_documentation`

## Verify Integration

In Claude Code, try asking:

> "What are the TypeScript rules for this project?"

Claude should retrieve and display your TypeScript rules using the `check_project_rules` tool.

## Next Steps

- [Learn about artifact types](/guides/artifact-types/) to understand when to use ADRs, RFCs, Rules, and Guides
- [Explore the format specification](/reference/format-specification/) for detailed syntax and conventions
- [Configure MCP integration](/guides/mcp-integration/) for advanced usage patterns
- [See examples](/guides/examples/) of real-world documentation

## Common Issues

### Qdrant Connection Failed

If you see connection errors, ensure Qdrant is running:

```bash
docker ps | grep qdrant
```

Restart if needed:

```bash
docker run -p 6333:6333 qdrant/qdrant
```

### OpenAI API Rate Limits

If indexing fails with rate limit errors, the CLI will automatically retry. For large documentation sets, consider:
- Using a higher tier OpenAI account
- Breaking indexing into smaller batches
- Adding delays between batches

### Port Already in Use

If port 3000 is already in use, specify a different port:

```bash
context1000 mcp --transport http --port 3001
```

Update your Claude Code configuration accordingly.
