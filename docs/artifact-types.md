# Artifact Types

[← Back to Home](../index.md)

context1000 uses four distinct artifact types, each serving a specific purpose in capturing architectural knowledge.

## Decisions

Capture the "why" behind architectural choices using well-established formats.

### RFC (Request for Comments)

RFCs are proposals that outline solution options and constraints before implementation.

**Structure:**
- **Summary**: Who needs it and what changes
- **Context and problem**: Current behavior and limitations
- **Proposed solution**: Architectural idea, API/contracts, data/schema
- **Alternatives**: Why other options were rejected
- **Impact**: Performance, compatibility, security considerations
- **Implementation plan**: Milestones with estimates and rollback plan
- **Success metrics**: How to measure success
- **Risks and open questions**: Known issues and uncertainties

**When to use:**
- Before starting major architectural changes
- When multiple solution approaches need evaluation
- To gather feedback on proposed changes

### ADR (Architectural Decision Record)

ADRs document the implementation details of chosen directions.

**Structure:**
- **Context**: The issue motivating this decision
- **Decision**: The change being proposed or implemented
- **Consequences**: What becomes easier or harder

**When to use:**
- After deciding on an approach from an RFC
- To document important architectural choices
- When implementation details need to be preserved

## Rules

Imperatives derived from decisions that state what must or must not be done.

**Characteristics:**
- Written as clear, actionable directives
- Organized in numbered lists
- Reference related RFCs/ADRs via front matter
- Can be organized in subdirectories

**Example:**
```markdown
---
name: api-design-rules
title: API Design Rules
related:
  adrs: [rest-api-design]
---

1. All API endpoints MUST use versioned URLs (e.g., `/v1/users`)
2. API responses MUST include proper HTTP status codes
3. Authentication tokens MUST NOT be included in URL parameters
```

## Guides

Practical implementation and usage instructions.

**Coverage:**
- Installation and setup instructions
- Usage examples and best practices
- Architecture overviews and conventions
- Step-by-step tutorials
- Can be organized in subdirectories by topic

**When to use:**
- To help developers implement decisions
- To document usage patterns
- To provide onboarding materials

## Projects

Self-contained documentation following the same structure as the root level.

**Components:**
- `project.md`: Project overview with name, title, tags, repository link
- `decisions/`: Project-specific ADRs and RFCs
- `rules/`: Project-specific rules
- `guides/`: Project-specific guides
- `projects/`: Optional nested sub-projects

**Key Points:**
- Root-level `projects/` contains only project directories
- Projects can contain nested sub-projects
- Each project must have a `project.md` file
- Each major directory includes an `index.md` file

## See Also

- [Cross-References and Dependencies](cross-references.md)
- [Getting Started](getting-started.md)

[← Back to Home](../index.md)
