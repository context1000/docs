---
name: example-rule
title: Example Rule
tags: [tag1, tag2]
severity: medium # low, medium, high
related:
  rfcs: []
  adrs: []
  rules: []
  guides: []
  projects: [project1, project2]
---

# Rule title

For all new projects and when updating existing ones:

1. use Vitest as the primary testing framework
2. migrate from Jest to Vitest when possible
3. use native TypeScript support without additional transformations
