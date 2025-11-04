---
title: Projects
description: Understanding projects in context1000
---

Projects provide **organizational structure** for documentation in multi-project or modular architectures. They enable you to scope rules, guides, and decisions to specific parts of your codebase.

## Purpose

Projects help organize documentation in complex systems:

```
Monorepo with multiple services:
  ├── frontend/ (React app)
  ├── backend/ (Node.js API)
  └── mobile/ (React Native app)

.context1000/projects/
  ├── frontend/
  │   ├── rules/
  │   ├── guides/
  │   └── decisions/
  ├── backend/
  │   ├── rules/
  │   ├── guides/
  │   └── decisions/
  └── mobile/
      ├── rules/
      ├── guides/
      └── decisions/
```

## When to Use Projects

- **Monorepos**: Multiple services in one repository
- **Microservices**: Each service has distinct documentation
- **Multi-platform**: Web, mobile, desktop versions
- **Modular architecture**: Clear boundaries between modules
- **Team organization**: Different teams own different parts

## Project Structure

### Directory Organization

Projects can be organized in two ways:

#### 1. Flat Project Structure

All artifacts at root, tagged by project:

```
.context1000/
├── decisions/adr/
│   ├── frontend-use-react.adr.md       # Tagged: [frontend]
│   ├── backend-use-graphql.adr.md      # Tagged: [backend]
│   └── shared-use-typescript.adr.md    # Tagged: [frontend, backend]
├── rules/
│   ├── frontend-react-rules.rules.md   # Tagged: [frontend]
│   └── backend-api-rules.rules.md      # Tagged: [backend]
└── guides/
    ├── frontend-setup.guide.md         # Tagged: [frontend]
    └── backend-setup.guide.md          # Tagged: [backend]
```

**Pros**:
- Simpler directory structure
- Easy to see all artifacts
- Shared artifacts are clear

**Cons**:
- Harder to filter by project
- Tags must be maintained carefully

#### 2. Projects Directory Structure

Dedicated projects directory with full artifact hierarchy:

```
.context1000/
├── projects/
│   ├── frontend/
│   │   ├── decisions/adr/
│   │   │   └── use-react.adr.md
│   │   ├── rules/
│   │   │   └── react-rules.rules.md
│   │   └── guides/
│   │       └── setup.guide.md
│   ├── backend/
│   │   ├── decisions/adr/
│   │   │   └── use-graphql.adr.md
│   │   ├── rules/
│   │   │   └── api-rules.rules.md
│   │   └── guides/
│   │       └── setup.guide.md
│   └── shared/
│       ├── decisions/adr/
│       │   └── use-typescript.adr.md
│       └── rules/
│           └── typescript-rules.rules.md
└── [optional root-level shared docs]
```

**Pros**:
- Clear project boundaries
- Easier to filter by project
- Natural organization

**Cons**:
- More complex directory structure
- Shared artifacts need "shared" project

### Project Metadata

Each project can have metadata in front matter:

```yaml
---
name: frontend
title: Frontend Application
tags: [react, typescript, web]
related:
  projects: [shared]  # Dependencies on other projects
---
```

Or create a project index file:

```markdown
# .context1000/projects/frontend/index.md

---
name: frontend
title: Frontend Application
description: React-based web application
tags: [react, typescript, web]
team: frontend-team
repository: https://github.com/org/repo/tree/main/frontend
related:
  projects: [shared]
---

# Frontend Project Documentation

## Overview

The frontend application is a React-based SPA built with TypeScript.

## Key Decisions

- [Use React](/projects/frontend/decisions/adr/use-react)
- [Use Redux for State](/projects/frontend/decisions/adr/use-redux)

## Rules

- [React Development Rules](/projects/frontend/rules/react-rules)
- [Styling Rules](/projects/frontend/rules/styling-rules)

## Guides

- [Setup Guide](/projects/frontend/guides/setup)
- [Component Patterns](/projects/frontend/guides/component-patterns)
```

## Using Projects with MCP

### Filtering by Project

All MCP tools support project filtering:

```typescript
// Check rules for specific project
check_project_rules({
  project: "frontend"
})

// Search guides in project
search_guides({
  query: "component setup",
  project: "frontend"
})

// Search decisions in project
search_decisions({
  query: "state management",
  project: "frontend"
})
```

### Project Query Flow

```
User: "How do I set up the frontend?"

AI Agent:
1. Calls check_project_rules({ project: "frontend" })
   → Gets frontend-specific rules

2. Calls search_guides({
     query: "setup",
     project: "frontend"
   })
   → Gets frontend setup guide

3. Returns project-specific instructions
```

### Cross-Project References

Documents can reference other projects:

```yaml
---
# In frontend ADR
related:
  projects: [shared]
  depends-on:
    adrs: [shared/use-typescript]  # Reference shared project ADR
---
```

## Example Project Structures

### Example 1: Microservices

```
.context1000/projects/
├── auth-service/
│   ├── decisions/adr/
│   │   ├── use-jwt.adr.md
│   │   └── use-redis-sessions.adr.md
│   ├── rules/
│   │   └── auth-rules.rules.md
│   └── guides/
│       └── setup.guide.md
├── payment-service/
│   ├── decisions/adr/
│   │   ├── use-stripe.adr.md
│   │   └── payment-processing.adr.md
│   ├── rules/
│   │   └── payment-rules.rules.md
│   └── guides/
│       └── integration.guide.md
└── shared/
    ├── decisions/adr/
    │   └── use-graphql.adr.md
    └── rules/
        └── api-rules.rules.md
```

### Example 2: Multi-Platform

```
.context1000/projects/
├── web/
│   ├── decisions/adr/
│   │   └── use-nextjs.adr.md
│   └── rules/
│       └── web-rules.rules.md
├── ios/
│   ├── decisions/adr/
│   │   └── use-swiftui.adr.md
│   └── rules/
│       └── ios-rules.rules.md
├── android/
│   ├── decisions/adr/
│   │   └── use-compose.adr.md
│   └── rules/
│       └── android-rules.rules.md
└── shared/
    ├── decisions/adr/
    │   └── api-design.adr.md
    └── guides/
        └── api-integration.guide.md
```

### Example 3: Feature-Based Projects

```
.context1000/projects/
├── authentication/
│   ├── decisions/adr/
│   │   └── oauth2-flow.adr.md
│   ├── rules/
│   │   └── auth-rules.rules.md
│   └── guides/
│       └── implementing-oauth.guide.md
├── payments/
│   ├── decisions/adr/
│   │   └── payment-gateway.adr.md
│   ├── rules/
│   │   └── payment-rules.rules.md
│   └── guides/
│       └── processing-payments.guide.md
└── analytics/
    ├── decisions/adr/
    │   └── event-tracking.adr.md
    └── rules/
        └── tracking-rules.rules.md
```

## Nested Projects

Projects can be nested for complex hierarchies:

```
.context1000/projects/
├── platform/
│   ├── decisions/adr/
│   │   └── platform-architecture.adr.md
│   └── projects/
│       ├── api/
│       │   ├── decisions/adr/
│       │   └── rules/
│       └── database/
│           ├── decisions/adr/
│           └── rules/
└── applications/
    ├── web/
    │   └── projects/
    │       ├── admin/
    │       └── customer/
    └── mobile/
        └── projects/
            ├── ios/
            └── android/
```

Reference nested projects:

```yaml
---
related:
  projects: [platform/api]
  depends-on:
    adrs: [platform/api/graphql-design]
---
```

## Best Practices

### Choosing Project Organization

**Use flat structure** when:
- Simple codebase with few projects
- Most artifacts are shared
- Project boundaries are fluid

**Use projects directory** when:
- Clear project boundaries
- Many project-specific artifacts
- Multiple teams with distinct ownership
- Microservices or multi-platform

### Project Naming

**Good names**:
- `frontend` - Clear, concise
- `auth-service` - Descriptive
- `mobile-ios` - Specific

**Bad names**:
- `proj1` - Not descriptive
- `the-frontend-application-project` - Too verbose
- `FrontEnd` - Inconsistent casing

### Shared vs. Project-Specific

**Shared documentation** (root level or shared project):
- Cross-cutting concerns (logging, monitoring)
- Common tooling (TypeScript, ESLint)
- Company-wide standards
- Infrastructure decisions

**Project-specific documentation**:
- Technology choices specific to project
- Project-specific rules and patterns
- Setup and deployment for that project
- Team-specific conventions

### Cross-Project Dependencies

Document dependencies explicitly:

```yaml
---
# In frontend ADR
name: use-graphql-client
related:
  projects: [backend]
  depends-on:
    adrs: [backend/graphql-api]  # Backend must have GraphQL
---
```

This helps AI agents understand relationships between projects.

## MCP Integration Examples

### Example 1: Project-Scoped Query

```
User: "What are the React rules for the frontend?"

AI Agent calls:
check_project_rules({ project: "frontend" })

Returns: frontend/rules/react-rules.rules.md
```

### Example 2: Cross-Project Context

```
User: "How does the frontend authenticate with the backend?"

AI Agent:
1. check_project_rules({ project: "frontend" })
   → Frontend auth rules

2. search_guides({
     query: "authentication",
     project: "frontend"
   })
   → Frontend auth guide

3. search_decisions({
     query: "authentication",
     project: "backend"
   })
   → Backend auth design

Returns: Complete picture of auth across projects
```

### Example 3: Multi-Project Feature

```
User: "Implement user profile feature across web and mobile"

AI Agent:
1. check_project_rules({ project: "web" })
2. check_project_rules({ project: "mobile-ios" })
3. check_project_rules({ project: "mobile-android" })
4. search_guides({ query: "user profile" })
   (searches all projects)

Provides: Platform-specific guidance for each
```

## Migrating to Projects

### From Flat to Projects

1. Create project directories:
```bash
mkdir -p .context1000/projects/{frontend,backend}/\{decisions/adr,rules,guides\}
```

2. Move artifacts by project tag:
```bash
# Find frontend artifacts
grep -l "tags:.*frontend" .context1000/**/*.md

# Move to frontend project
mv .context1000/rules/react-rules.rules.md \
   .context1000/projects/frontend/rules/
```

3. Update cross-references:
```yaml
# Old:
related:
  rules: [react-rules]

# New:
related:
  rules: [frontend/react-rules]
```

4. Re-index:
```bash
context1000 index .context1000
```

## Summary

- **Projects organize** documentation by service, platform, or feature
- Can use **flat structure** (tags) or **dedicated directories**
- **MCP tools support** project filtering
- Enable **cross-project** references and dependencies
- **Nested projects** for complex hierarchies
- Choose structure based on **complexity** and **team organization**

## Next Steps

- [Learn about Decisions](/core-concepts/decisions/) - Document project decisions
- [Learn about Rules](/core-concepts/rules/) - Create project-specific rules
- [Learn about Guides](/core-concepts/guides/) - Write project guides
- [Format Specification](/reference/format-specification/) - Detailed syntax
