# @context1000/docs

Template for repository with documentation. Based on [docusaurus](https://docusaurus.io/).

## Install

```sh
git clone https://github.com/context1000/docs.git
```

or use as template in Github/Gitlab

```sh
npm i
```

## Run Docusaurus

```sh
npm run start
```

## Structure of **docs/** folder

In `docs` folder you should store documentation in the following structure:

```yaml
- intro.md             - Introduction documentation
- decisions/           - Global decisions
  - adr/               - Architecture Decision Records (global)
    - 0001-example.adr.md
  - rfc/               - Request for Comments (global)
    - 0001-example.rfc.md
- guides/              - User and developer guides (global)
  - example1.guide.md
  - guide1/            - Example guide subdirectory (guides can contain nested subdirectories)
    - example2.guide.md
- rules/               - Global rules and conventions (global)
  - example1.rules.md
  - subdirectory/      - Example rules subdirectory (rules can contain nested subdirectories)
    - example2.rules.md
- projects/            - Project-specific documentation
  - project1/          - Example project structure
    - project.md       - Project overview
    - decisions/       - Project-specific decisions (ADRs, RFCs)
      - adr/           - Project-specific ADRs
        - 0001-example.adr.md
      - rfc/           - Project-specific RFCs
        - 0001-example.rfc.md
    - guides/          - Project-specific guides (can contain nested subdirectories)
      - architecture.md
      - project-stack.md
      - guide1/        - Example project guide subdirectory
        - example.guide.md
    - rules/           - Project-specific rules and conventions (can contain nested subdirectories)
      - example.rules.md
      - subdirectory/  - Example project rules subdirectory
        - example.rules.md
  - subdirectory/      - Projects can be organized in nested subdirectories
    - project2/        - Another example project structure
      - project.md     - Project overview
      - decisions/     - Project-specific decisions (ADRs, RFCs)
        - adr/         - Project-specific ADRs
          - 0001-example.adr.md
        - rfc/         - Project-specific RFCs
          - 0001-example.rfc.md
      - guides/        - Project-specific guides (can contain nested subdirectories)
        - architecture.md
        - project-stack.md
        - guide1/      - Example project guide subdirectory
          - example.guide.md
      - rules/         - Project-specific rules and conventions (can contain nested subdirectories)
        - example1.rules.md
        - subdirectory/ - Example project rules subdirectory
          - example2.rules.md
```

### RFC

**RFC - Request for Comments**. When using `@context1000/docs`, use this document type to explore technical change options. Documents typically consider multiple variants of upcoming technical solutions. RFCs can reference other RFCs or ADRs. You can also reference guides and rules, indicating related resources.
Within the `@context1000/docs` documentation repository, you can store RFCs in `docs/decisions/rfc/`.

If you reject an RFC, it's still recommended to keep it in the repository. AI agents can beneficially use this information for your tasks.

[More about RFC](https://medium.com/@roberttcode/why-you-should-use-rfcs-b88222a5b6c)

### ADR

**ADR - Architectural Decision Record.** A document containing information about decisions made within the project. An Architectural Decision (AD) is a justified design choice that addresses a functional or non-functional requirement that is architecturally significant.
ADR can be a consequence of RFC or a separately created entity. Use ADR to document artifacts and decisions with detailed descriptions of the ideal end result.

Within the `@context1000/docs` documentation repository, you can store ADRs in `docs/decisions/adr/`.
Similar to RFCs, it's useful to store rejected ADRs as well as documents in template status.

[More about ADR](https://adr.github.io/)

### Rules

Rules help briefly describe "how it should be" or "should not be" rules, referencing RFCs, ADRs, and other rules and guides in the `related` section. Rules are typically formed after RFC/ADR decisions. You can also create rules independently of other documents, describing statements about the project, code, conventions, etc. Store global rules in `docs/rules/`. Rules can be organized in nested subdirectories within the rules folder for better categorization.

### Guides

Guides are instructions for creating or using software entities, projects, modules, and similar. Documentation is written with a focus on clarifying code generation and verification, as well as for developers. Store global guides in `docs/guides/`. Guides can be organized in nested subdirectories within the guides folder for better categorization.

### Projects

Projects are projects that include their own documentation, as well as their own local decisions (RFC/ADR), guides, and rules. Within the `@context1000/docs` documentation repository, you can create projects in `docs/projects/`.

The structure of decisions, guides, and rules should be similar to the global structure at the root level (described above).

## Document metadata

Each document type uses a YAML frontmatter block at the beginning of the file to provide metadata and establish relationships between documents.

### ADR (Architecture Decision Record) Metadata

```yaml
---
name: 0003-example            # Unique identifier for the ADR
title: ADR Title              # Human-readable title
status: accepted              # accepted, rejected, draft
tags: [tag1, tag2]            # Categorization tags
related:                      # Cross-references to related documents
  rfcs: [0001-example]        # Related RFCs by name
  adrs: []                    # Related ADRs by name
  rules: [example-rule]       # Related rules by name
  guides: []                  # Related guides by name
  projects: [project1]        # Related projects by directory name
---
```

### RFC (Request for Comments) Metadata

```yaml
---
name: 0001-example            # Unique identifier for the RFC
title: RFC Title              # Human-readable title
status: draft                 # draft, accepted, rejected
tags: [tag1, tag2]            # Categorization tags
related:                      # Cross-references to related documents
  rfcs: []                    # Related RFCs by name
  adrs: []                    # Related ADRs by name
  rules: []                   # Related rules by name
  guides: []                  # Related guides by name
  projects: [project1]        # Related projects by directory name
---
```

### Rules Metadata

```yaml
---
name: example-rule            # Unique identifier for the rule
title: Example Rule           # Human-readable title
tags: [tag1, tag2]            # Categorization tags
related:                      # Cross-references to related documents
  rfcs: []                    # Related RFCs by name
  adrs: []                    # Related ADRs by name
  rules: []                   # Related rules by name
  guides: []                  # Related guides by name
  projects: []                # Related projects by directory name
---
```

### Guides Metadata

```yaml
---
name: guide1                  # Unique identifier for the guide
title: Guide Title            # Human-readable title
related:                      # Cross-references to related documents
  rfcs: []                    # Related RFCs by name
  adrs: []                    # Related ADRs by name
  rules: []                   # Related rules by name
  guides: []                  # Related guides by name
  projects: []                # Related projects by directory name
---
```

### Project Metadata

```yaml
---
name: project1                # Unique identifier for the project
title: Project                # Human-readable title
tags: []                      # Categorization tags
related:                      # Cross-references to related documents
  rfcs: []                    # Related RFCs by name
  adrs: []                    # Related ADRs by name
  rules: []                   # Related rules by name
  guides: []                  # Related guides by name
  projects: []                # Related projects by directory name
repository: <link>            # Project repository URL (optional)
---
```

### Metadata Guidelines

- **name**: Use unique identifiers within each document type. For ADRs and RFCs, use numbered format (e.g., `0001-example`)
- **status**: Track document lifecycle (draft → accepted/rejected for RFCs; draft → accepted/rejected for ADRs)
- **tags**: Use consistent tags across documents for better categorization
- **related**: Create relationships between documents using the `name` field from other documents
- **projects**: Reference project directories by their folder name in `docs/projects/`