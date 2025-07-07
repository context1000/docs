# CLAUDE.md

This file contains information to help Claude Code understand and work with this documentation project.

## Project Overview

This is a documentation management system for the context1000 project, organized using a structured approach with ADRs, RFCs, guides, and rules.

## File Structure

The project follows a hierarchical documentation structure:

- `/docs/decisions/` - Architecture Decision Records (ADRs) and Request for Comments (RFCs)
- `/docs/guides/` - User guides and tutorials
- `/docs/projects/` - Project-specific documentation
- `/docs/rules/` - General rules and conventions

## Document Types and Templates

### Architecture Decision Records (ADRs)

- Naming: `NNNN-short-description.adr.md`
- Located in `decisions/adr/` directories
- Include frontmatter with id, title, and related documents

### Request for Comments (RFCs)

- Naming: `NNNN-short-description.rfc.md`
- Located in `decisions/rfc/` directories
- Include frontmatter with id, title, and related documents

### Guides

- Naming: `descriptive-name.guide.md`
- Located in `guides/` directories
- Include frontmatter with id, title, and related documents

### Rules

- Naming: `descriptive-name.rules.md`
- Located in `rules/` directories
- Include frontmatter with id, title, and related documents

## Frontmatter Structure

All documentation files should include frontmatter with:

```yaml
---
id: unique-identifier
title: Document Title
related:
  rfcs: []
  adrs: []
  rules: []
---
```

## Directory Organization

Each directory contains:

- `_category_.json` - Configuration for documentation categorization
- Relevant documentation files following naming conventions

## Project-Specific Documentation

Projects can have their own documentation structure including:

- `project.md` - Project overview
- `stack.md` - Technology stack documentation
- `decisions/` - Project-specific decisions (ADRs/RFCs)
- `rules/` - Project-specific rules

## Working with Documentation

When creating or editing documentation:

1. Follow the established naming conventions
2. Include proper frontmatter with metadata
3. Place files in the appropriate directory structure
4. Update related documents when creating cross-references
5. Ensure `_category_.json` files are present for organization

## Common Commands

This project appears to be a documentation-only project without specific build or test commands. When working with the documentation, focus on:

- Maintaining consistent formatting
- Following the established file structure
- Ensuring proper cross-references between documents
- Keeping `_category_.json` files up to date
