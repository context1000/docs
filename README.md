# context1000: Architectural Artifacts for AI

![context1000 schema](./images/base-schema.png)

A strict documentation format designed exclusively for AI agents. Four artifact types capture both the "why" behind decisions and the resulting rules and instructions.

## Structure

```sh
docs/
├── decisions/                # Why we chose this approach
│   ├── adr/                  # Architectural Decision Records (implementation details)
│   └── rfc/                  # Request for Comments (proposals and options)
├── rules/                    # What must and must not be done (imperatives derived from decisions)
├── guides/                   # How to implement and use (practical instructions)
└── projects/                 # Project-specific documentation
    └── [project]/
        ├── decisions/        # Project-specific ADRs and RFCs
        ├── rules/            # Project-specific rules
        ├── guides/           # Project-specific guides
        └── project.md        # Project overview
```

## Artifact Types

### Decisions

Capture the "why" behind choices using well-known formats:

- **RFC**: Proposals outlining solution options and constraints
- **ADR**: Implementation details of chosen directions

### Rules

Imperatives derived from decisions. State what must/must not be done. Reference related RFCs/ADRs for context.

### Guides

Implementation and usage details. Reference decisions and rules. Cover installation, usage, architecture overviews, and conventions.

### Projects

Self-contained documentation following the same structure. Each project includes decisions, rules, guides, and a project.md overview.

## Naming Conventions

Files follow strict naming patterns for AI parsing and cross-referencing:

```sh
decisions/adr/name.adr.md    # auth-decision.adr.md
decisions/rfc/name.rfc.md    # auth-proposal.rfc.md
rules/name.rules.md               # auth-security.rules.md
guides/name.guide.md              # auth-quickstart.guide.md
projects/name/project.md          # auth/project.md
```

**Pattern Rules:**

- ADR/RFC: 4-digit sequence + descriptive name + type extension
- Rules/Guides: Descriptive name + type extension
- Projects: Directory name matches project identifier
- Use kebab-case for all names
- Extensions (.adr.md, .rfc.md, .rules.md, .guide.md) enable type-based tooling

## Cross-References

All artifacts use front matter to establish relationships:

```yaml
---
name: unique-identifier
title: Human-readable title
related:
  rfcs: [related-rfc-names]
  adrs: [related-adr-names]
  rules: [related-rule-names]
  guides: [related-guide-names]
  projects: [related-project-names]
---
```

## More information

- [Ready to use templates (docusarus, mintlify) with context1000 structure](https://github.com/context1000/templates)
- [RAG+MCP for self-hosted usage](https://github.com/context1000/context1000)
- [Blog post about context1000](https://www.ivklgn.blog/posts/context1000-architectural-artifacts-for-ai/)
