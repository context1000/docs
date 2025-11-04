---
title: Overview
description: Understanding the context1000 documentation framework
---

context1000 is a documentation framework designed specifically to optimize AI tool integration. It addresses a fundamental challenge in AI-assisted development: **the completeness and accuracy of the provided context are crucial** for AI agents to produce high-quality outputs.

## Core Philosophy

The approach centers on "Documentation FOR AI only" — writing and structuring documentation exclusively for AI agents rather than human audiences. This inverts traditional documentation priorities, treating **technical documentation as a prompt**.

## Four Artifact Types

context1000 uses four distinct artifact types that form a logical flow:

```
RFCs (Proposals)
    ↓
ADRs (Decisions)
    ↓
Rules (Imperatives)
    ↓
Guides (Implementation)
```

### 1. Decisions (RFCs & ADRs)

Capture the **"why"** behind architectural choices:
- **RFCs**: Proposals before decisions are made
- **ADRs**: Decisions after evaluation

### 2. Rules

**Imperatives** derived from decisions:
- Specify what **must** and **must not** be done
- Enforce decisions made in ADRs/RFCs
- Written as numbered lists with clear language (MUST, SHOULD, MAY)

### 3. Guides

**Implementation details** and usage instructions:
- Step-by-step tutorials
- Code examples
- Best practices
- Troubleshooting

### 4. Projects

**Project-specific** documentation:
- Organize documentation by project or module
- Support nested hierarchies
- Enable targeted queries

## Directory Structure

```
.context1000/
├── decisions/      # RFCs and ADRs
│   ├── adr/
│   └── rfc/
├── rules/          # Derived imperatives
├── guides/         # Implementation details
└── projects/       # Project-specific docs
```

Each artifact type follows strict naming conventions:
- `.adr.md` for ADRs
- `.rfc.md` for RFCs
- `.rules.md` for Rules
- `.guide.md` for Guides

## Key Features

### Structured Relationships

Explicit cross-referencing between artifacts with dependencies and supersession tracking:

```yaml
---
related:
  depends-on:
    adrs: [use-graphql]
  rules: [graphql-rules]
  guides: [graphql-setup]
---
```

### RAG-Powered

Built-in retrieval-augmented generation system:
- Vector search with Qdrant
- Semantic documentation queries
- Chunking optimized for embeddings (1200 tokens per chunk with 200-token overlap)

### Model Context Protocol Integration

Four specialized tools for AI agents:
- `check_project_rules` - Retrieve project constraints
- `search_guides` - Find implementation patterns
- `search_decisions` - Access architectural context
- `search_documentation` - General search fallback

### Built-in Feedback Loop

Poor documentation produces mediocre AI outputs, creating immediate incentive to improve documentation quality. Verified calibrations benefit entire teams.

## How It Works

### 1. Write Documentation

Create artifacts using the four types:

```bash
# Create ADR
.context1000/decisions/adr/use-graphql.adr.md

# Create Rules
.context1000/rules/graphql-rules.rules.md

# Create Guide
.context1000/guides/graphql-setup.guide.md
```

### 2. Index Documentation

Process and index your documentation:

```bash
context1000 index .context1000
```

This:
- Chunks documents (1200 tokens with 200-token overlap)
- Generates embeddings using `text-embedding-3-small`
- Stores in Qdrant vector database

### 3. Expose via MCP

Start the MCP server:

```bash
context1000 mcp --transport http --port 3000
```

### 4. Connect AI Tools

Add to Claude Code (or other MCP-compatible tools):

```bash
claude mcp add --transport http context1000 http://localhost:3000/mcp
```

### 5. Query Context

AI agents can now query your documentation:

```
User: "What are the GraphQL rules?"

Claude: [Uses check_project_rules tool]
        → Returns graphql-rules.rules.md content
```

## Benefits

### For AI Agents

- **Precise context retrieval** - Semantic search finds relevant information
- **Structured relationships** - Follow dependencies and cross-references
- **Clear requirements** - Rules provide explicit constraints
- **Implementation guidance** - Guides show how to apply rules

### For Teams

- **Consistent outputs** - All team members (via AI) follow same rules
- **Traceable decisions** - Understand why choices were made
- **Knowledge sharing** - Documentation is automatically queryable
- **Onboarding** - New team members get context via AI

### For Projects

- **Living documentation** - Stays relevant through AI usage
- **Technical debt tracking** - Link rules to decisions
- **Architecture visibility** - Decisions are explicit and searchable
- **Quality improvement** - Bad docs = bad AI outputs = incentive to improve

## Use Cases

- **Software Architecture Documentation** - Capture decisions and implementation guidelines
- **Team Knowledge Management** - Share verified patterns and constraints
- **AI-Assisted Development** - Provide context for code generation and review
- **Project Onboarding** - Structured knowledge base accessible via AI
- **Technical Debt Tracking** - Link rules to decisions and track supersession

## Next Steps

Explore each artifact type in detail:

- [Decisions (RFCs & ADRs)](/core-concepts/decisions/) - Capture architectural choices
- [Rules](/core-concepts/rules/) - Enforce decisions
- [Guides](/core-concepts/guides/) - Implement requirements
- [Projects](/core-concepts/projects/) - Organize by module

Or get started:

- [Local RAG Setup](/getting-started/local-rag/) - Install and configure
- [Claude Code Plugin](/getting-started/claude-code-plugin/) - Integrate with Claude Code
