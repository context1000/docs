---
name: project-name # Unique identifier for the project
title: Project # Human-readable title
tags: [tag1, tag2] # Categorization tags
repository: <link> # Project repository URL
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

information about project here
