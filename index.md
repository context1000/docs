# context1000: Architectural Artifacts for AI

![context1000 schema](./images/base-schema.png)

A strict documentation format designed exclusively for AI agents. Four artifact types capture both the "why" behind decisions and the resulting rules and instructions.

## Quick Navigation

- [Structure](#structure)
- [Artifact Types](#artifact-types)
  - [Decisions (RFC & ADR)](#decisions)
  - [Rules](#rules)
  - [Guides](#guides)
  - [Projects](#projects)
- [Naming Conventions](#naming-conventions)
- [Cross-References](#cross-references-and-dependencies)
- [More Information](#more-information)

## Structure

```sh
.context1000/
├── index.md                  # Main index and overview
├── decisions/                # Why we chose this approach
│   ├── index.md              # Decisions index
│   ├── adr/                  # Architectural Decision Records (implementation details)
│   │   └── example.adr.md
│   └── rfc/                  # Request for Comments (proposals and options)
│       └── example.rfc.md
├── rules/                    # What must and must not be done (imperatives derived from decisions)
│   ├── index.md              # Rules index
│   ├── example1.rules.md
│   └── subdirectory/         # Subdirectories supported for organization
│       └── example2.rules.md
├── guides/                   # How to implement and use (practical instructions)
│   ├── index.md              # Guides index
│   ├── example1.guide.md
│   └── subdirectory/         # Subdirectories supported for organization
│       └── example2.guide.md
└── projects/                 # Project-specific documentation (only projects, no subdirectories)
    ├── index.md              # Projects index
    ├── project1/
    │   ├── project.md        # Project overview
    │   ├── decisions/        # Project-specific ADRs and RFCs
    │   │   ├── adr/
    │   │   │   └── example.adr.md
    │   │   └── rfc/
    │   │       └── example.rfc.md
    │   ├── rules/            # Project-specific rules
    │   │   ├── example1.rules.md
    │   │   └── subdirectory/ # Subdirectories supported
    │   │       └── example2.rules.md
    │   ├── guides/           # Project-specific guides
    │   │   ├── example1.guide.md
    │   │   └── subdirectory/ # Subdirectories supported
    │   │       └── example2.guide.md
    │   └── projects/         # Nested sub-projects
    │       └── subproject1/
    │           ├── project.md
    │           ├── decisions/
    │           ├── rules/
    │           └── guides/
    └── project2/
        ├── project.md
        ├── decisions/
        │   ├── adr/
        │   │   └── example.adr.md
        │   └── rfc/
        │       └── example.rfc.md
        ├── rules/
        │   ├── example1.rules.md
        │   └── subdirectory/
        │       └── example2.rules.md
        └── guides/
            ├── example1.guide.md
            └── subdirectory/
                └── example2.guide.md
```

## Artifact Types

### Decisions

Capture the "why" behind choices using well-known formats:

#### RFC (Request for Comments)

Proposals outlining solution options and constraints. Each RFC contains:

- **Summary**: Who needs it and what changes
- **Context and problem**: Current behavior/limitations
- **Proposed solution**: Architectural idea, API/contracts, data/schema
- **Alternatives**: Why other options were rejected
- **Impact**: Performance, compatibility, security considerations
- **Implementation plan**: Milestones with estimates and rollback plan
- **Success metrics**: How to measure success
- **Risks and open questions**: Known issues and uncertainties

#### ADR (Architectural Decision Record)

Implementation details of chosen directions. Each ADR contains:

- **Context**: The issue motivating this decision
- **Decision**: The change being proposed or implemented
- **Consequences**: What becomes easier or harder

### Rules

Imperatives derived from decisions. State what must/must not be done. Rules are:

- Written as clear, actionable directives (numbered lists)
- Reference related RFCs/ADRs for context via front matter
- Can be organized in subdirectories for better categorization

### Guides

Implementation and usage details. Cover:

- Installation and setup instructions
- Usage examples and best practices
- Architecture overviews and conventions
- Step-by-step tutorials
- Can be organized in subdirectories by topic

### Projects

Self-contained documentation following the same structure. Each project includes:

- **project.md**: Project overview with name, title, tags, and repository link
- **decisions/**: Project-specific ADRs and RFCs
- **rules/**: Project-specific rules (with subdirectory support)
- **guides/**: Project-specific guides (with subdirectory support)
- **projects/**: Nested sub-projects (optional)

**Important Notes:**

- The root-level `projects/` directory contains only project directories (no subdirectories for organization)
- Individual projects can contain nested sub-projects following the same structure
- Each project and sub-project must have a `project.md` file
- Each major directory (decisions, rules, guides, projects) includes an `index.md` file

## Naming Conventions

Files follow strict naming patterns for AI parsing and cross-referencing:

```sh
.context1000/decisions/adr/name.adr.md       # example.adr.md
.context1000/decisions/rfc/name.rfc.md       # example.rfc.md
.context1000/rules/name.rules.md             # example1.rules.md
.context1000/rules/subdirectory/name.rules.md # example2.rules.md
.context1000/guides/name.guide.md            # example1.guide.md
.context1000/guides/subdirectory/name.guide.md # example2.guide.md
.context1000/projects/name/project.md        # project1/project.md
```

**Pattern Rules:**

- All artifacts live under `.context1000/` directory
- ADR/RFC: Descriptive name + type extension
- Rules/Guides: Descriptive name + type extension
- Subdirectories are supported within rules/, guides/, and project-specific directories for better organization
- Projects: Directory name matches project identifier
  - Root-level `projects/` contains only project directories (no organizational subdirectories)
  - Individual projects can contain nested `projects/` directories for sub-projects
- Use kebab-case for all names
- Extensions (.adr.md, .rfc.md, .rules.md, .guide.md) enable type-based tooling

## Cross-References and Dependencies

All artifacts use front matter to establish relationships and dependencies. This enables AI agents to understand the context and trace the reasoning behind decisions.

### Front Matter Structure

```yaml
---
name: unique-identifier        # Unique identifier for the artifact
title: Human-readable title    # Human-readable title
status: accepted               # Status: accepted, rejected, draft (for ADRs/RFCs)
tags: [tag1, tag2]            # Categorization tags
repository: <link>             # Repository URL (for projects only)
related:                       # Cross-references to related documents
  rfcs: [rfc-name]            # Related RFCs by name
  adrs: [adr-name]            # Related ADRs by name
  rules: [rule-name]          # Related rules by name
  guides: [guide-name]        # Related guides by name
  projects: [project-name]    # Related projects by name
  depends-on:                  # Dependencies - documents that must exist first
    adrs: []                  # ADRs this depends on
    rfcs: []                  # RFCs this depends on
    guides: []                # Guides this depends on
    rules: []                 # Rules this depends on
    projects: []              # Projects this depends on
  supersedes:                  # Documents that this replaces/deprecates
    adrs: []                  # ADRs superseded
    rfcs: []                  # RFCs superseded
    guides: []                # Guides superseded
    rules: []                 # Rules superseded
    projects: []              # Projects superseded
---
```

### Dependencies (depends-on)

The `depends-on` field establishes a dependency graph between artifacts:

- **Purpose**: Indicates which documents must exist or be decided before this one
- **Use cases**:
  - An ADR depends on an RFC that proposed the solution
  - A rule depends on an ADR that made the decision
  - A guide depends on rules that define the requirements
  - A project depends on ADRs defining its architecture
- **Benefits for AI**:
  - Understand the logical flow of decisions
  - Retrieve prerequisite context when analyzing a document
  - Validate that dependencies are resolved before implementation
  - Build a knowledge graph of architectural decisions

### Supersedes

The `supersedes` field tracks document evolution:

- **Purpose**: Indicates which older documents are replaced or deprecated by this one
- **Use cases**:
  - A new ADR supersedes an older ADR with updated decisions
  - A revised RFC supersedes a previous proposal
  - Updated rules replace outdated requirements
- **Benefits**: Maintain documentation history and avoid confusion about which version is current

## More Information

- [RAG+MCP for self-hosted usage](https://github.com/context1000/context1000)
- [Blog post about context1000](https://www.ivklgn.blog/posts/context1000-architectural-artifacts-for-ai/)

---

**GitHub Repository**: [context1000/context1000](https://github.com/context1000/context1000)
