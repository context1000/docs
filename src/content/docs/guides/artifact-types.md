---
title: Artifact Types
description: Understanding the four artifact types in context1000
---

context1000 uses four distinct artifact types, each serving a specific purpose in the documentation hierarchy. Understanding when and how to use each type is crucial for building effective AI-optimized documentation.

## Overview

The four artifact types form a logical flow:

```
RFCs (Proposals)
    ↓
ADRs (Decisions)
    ↓
Rules (Imperatives)
    ↓
Guides (Implementation)
```

Each type builds upon the previous, creating a traceable chain from proposal to implementation.

## Decisions: RFCs and ADRs

Decisions capture the **"why"** behind architectural choices using well-established formats.

### RFCs (Request for Comments)

RFCs are **proposals** that outline solution options, constraints, and trade-offs **before** a decision is made.

#### When to Use RFCs

- Proposing significant architectural changes
- Evaluating multiple solution approaches
- Seeking team feedback on technical direction
- Documenting constraints and requirements
- Planning major features or refactors

#### RFC Structure

```markdown
---
name: api-versioning-strategy
title: API Versioning Strategy
status: review
tags: [api, architecture]
---

# API Versioning Strategy

## Summary
Who needs this change and what it will accomplish.

## Context and Problem
Current behavior, limitations, and why change is needed.

## Proposed Solution
Detailed architectural approach, API contracts, data schemas.

## Alternatives
Other options considered and why they were rejected.

## Impact
Performance implications, compatibility concerns, security considerations.

## Implementation Plan
Milestones with time estimates and rollback strategy.

## Success Metrics
How to measure if the solution is working.

## Risks and Open Questions
Known issues and areas needing further investigation.
```

#### RFC Lifecycle

1. **Draft**: Initial proposal, gathering feedback
2. **Review**: Under team review
3. **Accepted**: Approved for implementation
4. **Rejected**: Not moving forward
5. **Implemented**: Solution has been built (often creates ADRs)

#### Example: Database Migration RFC

```markdown
---
name: postgres-to-mongodb
title: Migrate from PostgreSQL to MongoDB
status: review
tags: [database, migration]
related:
  adrs: [database-choice]  # Supersedes this older decision
---

# Migrate from PostgreSQL to MongoDB

## Summary
The data team needs more flexible schema design for our analytics workloads.

## Context and Problem
Our current PostgreSQL schema requires frequent migrations as analytics requirements evolve.
40% of our queries involve JSONB fields, indicating we're working around relational constraints.

## Proposed Solution
Migrate analytics workload to MongoDB, keeping PostgreSQL for transactional data.

### Architecture
- MongoDB cluster for analytics (read-heavy)
- PostgreSQL for transactions (ACID required)
- Change data capture for real-time sync

## Alternatives

### Keep PostgreSQL Only
- Pros: No migration cost, familiar tooling
- Cons: Schema migrations remain painful, JSONB queries slower

### Move Entirely to MongoDB
- Pros: Single database, consistent tooling
- Cons: Lose ACID guarantees for transactions

## Impact

### Performance
- Expected 3x faster analytics queries
- Slightly higher write latency due to CDC

### Security
- Need to audit MongoDB security settings
- Implement field-level encryption

## Implementation Plan

1. **Phase 1 (2 weeks)**: Set up MongoDB cluster, CDC pipeline
2. **Phase 2 (3 weeks)**: Migrate historical data
3. **Phase 3 (1 week)**: Cutover analytics queries
4. **Rollback**: Keep PostgreSQL analytics tables for 1 month

## Success Metrics
- Analytics query p95 latency < 200ms (currently 600ms)
- Zero data loss during migration
- No increase in production incidents

## Risks
- Learning curve for MongoDB
- Potential data consistency issues during sync
- Increased infrastructure costs
```

### ADRs (Architectural Decision Records)

ADRs document **implementation details** of chosen directions. They're more concrete than RFCs.

#### When to Use ADRs

- Recording significant architectural decisions
- Documenting technology choices
- Explaining design patterns adopted
- Capturing constraints that inform implementation
- After an RFC is accepted (implement the decision)

#### ADR Structure

```markdown
---
name: use-graphql
title: Use GraphQL for API Layer
status: accepted
tags: [api, graphql]
related:
  rfcs: [api-versioning-strategy]
  rules: [api-rules]
  guides: [graphql-setup]
---

# Use GraphQL for API Layer

## Context
The issue motivating this decision or situation.

## Decision
The change we're making, in full detail.

## Consequences

### What becomes easier
- Positive outcomes
- New capabilities

### What becomes harder
- Trade-offs accepted
- New complexities introduced
```

#### ADR Lifecycle

1. **Draft**: Being written
2. **Accepted**: Approved and in effect
3. **Deprecated**: No longer recommended
4. **Superseded**: Replaced by a newer ADR
5. **Rejected**: Decided against

#### Example: GraphQL ADR

```markdown
---
name: use-graphql
title: Use GraphQL for API Layer
status: accepted
tags: [api, graphql, architecture]
related:
  rfcs: [api-versioning-strategy]
  rules: [graphql-rules]
  guides: [graphql-setup, schema-design]
  depends-on:
    rfcs: [api-versioning-strategy]
---

# Use GraphQL for API Layer

## Context

Our REST API has grown to 127 endpoints with significant overfetching and underfetching issues.
Mobile clients make an average of 12 API calls to render a single screen. The API versioning
strategy RFC proposed GraphQL as a solution.

## Decision

We will adopt GraphQL for all new API development:

- **Server**: Apollo Server with TypeScript
- **Schema**: Code-first approach using TypeGraphQL
- **Clients**: Apollo Client for web, Android, iOS
- **Existing REST**: Maintain for 12 months with deprecation warnings
- **Migration**: Gradual, starting with mobile-first endpoints

### Schema Design Principles

1. Design schema around UI needs, not database structure
2. Use interfaces for polymorphic types
3. Implement DataLoader for N+1 query prevention
4. Version schema using `@deprecated` directive

### Security

- Per-field authorization using directives
- Query depth limiting (max depth: 7)
- Query complexity analysis
- Rate limiting per client

## Consequences

### What becomes easier

- **Flexible queries**: Clients fetch exactly what they need
- **Faster mobile apps**: Single request for complex screens
- **Better DX**: Strong typing and autocomplete
- **API evolution**: Add fields without versioning
- **Documentation**: Self-documenting through introspection

### What becomes harder

- **Learning curve**: Team needs GraphQL training
- **Caching**: More complex than REST caching
- **Monitoring**: New tools required for query analysis
- **File uploads**: Requires multipart spec implementation
- **Overhead**: Query parsing adds ~5ms latency
```

## Rules

Rules are **imperatives** derived from decisions. They specify what **must** and **must not** be done.

### When to Use Rules

- Enforcing decisions made in ADRs/RFCs
- Defining coding standards
- Specifying security requirements
- Setting performance constraints
- Establishing team conventions

### Rules Characteristics

- Written as **numbered lists**
- Use **imperative language** (MUST, SHOULD, MAY)
- **Actionable** and **verifiable**
- Reference related ADRs/RFCs for context

### Example: GraphQL Rules

```markdown
---
name: graphql-rules
title: GraphQL Development Rules
tags: [graphql, api, standards]
related:
  depends-on:
    adrs: [use-graphql]
  guides: [graphql-setup, schema-design]
---

# GraphQL Development Rules

## Schema Design

1. All types MUST use PascalCase names
2. All fields MUST use camelCase names
3. Use nullability thoughtfully - only nullable when truly optional
4. NEVER expose internal IDs directly - use opaque global IDs
5. List fields MUST return empty arrays, not null
6. Use relay cursor pagination for lists over 50 items

## Resolvers

1. ALL resolvers MUST implement authorization checks
2. Use DataLoader for all database access to prevent N+1 queries
3. Resolver functions SHOULD be pure (no side effects in query)
4. Mutations MUST return the modified object
5. NEVER throw raw errors - use GraphQL error extensions

## Security

1. Query depth MUST be limited to 7 levels maximum
2. Query complexity MUST be calculated and limited
3. ALL mutations MUST require authentication
4. Sensitive fields MUST use field-level authorization
5. Rate limiting MUST be applied per client ID

## Performance

1. Queries SHOULD complete in < 200ms (p95)
2. DataLoader batch size MUST NOT exceed 100
3. Enable query persisted for production
4. Cache expensive computed fields for 5 minutes
5. Log queries taking > 1 second

## Documentation

1. All fields MUST have descriptions
2. Use @deprecated with reason and alternative
3. Include examples in field descriptions
4. Document authorization requirements in descriptions

## Testing

1. All resolvers MUST have unit tests
2. Integration tests MUST cover authorization
3. Test N+1 query scenarios explicitly
4. Load test queries with 100+ concurrent requests
```

### Rule Language Conventions

| Term | Meaning | Usage |
|------|---------|-------|
| MUST / MUST NOT | Required | Non-negotiable requirements |
| SHOULD / SHOULD NOT | Recommended | Strong guidance, exceptions allowed |
| MAY | Optional | Suggested but not required |
| NEVER / ALWAYS | Absolute | No exceptions |

## Guides

Guides provide **implementation details** and **usage instructions**. They explain **how** to follow rules and implement decisions.

### When to Use Guides

- Setup and installation instructions
- Step-by-step tutorials
- Architecture overviews
- Best practices and patterns
- Code examples
- Troubleshooting
- Tool usage

### Guide Characteristics

- **Practical** and **actionable**
- Include **code examples**
- Reference rules and decisions
- Explain **why** as well as how
- Include **troubleshooting** tips

### Example: GraphQL Setup Guide

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

## Installation

Install required packages:

```bash
npm install apollo-server-express graphql
npm install --save-dev @types/graphql
```

## Server Setup

Create `src/graphql/server.ts`:

```typescript
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
```

## Schema Definition

Following [Rule #1-6](/rules/graphql-rules#schema-design):

```typescript
// src/graphql/schema.ts
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

    """
    User's posts (uses cursor pagination per Rule #6)
    """
    posts(first: Int, after: String): PostConnection!
  }

  """
  Paginated list of posts
  """
  type PostConnection {
    edges: [PostEdge!]!  # Empty array, not null (Rule #5)
    pageInfo: PageInfo!
  }
\`;
```

## Resolver Implementation

Following [Rule #1-5](/rules/graphql-rules#resolvers):

```typescript
// src/graphql/resolvers/user.ts
import DataLoader from 'dataloader';

export const userResolvers = {
  Query: {
    user: async (_, { id }, { user, loaders }) => {
      // Authorization check (Rule #1)
      if (!user) {
        throw new AuthenticationError('Must be logged in');
      }

      // Use DataLoader (Rule #2)
      return loaders.user.load(id);
    },
  },

  User: {
    email: async (user, _, { user: currentUser }) => {
      // Field-level authorization (Rule #1)
      if (currentUser.id !== user.id && !currentUser.isAdmin) {
        throw new ForbiddenError('Cannot access email');
      }
      return user.email;
    },

    posts: async (user, { first = 10, after }, { loaders }) => {
      // Use DataLoader for N+1 prevention (Rule #2)
      return loaders.userPosts.load({ userId: user.id, first, after });
    },
  },
};
```

## DataLoader Setup

Per [Rule #2](/rules/graphql-rules#resolvers):

```typescript
// src/graphql/dataloaders.ts
import DataLoader from 'dataloader';
import { db } from '../db';

export function createLoaders() {
  return {
    user: new DataLoader(async (ids) => {
      const users = await db.user.findMany({
        where: { id: { in: ids } },
      });
      // Return in same order as input IDs
      return ids.map(id => users.find(u => u.id === id));
    }),

    userPosts: new DataLoader(async (keys) => {
      // Batch load posts for multiple users
      const userIds = keys.map(k => k.userId);
      const posts = await db.post.findMany({
        where: { userId: { in: userIds } },
      });
      return keys.map(k =>
        posts.filter(p => p.userId === k.userId)
      );
    }),
  };
}
```

## Testing

Following [Rule #1-4](/rules/graphql-rules#testing):

```typescript
// src/graphql/resolvers/__tests__/user.test.ts
describe('User resolvers', () => {
  it('requires authentication', async () => {
    const result = await executeQuery({
      query: '{ user(id: "123") { id } }',
      contextValue: { user: null }, // No user
    });

    expect(result.errors[0].message).toBe('Must be logged in');
  });

  it('prevents N+1 queries', async () => {
    const spy = jest.spyOn(db.user, 'findMany');

    await executeQuery({
      query: `{
        users { id posts { id author { name } } }
      }`,
    });

    // Should batch load users in single query
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
```

## Deployment

Enable persisted queries for production (Rule #3):

```typescript
const server = new ApolloServer({
  // ...
  persistedQueries: {
    cache: new Redis({ /* config */ }),
  },
});
```

## Troubleshooting

### N+1 Query Issues

If you see multiple database queries for the same resource:

1. Check that DataLoader is used in resolver
2. Verify DataLoader is created per-request
3. Check batch size doesn't exceed 100 (Rule #2)

### Authorization Errors

If getting unexpected 401/403:

1. Verify auth middleware is running before GraphQL
2. Check field-level auth directives are implemented
3. Test with valid token in Authorization header
```

## Relationship Between Types

### Flow Example

Here's how the artifact types work together:

```
1. RFC: "api-versioning-strategy"
   → Proposes GraphQL for flexible APIs

2. ADR: "use-graphql"
   → Decides to adopt GraphQL
   → depends-on: [api-versioning-strategy]

3. Rules: "graphql-rules"
   → Must use DataLoader
   → Must limit query depth
   → depends-on: [use-graphql]

4. Guides: "graphql-setup"
   → How to install Apollo Server
   → How to implement DataLoader
   → How to enforce depth limits
   → depends-on: [use-graphql, graphql-rules]
```

### Cross-Referencing

Always link related artifacts in front matter:

```yaml
---
# In ADR
related:
  rfcs: [api-versioning-strategy]    # RFC that proposed this
  rules: [graphql-rules]              # Rules implementing this
  guides: [graphql-setup]             # How to implement
  depends-on:
    rfcs: [api-versioning-strategy]
---
```

## Choosing the Right Type

| Question | Type |
|----------|------|
| Are we evaluating options? | RFC |
| Have we made a decision? | ADR |
| What are the requirements? | Rules |
| How do I implement this? | Guide |
| Is this project-specific? | Consider placing in `projects/` |

## Best Practices

### RFCs

- Write proposals early in the decision process
- Include multiple alternatives
- Quantify impact with metrics
- Update status as proposal progresses

### ADRs

- Record decisions close to when they're made
- Explain both "what" and "why"
- Update when decision is superseded
- Link to implementing rules and guides

### Rules

- Keep rules atomic (one rule per item)
- Use consistent language (MUST, SHOULD, MAY)
- Make rules verifiable
- Update as ADRs evolve

### Guides

- Include runnable code examples
- Cover edge cases and troubleshooting
- Update as implementation patterns evolve
- Link to rules being followed

## Summary

- **RFCs**: Proposals before decisions
- **ADRs**: Decisions after evaluation
- **Rules**: Requirements derived from decisions
- **Guides**: Implementation of requirements

Each type serves a distinct purpose in creating comprehensive, AI-optimized documentation that traces from proposal through implementation.
