---
title: Format Specification
description: Complete specification of the context1000 documentation format
---

This document provides the complete specification for the context1000 documentation format, including directory structure, file naming conventions, and front matter schema.

## Directory Structure

All context1000 documentation lives under the `.context1000/` directory in your project root:

```
.context1000/
├── index.md                  # Main index and overview
├── decisions/                # Why we chose this approach
│   ├── index.md              # Decisions index
│   ├── adr/                  # Architectural Decision Records
│   │   └── *.adr.md
│   └── rfc/                  # Request for Comments
│       └── *.rfc.md
├── rules/                    # What must and must not be done
│   ├── index.md              # Rules index
│   ├── *.rules.md
│   └── subdirectory/         # Subdirectories supported
│       └── *.rules.md
├── guides/                   # How to implement and use
│   ├── index.md              # Guides index
│   ├── *.guide.md
│   └── subdirectory/         # Subdirectories supported
│       └── *.guide.md
└── projects/                 # Project-specific documentation
    ├── index.md              # Projects index
    ├── project1/
    │   ├── project.md        # Project overview
    │   ├── decisions/
    │   │   ├── adr/
    │   │   └── rfc/
    │   ├── rules/
    │   ├── guides/
    │   └── projects/         # Nested sub-projects
    └── project2/
        ├── project.md
        ├── decisions/
        ├── rules/
        └── guides/
```

### Directory Rules

1. **Root Level**: Only `.context1000/` at project root
2. **Decisions**: Must have separate `adr/` and `rfc/` subdirectories
3. **Rules & Guides**: Support arbitrary subdirectories for organization
4. **Projects**: Root `projects/` contains only project directories (no organizational subdirectories)
5. **Nested Projects**: Individual projects can contain `projects/` directories for sub-projects
6. **Index Files**: Each major directory should have an `index.md` file

## File Naming Conventions

Files follow strict naming patterns to enable type-based tooling and AI parsing:

### Pattern Format

```
{descriptive-name}.{type}.md
```

### Type Extensions

| Type | Extension | Example |
|------|-----------|---------|
| Architectural Decision Record | `.adr.md` | `use-typescript.adr.md` |
| Request for Comments | `.rfc.md` | `new-api-design.rfc.md` |
| Rules | `.rules.md` | `coding-standards.rules.md` |
| Guides | `.guide.md` | `setup-guide.guide.md` |
| Project | `project.md` | `project.md` (filename is always `project.md`) |

### Naming Rules

1. Use **kebab-case** for all filenames (lowercase with hyphens)
2. Names should be **descriptive** and **unique** within their directory
3. Avoid generic names like `document.adr.md` - be specific
4. Keep names **concise** but **meaningful** (typically 2-5 words)
5. Project directories should match the project identifier
6. **Never use underscores** in filenames (except in generated IDs)

### Examples

#### Good Names
- `use-react-hooks.adr.md`
- `database-migration-strategy.rfc.md`
- `api-versioning.rules.md`
- `deployment-process.guide.md`

#### Bad Names
- `decision.adr.md` (too generic)
- `Use_React_Hooks.adr.md` (not kebab-case)
- `this-is-a-very-long-descriptive-name-for-a-decision.adr.md` (too long)
- `adr-001.adr.md` (use descriptive names, not numbers)

## Front Matter Schema

All artifacts use YAML front matter for metadata and cross-references.

### Required Fields

```yaml
---
name: unique-identifier       # Unique identifier (kebab-case)
title: Human-readable title   # Display title
---
```

### Common Optional Fields

```yaml
---
name: unique-identifier
title: Human-readable title
status: accepted              # Status (varies by type)
tags: [tag1, tag2]           # Categorization tags
repository: https://...       # Repository URL (projects only)
---
```

### Cross-Reference Fields

```yaml
---
related:
  # Simple references (bidirectional relationships)
  rfcs: [rfc-name]           # Related RFCs
  adrs: [adr-name]           # Related ADRs
  rules: [rule-name]         # Related rules
  guides: [guide-name]       # Related guides
  projects: [project-name]   # Related projects

  # Directed relationships (dependency graph)
  depends-on:
    adrs: [adr-name]         # This depends on these ADRs
    rfcs: [rfc-name]         # This depends on these RFCs
    guides: [guide-name]     # This depends on these guides
    rules: [rule-name]       # This depends on these rules
    projects: [project-name] # This depends on these projects

  # Document evolution (replacement tracking)
  supersedes:
    adrs: [old-adr-name]     # This replaces these ADRs
    rfcs: [old-rfc-name]     # This replaces these RFCs
    guides: [old-guide-name] # This replaces these guides
    rules: [old-rule-name]   # This replaces these rules
    projects: [old-project]  # This replaces these projects
---
```

## Artifact Type Specifications

### RFC (Request for Comments)

**Location**: `.context1000/decisions/rfc/`
**Extension**: `.rfc.md`
**Purpose**: Proposals outlining solution options and constraints

#### Front Matter

```yaml
---
name: unique-rfc-identifier
title: RFC Title
status: draft | review | accepted | rejected | implemented
tags: [tag1, tag2]
related:
  adrs: []          # ADRs that implemented this RFC
  guides: []        # Implementation guides
  depends-on:
    rfcs: []        # RFCs this builds upon
---
```

#### Required Sections

1. **Summary**: Who needs it and what changes
2. **Context and Problem**: Current behavior/limitations
3. **Proposed Solution**: Architectural idea, API/contracts, data/schema
4. **Alternatives**: Why other options were rejected
5. **Impact**: Performance, compatibility, security considerations
6. **Implementation Plan**: Milestones with estimates and rollback plan
7. **Success Metrics**: How to measure success
8. **Risks and Open Questions**: Known issues and uncertainties

### ADR (Architectural Decision Record)

**Location**: `.context1000/decisions/adr/`
**Extension**: `.adr.md`
**Purpose**: Implementation details of chosen directions

#### Front Matter

```yaml
---
name: unique-adr-identifier
title: ADR Title
status: draft | accepted | rejected | deprecated | superseded
tags: [tag1, tag2]
related:
  rfcs: []          # RFC that proposed this
  rules: []         # Rules derived from this decision
  guides: []        # Implementation guides
  depends-on:
    adrs: []        # ADRs this builds upon
    rfcs: []        # RFCs this implements
  supersedes:
    adrs: []        # Older ADRs this replaces
---
```

#### Required Sections

1. **Context**: The issue motivating this decision
2. **Decision**: The change being proposed or implemented
3. **Consequences**: What becomes easier or harder

### Rules

**Location**: `.context1000/rules/` (subdirectories supported)
**Extension**: `.rules.md`
**Purpose**: Imperatives derived from decisions

#### Front Matter

```yaml
---
name: unique-rules-identifier
title: Rules Title
tags: [tag1, tag2]
related:
  adrs: []          # ADRs these rules implement
  rfcs: []          # RFCs these rules implement
  guides: []        # Guides that explain these rules
  depends-on:
    adrs: []        # ADRs that define these rules
    rfcs: []        # RFCs that define these rules
---
```

#### Content Format

Rules should be written as **numbered lists** of clear, actionable directives:

```markdown
# Rule Category

1. All functions MUST have JSDoc comments
2. Use async/await instead of promise chains
3. NEVER commit sensitive credentials
4. Always validate user input
5. Follow the single responsibility principle
```

Use imperative language:
- MUST / MUST NOT (required)
- SHOULD / SHOULD NOT (recommended)
- MAY (optional)

### Guides

**Location**: `.context1000/guides/` (subdirectories supported)
**Extension**: `.guide.md`
**Purpose**: Implementation and usage details

#### Front Matter

```yaml
---
name: unique-guide-identifier
title: Guide Title
tags: [tag1, tag2]
related:
  adrs: []          # Decisions that inform this guide
  rfcs: []          # Proposals that inform this guide
  rules: []         # Rules this guide implements
  projects: []      # Projects this guide applies to
  depends-on:
    guides: []      # Prerequisites
    rules: []       # Rules to read first
---
```

#### Content Structure

Guides can include:
- Installation and setup instructions
- Step-by-step tutorials
- Code examples
- Architecture overviews
- Best practices
- Troubleshooting
- References to decisions

### Projects

**Location**: `.context1000/projects/{project-name}/`
**Filename**: Always `project.md`
**Purpose**: Project overview and self-contained documentation

#### Front Matter

```yaml
---
name: project-identifier
title: Project Title
status: active | inactive | archived | planning
tags: [tag1, tag2]
repository: https://github.com/org/repo
related:
  projects: []      # Related/dependent projects
  depends-on:
    projects: []    # Projects this depends on
  supersedes:
    projects: []    # Projects this replaces
---
```

#### Project Structure

Each project directory contains:
- `project.md` - Project overview (required)
- `decisions/` - Project-specific ADRs and RFCs
- `rules/` - Project-specific rules
- `guides/` - Project-specific guides
- `projects/` - Nested sub-projects (optional)

## Cross-Reference Semantics

### `related`

Bidirectional associations between artifacts. Use for:
- General relationships
- "See also" links
- Related topics

### `depends-on`

Directed dependencies (A depends on B). Use when:
- An ADR depends on an RFC that proposed it
- A rule depends on an ADR that mandates it
- A guide depends on rules it implements
- Order matters for understanding

Benefits for AI:
- Understand logical flow
- Retrieve prerequisite context
- Validate dependency resolution
- Build knowledge graph

### `supersedes`

Document evolution tracking (A supersedes B). Use when:
- A new ADR replaces an old one
- A revised RFC supersedes a previous proposal
- Updated rules replace outdated requirements

Benefits:
- Maintain documentation history
- Avoid confusion about current version
- Track architectural evolution

## Processing and Indexing

### Document Chunking

The document processor:
1. Extracts front matter metadata
2. Splits content into semantic sections (by heading)
3. Creates chunks optimized for `text-embedding-3-small`:
   - **Max chunk size**: 1200 tokens
   - **Overlap**: 200 tokens (~17%)
   - **Sentence-aware splitting**: Respects sentence boundaries
4. Adds document title context to each chunk
5. Preserves section type and metadata

### Chunk Metadata

Each chunk includes:

```typescript
{
  id: string;                    // Unique chunk ID
  content: string;               // Chunk text with context
  metadata: {
    title: string;               // Document title
    type: "adr" | "rfc" | "guide" | "rule" | "project";
    tags: string[];              // From front matter
    projects: string[];          // Associated projects
    status?: string;             // Document status
    filePath: string;            // Original file path
    chunkIndex: number;          // 0-based chunk number
    totalChunks: number;         // Total chunks in document
    sectionType?: string;        // context | decision | etc.
    sectionTitle?: string;       // Section heading
    tokens: number;              // Estimated token count
    related?: {...};             // Cross-references
  }
}
```

### Section Type Inference

The processor infers semantic section types:

| Pattern | Section Type |
|---------|--------------|
| context, problem, background, motivation | `context` |
| decision, solution, approach, proposal | `decision` |
| consequence, impact, tradeoff | `consequences` |
| alternative, option, comparison | `alternatives` |
| implementation, plan, rollout | `implementation` |
| summary, overview, tldr | `summary` |
| metric, success, criteria, kpi | `metrics` |
| risk, concern, question | `risks` |

This enables targeted retrieval (e.g., "show me the consequences of ADR-042").

## Validation Rules

### File Validation

1. All artifacts must have valid YAML front matter
2. `name` must be unique within its artifact type
3. `title` is required for all artifacts
4. File extension must match artifact type
5. Files starting with `_` are ignored

### Reference Validation

1. Cross-references should use the `name` field value (not filename)
2. Circular dependencies are allowed but should be documented
3. `depends-on` references should exist (soft requirement)
4. `supersedes` references should exist (soft requirement)

### Status Validation

Valid status values by type:

| Type | Valid Statuses |
|------|----------------|
| ADR | draft, accepted, rejected, deprecated, superseded |
| RFC | draft, review, accepted, rejected, implemented |
| Project | active, inactive, archived, planning |
| Rule | (any string or omitted) |
| Guide | (any string or omitted) |

## Best Practices

### Naming

1. **Be specific**: `use-react-hooks.adr.md` not `frontend.adr.md`
2. **Be consistent**: Use similar naming patterns across related documents
3. **Be concise**: Aim for 2-4 words in the name
4. **Use action verbs**: `implement-caching.adr.md` not `caching.adr.md`

### Organization

1. **Use subdirectories** in rules/ and guides/ for better categorization
2. **Keep related artifacts together** using consistent naming
3. **Update index.md files** when adding new artifacts
4. **Use projects/** for distinct codebases or modules

### Cross-References

1. **Link liberally**: More references = better context for AI
2. **Use depends-on** when order matters for understanding
3. **Use supersedes** to track document evolution
4. **Update bidirectional links** when adding references

### Content

1. **Write for AI comprehension**: Clear, structured, explicit
2. **Include examples**: Code snippets, diagrams, scenarios
3. **State rationale**: Explain the "why" behind decisions
4. **Keep rules atomic**: One rule per numbered item
5. **Update superseded documents**: Add deprecation notices

## Examples

See the [Examples Guide](/guides/examples/) for complete examples of each artifact type.
