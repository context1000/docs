---
title: Decisions
description: Understanding RFCs and ADRs in context1000
---

Decisions capture the **"why"** behind architectural choices using well-established formats. context1000 supports two types of decision documents: RFCs (Request for Comments) and ADRs (Architectural Decision Records).

## RFCs (Request for Comments)

RFCs are **proposals** that outline solution options, constraints, and trade-offs **before** a decision is made.

### When to Use RFCs

- Proposing significant architectural changes
- Evaluating multiple solution approaches
- Seeking team feedback on technical direction
- Documenting constraints and requirements
- Planning major features or refactors

### RFC Structure

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

### RFC Lifecycle

1. **Draft**: Initial proposal, gathering feedback
2. **Review**: Under team review
3. **Accepted**: Approved for implementation
4. **Rejected**: Not moving forward
5. **Implemented**: Solution has been built (often creates ADRs)

### Example: Database Migration RFC

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

## ADRs (Architectural Decision Records)

ADRs document **implementation details** of chosen directions. They're more concrete than RFCs and capture decisions that have been made.

### When to Use ADRs

- Recording significant architectural decisions
- Documenting technology choices
- Explaining design patterns adopted
- Capturing constraints that inform implementation
- After an RFC is accepted (implement the decision)

### ADR Structure

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

### ADR Lifecycle

1. **Draft**: Being written
2. **Accepted**: Approved and in effect
3. **Deprecated**: No longer recommended
4. **Superseded**: Replaced by a newer ADR
5. **Rejected**: Decided against

### Example: GraphQL ADR

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

## Relationship Between RFCs and ADRs

### Flow Example

```
1. RFC: "api-versioning-strategy"
   → Proposes GraphQL for flexible APIs
   → Status: review → accepted

2. ADR: "use-graphql"
   → Decides to adopt GraphQL
   → depends-on: [api-versioning-strategy]
   → Creates rules and guides

3. Rules: "graphql-rules"
   → Must use DataLoader
   → Must limit query depth
   → depends-on: [use-graphql]

4. Guides: "graphql-setup"
   → How to install Apollo Server
   → How to implement DataLoader
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

## Choosing Between RFCs and ADRs

| Question | Use |
|----------|-----|
| Are we still evaluating options? | RFC |
| Have we made a decision? | ADR |
| Need team feedback first? | RFC |
| Recording a past decision? | ADR |
| Comparing multiple approaches? | RFC |
| Documenting current architecture? | ADR |

## Best Practices

### For RFCs

- Write proposals early in the decision process
- Include multiple alternatives with pros/cons
- Quantify impact with metrics
- Update status as proposal progresses
- Link to related ADRs when accepted

### For ADRs

- Record decisions close to when they're made
- Explain both "what" and "why"
- Document trade-offs honestly
- Update when decision is superseded
- Link to implementing rules and guides

### Status Management

Keep status fields updated:

```yaml
# RFC progresses through:
status: draft → review → accepted/rejected/implemented

# ADR progresses through:
status: draft → accepted → deprecated/superseded
```

### Metadata

Include comprehensive metadata:

```yaml
---
name: unique-identifier
title: Human-readable title
status: current-status
tags: [relevant, tags, here]
related:
  depends-on:
    rfcs: [referenced-rfc]
    adrs: [referenced-adr]
  supersedes:
    adrs: [old-decision]
  rules: [derived-rules]
  guides: [implementation-guides]
---
```

## Summary

- **RFCs**: Proposals before decisions, evaluate options
- **ADRs**: Decisions after evaluation, document choices
- Both capture **why** decisions were made
- Link to **rules** (what to do) and **guides** (how to do it)
- Update status as decisions evolve
- Use cross-references to maintain relationships

## Next Steps

- [Learn about Rules](/core-concepts/rules/) - Enforce decisions
- [Learn about Guides](/core-concepts/guides/) - Implement decisions
- [See format specification](/reference/format-specification/) - Detailed syntax
