# Getting Started

[← Back to Home](../index.md)

## Quick Start

context1000 is a strict documentation format designed for AI agents. It uses four artifact types to capture architectural decisions and their resulting rules and instructions.

## Installation

1. Create a `.context1000/` directory in your project root
2. Follow the [directory structure](#directory-structure) guidelines
3. Start documenting your decisions using the artifact types

## Directory Structure

```sh
.context1000/
├── index.md                  # Main index and overview
├── decisions/                # Why we chose this approach
│   ├── index.md
│   ├── adr/                  # Architectural Decision Records
│   └── rfc/                  # Request for Comments
├── rules/                    # What must and must not be done
│   └── index.md
├── guides/                   # How to implement and use
│   └── index.md
└── projects/                 # Project-specific documentation
    └── index.md
```

## Basic Workflow

1. **Propose a change** - Create an RFC in `decisions/rfc/`
2. **Make a decision** - Document it as an ADR in `decisions/adr/`
3. **Define rules** - Extract imperatives into `rules/`
4. **Write guides** - Create implementation instructions in `guides/`

## Naming Your Files

All files follow strict naming patterns:

- ADRs: `name.adr.md` (e.g., `api-versioning.adr.md`)
- RFCs: `name.rfc.md` (e.g., `new-auth-system.rfc.md`)
- Rules: `name.rules.md` (e.g., `api-design.rules.md`)
- Guides: `name.guide.md` (e.g., `setup-instructions.guide.md`)

Use kebab-case for all file names.

## Next Steps

- Learn about [Artifact Types](artifact-types.md)
- Understand [Cross-References](cross-references.md)
- See [Examples](examples.md)

[← Back to Home](../index.md)
