# Cross-References and Dependencies

[← Back to Home](../index.md)

All artifacts in context1000 use YAML front matter to establish relationships and dependencies. This enables AI agents to understand context and trace the reasoning behind decisions.

## Front Matter Structure

Every artifact should include front matter at the top of the file:

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

## Dependencies (depends-on)

The `depends-on` field establishes a dependency graph between artifacts.

### Purpose
Indicates which documents must exist or be decided before this one.

### Use Cases

**ADR depends on RFC:**
```yaml
---
name: implement-oauth2
title: Implement OAuth2 Authentication
related:
  depends-on:
    rfcs: [authentication-system-proposal]
---
```

**Rule depends on ADR:**
```yaml
---
name: authentication-rules
title: Authentication Rules
related:
  depends-on:
    adrs: [implement-oauth2]
---
```

**Guide depends on Rules:**
```yaml
---
name: auth-setup-guide
title: Authentication Setup Guide
related:
  depends-on:
    rules: [authentication-rules]
    adrs: [implement-oauth2]
---
```

### Benefits for AI

- **Understand logical flow**: AI can trace the sequence of decisions
- **Retrieve prerequisite context**: When analyzing a document, AI can fetch dependencies
- **Validate dependencies**: Check that all prerequisites are resolved
- **Build knowledge graph**: Create a complete map of architectural decisions

## Supersedes

The `supersedes` field tracks document evolution and deprecation.

### Purpose
Indicates which older documents are replaced or deprecated by this one.

### Use Cases

**New ADR supersedes old ADR:**
```yaml
---
name: oauth2-with-pkce
title: OAuth2 with PKCE Flow
status: accepted
related:
  supersedes:
    adrs: [basic-oauth2-implementation]
---
```

**Revised RFC supersedes previous:**
```yaml
---
name: new-auth-proposal-v2
title: Authentication System Proposal v2
status: draft
related:
  supersedes:
    rfcs: [new-auth-proposal-v1]
---
```

### Benefits

- **Maintain history**: Track how decisions evolved over time
- **Avoid confusion**: Clear indication of which version is current
- **Audit trail**: Understand why previous approaches were replaced

## Complete Example

Here's a complete example showing the relationship flow:

**1. RFC (Proposal):**
```yaml
---
name: microservices-migration
title: Migrate to Microservices Architecture
status: accepted
tags: [architecture, migration]
---
```

**2. ADR (Decision):**
```yaml
---
name: implement-service-mesh
title: Implement Service Mesh with Istio
status: accepted
tags: [microservices, networking]
related:
  depends-on:
    rfcs: [microservices-migration]
---
```

**3. Rules (Imperatives):**
```yaml
---
name: service-communication-rules
title: Service Communication Rules
tags: [microservices, networking]
related:
  depends-on:
    adrs: [implement-service-mesh]
---

1. All service-to-service communication MUST go through the service mesh
2. Services MUST NOT make direct HTTP calls to other services
3. Circuit breakers MUST be configured for all external dependencies
```

**4. Guide (Implementation):**
```yaml
---
name: service-mesh-setup
title: Service Mesh Setup Guide
tags: [microservices, tutorial]
related:
  depends-on:
    adrs: [implement-service-mesh]
    rules: [service-communication-rules]
---

# Service Mesh Setup Guide

Follow these steps to configure your service...
```

## See Also

- [Artifact Types](artifact-types.md)
- [Getting Started](getting-started.md)

[← Back to Home](../index.md)
