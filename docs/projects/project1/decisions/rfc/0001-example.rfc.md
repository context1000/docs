---
name: 0003-rfc-name           # Unique identifier for the RFC
title: RFC Title              # Human-readable title
status: accepted              # accepted, rejected, draft
tags: [tag1, tag2]            # Categorization tags
related:                      # Cross-references to related documents (one or many)
  rfcs: [0001-rfc-name]       # Related RFCs by name
  adrs: [0001-adr-name]       # Related ADRs by name
  rules: [rule-name]          # Related rules by name
  guides: [guide-name]        # Related guides by name
  projects: [project-name]    # Related projects by name
---

## Summary

Who needs it and what changes in one paragraph.

## Context and problem

Current behavior/limitations, scope of impact.

## Proposed solution

- Architectural idea (1-3 bullet points).
- API/contracts (brief, code block if necessary).
- Data/schema/migrations (one-two sentences).

## Alternatives

Why not X and Y (one sentence per alternative).

## Impact

- Performance/cost
- Compatibility/migrations
- Security/privacy

## Implementation plan

Milestones with estimates: M1, M2, M3. Rollback plan in one sentence.

## Success metrics

How we will understand what worked (numbers/threshold/date).

## Risks and open questions

A short list
