---
title: Rules
description: Understanding rules in context1000
---

Rules are **imperatives** derived from decisions. They specify what **must** and **must not** be done in clear, actionable language.

## Purpose

Rules bridge the gap between decisions (why) and implementation (how):

```
ADR: "Use GraphQL for API Layer"
  → Why GraphQL was chosen

Rules: "GraphQL Development Rules"
  → What must be done when using GraphQL

Guides: "GraphQL Setup Guide"
  → How to follow the rules
```

## When to Use Rules

- Enforcing decisions made in ADRs/RFCs
- Defining coding standards
- Specifying security requirements
- Setting performance constraints
- Establishing team conventions
- Defining quality gates

## Rule Characteristics

### 1. Written as Numbered Lists

Each rule is a discrete, numbered item:

```markdown
## Security

1. ALL mutations MUST require authentication
2. Query depth MUST be limited to 7 levels maximum
3. Sensitive fields MUST use field-level authorization
4. Rate limiting MUST be applied per client ID
```

### 2. Use Imperative Language

Rules use RFC 2119 keywords for clarity:

| Term | Meaning | Usage |
|------|---------|-------|
| MUST / MUST NOT | Required | Non-negotiable requirements |
| SHOULD / SHOULD NOT | Recommended | Strong guidance, exceptions allowed |
| MAY | Optional | Suggested but not required |
| NEVER / ALWAYS | Absolute | No exceptions |

### 3. Actionable and Verifiable

Each rule can be:
- Understood clearly
- Implemented concretely
- Verified through testing or review

**Good rule**:
```
1. All API endpoints MUST respond within 200ms (p95)
```

**Bad rule** (too vague):
```
1. APIs should be fast
```

### 4. Reference Related Decisions

Link rules to the ADRs/RFCs that motivated them:

```yaml
---
name: graphql-rules
title: GraphQL Development Rules
related:
  depends-on:
    adrs: [use-graphql]
  guides: [graphql-setup]
---
```

## Rule Structure

### File Naming

Rules files must use the `.rules.md` extension:

```
.context1000/rules/graphql-rules.rules.md
.context1000/rules/security-rules.rules.md
.context1000/rules/typescript-rules.rules.md
```

### Front Matter

```yaml
---
name: graphql-rules          # Unique identifier
title: GraphQL Development Rules
tags: [graphql, api, standards]
related:
  depends-on:
    adrs: [use-graphql]      # ADR that created these rules
  guides: [graphql-setup]    # Guides showing how to follow rules
---
```

### Content Organization

Organize rules by category with clear headings:

```markdown
# GraphQL Development Rules

## Schema Design

1. All types MUST use PascalCase names
2. All fields MUST use camelCase names
3. Use nullability thoughtfully - only nullable when truly optional

## Resolvers

1. ALL resolvers MUST implement authorization checks
2. Use DataLoader for all database access to prevent N+1 queries
3. Resolver functions SHOULD be pure (no side effects in query)

## Security

1. Query depth MUST be limited to 7 levels maximum
2. Query complexity MUST be calculated and limited
3. ALL mutations MUST require authentication
```

## Example: Complete Rules File

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

These rules enforce the decisions made in [use-graphql ADR](/decisions/adr/use-graphql).

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

## Rule Categories

### Common Rule Types

**Coding Standards**
```markdown
1. All new files MUST use `.ts` or `.tsx` extensions
2. Use `strict` mode in `tsconfig.json`
3. Avoid using `any` type - use `unknown` if type is truly unknown
```

**Security Requirements**
```markdown
1. ALL user inputs MUST be validated
2. Passwords MUST be hashed using bcrypt with cost factor >= 12
3. API keys MUST NOT be committed to version control
```

**Performance Constraints**
```markdown
1. API endpoints MUST respond within 200ms (p95)
2. Database queries MUST use indexes for filtering
3. Images MUST be optimized before upload
```

**Process Rules**
```markdown
1. All PRs MUST pass CI before merging
2. Code reviews MUST be completed within 24 hours
3. Breaking changes MUST include migration guide
```

## Using Rules with AI Agents

### MCP Tool: check_project_rules

AI agents query rules using the `check_project_rules` tool:

```typescript
// AI agent automatically calls:
check_project_rules({
  project: "backend"
})

// Returns all rules relevant to backend project
```

### Rule Discovery Flow

```
1. AI starts task
   ↓
2. Calls check_project_rules()
   ↓
3. Retrieves relevant rules
   ↓
4. Follows rules during implementation
   ↓
5. Calls search_guides() to see how to implement
```

### Example Interaction

**User**: "Create a new GraphQL mutation for user signup"

**AI Agent**:
1. Calls `check_project_rules({ project: "api" })`
   → Gets: graphql-rules.rules.md
   → Learns: Must require auth, return modified object, use error extensions
2. Calls `search_guides({ query: "graphql mutations", related_rules: ["graphql-rules"] })`
   → Gets implementation examples
3. Implements mutation following all rules
4. Includes auth check, proper error handling, returns user object

## Best Practices

### Writing Rules

**Do**:
- Make rules atomic (one concept per rule)
- Use consistent language (MUST, SHOULD, MAY)
- Include context when needed ("for lists over 50 items")
- Make rules verifiable ("respond within 200ms")
- Group related rules under clear headings

**Don't**:
- Write vague rules ("code should be good")
- Combine multiple requirements ("MUST use TypeScript and write tests")
- Forget to link to related ADRs
- Use ambiguous language ("should probably", "might want to")

### Organizing Rules

**Single File Approach** (for small projects):
```
.context1000/rules/
  └── project-rules.rules.md  # All rules in one file
```

**Multiple Files** (for larger projects):
```
.context1000/rules/
  ├── typescript-rules.rules.md
  ├── graphql-rules.rules.md
  ├── security-rules.rules.md
  └── testing-rules.rules.md
```

**Subdirectories** (for complex projects):
```
.context1000/rules/
  ├── backend/
  │   ├── api-rules.rules.md
  │   └── database-rules.rules.md
  └── frontend/
      ├── react-rules.rules.md
      └── styling-rules.rules.md
```

### Maintaining Rules

1. **Update when ADRs change**: If a decision evolves, update related rules
2. **Remove obsolete rules**: Delete rules that no longer apply
3. **Keep rules specific**: Avoid generic advice, be concrete
4. **Link to guides**: Show how to follow each rule
5. **Re-index after changes**: Run `context1000 index .context1000`

## Relationship with Other Artifacts

### From ADRs to Rules

```
ADR: "Use TypeScript for Type Safety"
  ↓
Rules: "TypeScript Development Rules"
  → All new files MUST use .ts/.tsx
  → Use strict mode
  → Avoid any type
```

### From Rules to Guides

```
Rule: "Use DataLoader for all database access"
  ↓
Guide: "GraphQL DataLoader Setup"
  → How to install DataLoader
  → How to create loaders
  → Example implementations
```

### Cross-Referencing

```yaml
---
# In Rules file
related:
  depends-on:
    adrs: [use-graphql]      # Where rules came from
  guides: [graphql-setup]    # How to follow rules
---
```

## Enforcement

### Manual Enforcement

- Code review checklist
- Pull request templates
- Team documentation review

### Automated Enforcement

- Linters (ESLint, TSLint)
- Type checkers (TypeScript)
- CI/CD checks
- Pre-commit hooks

### AI-Assisted Enforcement

AI agents with access to rules via MCP will:
- Follow rules automatically during code generation
- Suggest corrections when rules are violated
- Reference specific rules when making recommendations

## Summary

- **Rules specify requirements** derived from decisions
- Use **imperative language** (MUST, SHOULD, MAY)
- **Numbered lists** organized by category
- **Actionable and verifiable** items
- Link to **ADRs** (why) and **Guides** (how)
- Queried by AI agents via `check_project_rules`

## Next Steps

- [Learn about Guides](/core-concepts/guides/) - Implement rules
- [Learn about Decisions](/core-concepts/decisions/) - Understand rule origins
- [See examples](/guides/examples/) - Real-world rule documents
