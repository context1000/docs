---
name: guide-name # Unique identifier for the guide
title: Guide title # Human-readable title
tags: [tag1, tag2] # Categorization tags
related: # Cross-references to related documents (one or many)
  rfcs: [rfc-name] # Related RFCs by name
  adrs: [adr-name] # Related ADRs by name
  rules: [rule-name] # Related rules by name
  guides: [guide-name] # Related guides by name
  projects: [project-name] # Related projects by name
  depends-on: # Dependencies - documents that must exist/be decided first
    adrs: [] # ADRs depends on
    rfcs: [] # RFCs depends on
    guides: [] # Guides depends on
    rules: [] # Rules depends on
    projects: [] # Projects depends on
  supersedes: # Documents that this replaces/deprecates
    adrs: [] # ADRs superseded
    rfcs: [] # RFCs superseded
    guides: [] # Guides superseded
    rules: [] # Rules superseded
    projects: [] # Projects superseded
---

## Part 1

Documentation paragraph

## Part 2

One more documentation here
