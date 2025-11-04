---
title: Guides
description: Understanding guides in context1000
---

Guides provide **implementation details** and **usage instructions**. They explain **how** to follow rules and implement decisions with practical, actionable content.

## Purpose

Guides bridge rules and actual implementation:

```
ADR: "Use GraphQL for API Layer"
  → Why GraphQL was chosen

Rules: "GraphQL Development Rules"
  → What must be done (use DataLoader, limit depth)

Guides: "GraphQL Setup Guide"
  → How to set up Apollo Server
  → How to implement DataLoader
  → Code examples and troubleshooting
```

## When to Use Guides

- Setup and installation instructions
- Step-by-step tutorials
- Architecture overviews
- Best practices and patterns
- Code examples
- Troubleshooting
- Tool usage
- Migration guides

## Guide Characteristics

### 1. Practical and Actionable

Guides focus on **doing**, not theory:

```markdown
## Installation

Install required packages:

\`\`\`bash
npm install apollo-server-express graphql
npm install --save-dev @types/graphql
\`\`\`
```

### 2. Include Code Examples

Show, don't just tell:

```markdown
## DataLoader Setup

Create loaders for your data sources:

\`\`\`typescript
import DataLoader from 'dataloader';

export function createLoaders() {
  return {
    user: new DataLoader(async (ids) => {
      const users = await db.user.findMany({
        where: { id: { in: ids } },
      });
      return ids.map(id => users.find(u => u.id === id));
    }),
  };
}
\`\`\`
```

### 3. Reference Rules and Decisions

Link to related artifacts to provide context:

```markdown
Following [Rule #2](/rules/graphql-rules#resolvers):

\`\`\`typescript
// Use DataLoader (Rule #2)
return loaders.user.load(id);
\`\`\`
```

### 4. Explain "Why" as Well as "How"

Help readers understand the reasoning:

```markdown
## Why DataLoader?

DataLoader prevents N+1 queries by batching database requests.
Without it, fetching 100 users' posts would make 101 queries
(1 for users, 100 for each user's posts).
```

### 5. Include Troubleshooting

Address common issues:

```markdown
## Troubleshooting

### N+1 Query Issues

If you see multiple database queries for the same resource:

1. Check that DataLoader is used in resolver
2. Verify DataLoader is created per-request
3. Check batch size doesn't exceed 100 (Rule #2)
```

## Guide Structure

### File Naming

Guide files must use the `.guide.md` extension:

```
.context1000/guides/graphql-setup.guide.md
.context1000/guides/typescript-setup.guide.md
.context1000/guides/deployment-process.guide.md
```

### Front Matter

```yaml
---
name: graphql-setup          # Unique identifier
title: GraphQL Setup Guide
tags: [graphql, setup, tutorial]
related:
  adrs: [use-graphql]        # Related decision
  rules: [graphql-rules]     # Rules this guide helps follow
  guides: [schema-design]    # Related guides
---
```

### Content Organization

Organize with clear headings and progressive complexity:

```markdown
# GraphQL Setup Guide

Introduction paragraph explaining scope and prerequisites.

## Prerequisites
- List required knowledge
- Required tools/software

## Installation
Step-by-step installation instructions

## Configuration
How to configure

## Usage
How to use

## Advanced Topics
(Optional) Complex scenarios

## Troubleshooting
Common issues and solutions

## Next Steps
Links to related guides
```

## Example: Complete Guide File

```markdown
---
name: graphql-setup
title: GraphQL Setup Guide
tags: [graphql, setup, tutorial]
related:
  adrs: [use-graphql]
  rules: [graphql-rules]
  guides: [schema-design]
---

# GraphQL Setup Guide

This guide walks through setting up GraphQL in accordance with our
[GraphQL ADR](/decisions/adr/use-graphql) and [GraphQL Rules](/rules/graphql-rules).

## Prerequisites

- Node.js 18+ installed
- TypeScript configured
- Database connection established

## Installation

Install required packages:

\`\`\`bash
npm install apollo-server-express graphql
npm install --save-dev @types/graphql
\`\`\`

## Server Setup

Create \`src/graphql/server.ts\`:

\`\`\`typescript
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    user: req.user, // From auth middleware
  }),
  plugins: [
    // Query complexity plugin (Rule #2)
    queryComplexityPlugin({ maxComplexity: 1000 }),
    // Query depth plugin (Rule #1)
    queryDepthPlugin({ maxDepth: 7 }),
  ],
});
\`\`\`

## Schema Definition

Following [Rule #1-6](/rules/graphql-rules#schema-design):

\`\`\`typescript
import { gql } from 'apollo-server-express';

export const typeDefs = gql\`
  """
  User account information
  """
  type User {
    """
    Unique user identifier (opaque global ID per Rule #4)
    """
    id: ID!

    """
    User's email address. Requires email:read scope.
    """
    email: String!
  }
\`;
\`\`\`

## DataLoader Setup

Per [Rule #2](/rules/graphql-rules#resolvers):

\`\`\`typescript
import DataLoader from 'dataloader';
import { db } from '../db';

export function createLoaders() {
  return {
    user: new DataLoader(async (ids) => {
      const users = await db.user.findMany({
        where: { id: { in: ids } },
      });
      return ids.map(id => users.find(u => u.id === id));
    }),
  };
}
\`\`\`

## Troubleshooting

### N+1 Query Issues

If you see multiple database queries:

1. Check DataLoader is used in resolver
2. Verify DataLoader is created per-request
3. Check batch size ≤ 100 (Rule #2)

### Authorization Errors

If getting unexpected 401/403:

1. Verify auth middleware runs before GraphQL
2. Check field-level auth directives
3. Test with valid token in Authorization header

## Next Steps

- [Schema Design Guide](/guides/schema-design/) - Design patterns
- [Testing Guide](/guides/testing/) - Test GraphQL APIs
```

## Guide Types

### Setup Guides

Walk through installation and configuration:

```markdown
# TypeScript Setup Guide

## Installation

\`\`\`bash
npm install --save-dev typescript @types/node
\`\`\`

## Configuration

Create \`tsconfig.json\`:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true
  }
}
\`\`\`
```

### Tutorial Guides

Step-by-step task completion:

```markdown
# Building Your First API Endpoint

## Step 1: Define the Schema

\`\`\`typescript
type Query {
  hello: String!
}
\`\`\`

## Step 2: Implement the Resolver

\`\`\`typescript
const resolvers = {
  Query: {
    hello: () => "Hello, world!"
  }
};
\`\`\`
```

### Architecture Guides

Explain system structure:

```markdown
# System Architecture Overview

## Components

### API Layer (GraphQL)
Handles client requests, implements business logic.

### Database Layer (PostgreSQL)
Stores persistent data, enforces constraints.

### Cache Layer (Redis)
Speeds up frequent queries, stores sessions.

## Data Flow

1. Client sends GraphQL query
2. API validates and authorizes
3. Resolvers fetch from DB/cache
4. Response returned to client
```

### Pattern Guides

Demonstrate best practices:

```markdown
# Error Handling Patterns

## Approach 1: Error Extensions

\`\`\`typescript
throw new ApolloError('Not found', 'NOT_FOUND', {
  userId: id,
  timestamp: Date.now()
});
\`\`\`

## Approach 2: Union Types

\`\`\`graphql
type UserResult = User | NotFoundError

type NotFoundError {
  message: String!
  code: String!
}
\`\`\`

## Recommendation

Use approach 1 for system errors, approach 2 for expected errors.
```

### Troubleshooting Guides

Address common issues:

```markdown
# Common Database Issues

## Problem: Connection Timeout

**Symptoms**: Queries fail with "connection timeout"

**Causes**:
- Database server down
- Network issues
- Connection pool exhausted

**Solutions**:
1. Check database server status
2. Verify network connectivity
3. Increase connection pool size
```

## Using Guides with AI Agents

### MCP Tool: search_guides

AI agents query guides using the `search_guides` tool:

```typescript
// AI agent calls:
search_guides({
  query: "authentication implementation",
  project: "backend",
  related_rules: ["auth-rules", "security-rules"]
})

// Returns relevant guide chunks with code examples
```

### Guide Discovery Flow

```
1. AI checks rules (what to do)
   ↓
2. Calls search_guides() (how to do it)
   ↓
3. Gets code examples
   ↓
4. Implements following guides
   ↓
5. References specific guide sections in code comments
```

### Example Interaction

**User**: "How do I implement JWT authentication?"

**AI Agent**:
1. Calls `check_project_rules()`
   → Gets: auth-rules.rules.md
   → Learns: Must use JWT, Must hash passwords, Must validate tokens
2. Calls `search_guides({ query: "JWT authentication", related_rules: ["auth-rules"] })`
   → Gets: auth-setup.guide.md with code examples
3. Implements authentication following guide examples
4. References guide in PR description

## Best Practices

### Writing Guides

**Do**:
- Include runnable code examples
- Show complete, working code (not snippets)
- Reference rules being followed
- Explain why, not just how
- Include troubleshooting section
- Link to related guides
- Use realistic examples

**Don't**:
- Assume prior knowledge without stating it
- Skip error handling in examples
- Use "foo/bar" placeholder names
- Forget to update when rules change
- Write guides that contradict rules

### Code Examples

**Good example** (complete, realistic):

```typescript
// Following Rule #1: All resolvers must check authorization
export const userResolvers = {
  Query: {
    user: async (_, { id }, { user, loaders }) => {
      // Authorization check
      if (!user) {
        throw new AuthenticationError('Must be logged in');
      }

      // Use DataLoader (Rule #2)
      return loaders.user.load(id);
    },
  },
};
```

**Bad example** (incomplete, vague):

```typescript
// Get user
function getUser(id) {
  return database.find(id);
}
```

### Organizing Guides

**By Feature**:
```
.context1000/guides/
  ├── authentication.guide.md
  ├── authorization.guide.md
  └── data-validation.guide.md
```

**By Process**:
```
.context1000/guides/
  ├── setup/
  │   ├── development-environment.guide.md
  │   └── production-deployment.guide.md
  └── workflows/
      ├── feature-development.guide.md
      └── bug-fixing.guide.md
```

**By Component**:
```
.context1000/guides/
  ├── api/
  │   ├── graphql-setup.guide.md
  │   └── rest-endpoints.guide.md
  └── database/
      ├── migrations.guide.md
      └── seeding.guide.md
```

### Maintaining Guides

1. **Keep code examples working**: Test examples regularly
2. **Update when rules change**: Guides must match current rules
3. **Update when tools change**: Reflect latest API versions
4. **Remove outdated sections**: Delete obsolete information
5. **Re-index after changes**: Run `context1000 index .context1000`

## Relationship with Other Artifacts

### From ADRs to Guides

```
ADR: "Use TypeScript for Type Safety"
  ↓
Guide: "TypeScript Setup Guide"
  → How to install TypeScript
  → How to configure tsconfig
  → How to write types
```

### From Rules to Guides

```
Rules: "All resolvers MUST check authorization"
  ↓
Guide: "Authorization Guide"
  → How to implement auth checks
  → Example resolver with auth
  → Testing authorization
```

### Cross-Referencing

```yaml
---
# In Guide file
related:
  adrs: [use-graphql]        # Decision this implements
  rules: [graphql-rules]     # Rules this follows
  guides: [schema-design]    # Related guides
---
```

## Summary

- **Guides show how** to implement decisions and follow rules
- Include **practical code examples**
- **Step-by-step instructions** for tasks
- **Troubleshooting** common issues
- Reference **rules** and **ADRs** for context
- Queried by AI agents via `search_guides`

## Next Steps

- [Learn about Rules](/core-concepts/rules/) - What guides help implement
- [Learn about Decisions](/core-concepts/decisions/) - Why guides exist
- [See examples](/guides/examples/) - Real-world guide documents
