---
name: rule-name               # Unique identifier for the rule
title: Rule title             # Human-readable title
tags: [tag1, tag2]            # Categorization tags
related:                      # Cross-references to related documents (one or many)
  rfcs: [0001-rfc-name]       # Related RFCs by name
  adrs: [0001-adr-name]       # Related ADRs by name
  rules: [rule-name]          # Related rules by name
  guides: [guide-name]        # Related guides by name
  projects: [project-name]    # Related projects by name
---

# Rule name

For all new projects and when updating existing ones:

1. use Vitest as the primary testing framework
2. migrate from Jest to Vitest when possible
3. use native TypeScript support without additional transformations
