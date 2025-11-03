# Examples

[← Back to Home](../index.md)

This page provides practical examples of each artifact type in context1000.

## RFC Example

**File:** `.context1000/decisions/rfc/api-rate-limiting.rfc.md`

```markdown
---
name: api-rate-limiting
title: Implement API Rate Limiting
status: accepted
tags: [api, security, performance]
---

# RFC: Implement API Rate Limiting

## Summary

API users need protection from abuse and fair resource allocation. This RFC proposes implementing rate limiting for all public API endpoints.

## Context and Problem

Currently, our API has no rate limiting, which creates several issues:
- Potential for abuse and DDoS attacks
- Unfair resource usage by single clients
- No way to differentiate free vs. paid tier usage

## Proposed Solution

### Architectural Idea
Implement token bucket algorithm with Redis backend for distributed rate limiting.

### API/Contracts
- Add `X-RateLimit-*` headers to all responses
- Return 429 status code when limit exceeded
- Support different limits per authentication tier

### Data/Schema
```json
{
  "user_id": "string",
  "limit": 1000,
  "window": 3600,
  "remaining": 750
}
```

## Alternatives

1. **Leaky bucket algorithm** - Rejected: More complex to implement
2. **Fixed window counters** - Rejected: Allows burst at window boundaries
3. **In-memory rate limiting** - Rejected: Doesn't work across multiple servers

## Impact

- **Performance**: Minimal overhead (~1ms per request)
- **Compatibility**: Backward compatible, adds headers only
- **Security**: Significantly improves protection against abuse

## Implementation Plan

1. Week 1: Set up Redis infrastructure
2. Week 2: Implement rate limiting middleware
3. Week 3: Add monitoring and alerting
4. Week 4: Gradual rollout with feature flag

**Rollback Plan**: Disable via feature flag if issues arise

## Success Metrics

- Zero successful DDoS attacks
- 95% of legitimate users never hit limits
- < 1ms p99 latency overhead

## Risks and Open Questions

- **Risk**: Redis becoming single point of failure
  - **Mitigation**: Set up Redis Sentinel for high availability
- **Question**: Should we implement different limits per endpoint?
```

## ADR Example

**File:** `.context1000/decisions/adr/redis-rate-limiting.adr.md`

```markdown
---
name: redis-rate-limiting
title: Use Redis for Distributed Rate Limiting
status: accepted
tags: [api, infrastructure, redis]
related:
  depends-on:
    rfcs: [api-rate-limiting]
---

# ADR: Use Redis for Distributed Rate Limiting

## Context

After accepting the API rate limiting RFC, we need to choose a distributed storage backend that can handle high-throughput rate limiting checks across multiple API servers.

## Decision

We will use Redis with the token bucket algorithm for rate limiting because:

1. **Performance**: Redis atomic operations (INCR, EXPIRE) perfectly match token bucket needs
2. **Availability**: Redis Sentinel provides automatic failover
3. **Simplicity**: Well-understood technology already in our stack
4. **Libraries**: Mature rate limiting libraries available (redis-rate-limiter)

Implementation details:
- One Redis key per user/IP combination
- TTL set to rate limit window duration
- Lua scripts for atomic rate limit checks

## Consequences

### Positive
- Consistent rate limiting across all API servers
- Can handle 100k+ requests per second
- Easy to monitor and debug with Redis CLI

### Negative
- Additional infrastructure dependency on Redis
- Need to handle Redis connection failures gracefully
- Slightly increased latency (~0.5-1ms per request)

### Neutral
- Team needs to learn Redis best practices
- Requires additional monitoring setup
```

## Rules Example

**File:** `.context1000/rules/api-rate-limiting.rules.md`

```markdown
---
name: api-rate-limiting-rules
title: API Rate Limiting Rules
tags: [api, security]
related:
  depends-on:
    adrs: [redis-rate-limiting]
---

# API Rate Limiting Rules

## Implementation Requirements

1. All public API endpoints MUST implement rate limiting
2. Rate limits MUST be applied per authentication token or IP address
3. Responses MUST include these headers:
   - `X-RateLimit-Limit`: Maximum requests allowed
   - `X-RateLimit-Remaining`: Requests remaining in window
   - `X-RateLimit-Reset`: Unix timestamp when limit resets

## Rate Limit Tiers

4. Free tier MUST be limited to 1,000 requests per hour
5. Pro tier MUST be limited to 10,000 requests per hour
6. Enterprise tier MUST be limited to 100,000 requests per hour

## Error Handling

7. When rate limit exceeded, API MUST return HTTP 429 status code
8. 429 responses MUST include `Retry-After` header with seconds to wait
9. Rate limiting failures MUST fall open (allow request) rather than closed

## Monitoring

10. Rate limit hits MUST be logged with user identifier
11. Alerts MUST trigger when rate limit hit ratio exceeds 10% for any tier
12. Redis connection failures MUST be monitored and alerted

## Exemptions

13. Health check endpoints MUST NOT be rate limited
14. Internal service-to-service calls MUST NOT be rate limited
```

## Guide Example

**File:** `.context1000/guides/implementing-rate-limiting.guide.md`

```markdown
---
name: implementing-rate-limiting
title: Implementing Rate Limiting in API Endpoints
tags: [api, tutorial]
related:
  depends-on:
    adrs: [redis-rate-limiting]
    rules: [api-rate-limiting-rules]
---

# Implementing Rate Limiting in API Endpoints

This guide shows how to add rate limiting to your API endpoints.

## Prerequisites

- Redis server running (see infrastructure setup guide)
- `redis-rate-limiter` package installed

## Installation

```bash
npm install redis-rate-limiter
```

## Basic Setup

### 1. Configure Redis Connection

```javascript
// config/redis.js
const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

module.exports = client;
```

### 2. Create Rate Limiter Middleware

```javascript
// middleware/rateLimiter.js
const RateLimiter = require('redis-rate-limiter');
const redis = require('../config/redis');

const limiter = RateLimiter.create({
  redis: redis,
  key: (req) => req.user?.id || req.ip,
  window: 3600, // 1 hour in seconds
  limit: (req) => {
    if (req.user?.tier === 'enterprise') return 100000;
    if (req.user?.tier === 'pro') return 10000;
    return 1000; // free tier
  }
});

module.exports = limiter;
```

### 3. Apply to Routes

```javascript
// routes/api.js
const express = require('express');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/users', rateLimiter, (req, res) => {
  // Your endpoint logic
});

module.exports = router;
```

## Advanced Usage

### Custom Rate Limit per Endpoint

```javascript
const customLimit = RateLimiter.create({
  redis: redis,
  key: (req) => `${req.user.id}:expensive-operation`,
  window: 86400, // 24 hours
  limit: 10
});

router.post('/expensive-operation', customLimit, handler);
```

### Handling Rate Limit Errors

```javascript
app.use((err, req, res, next) => {
  if (err.statusCode === 429) {
    res.status(429).json({
      error: 'Too Many Requests',
      retryAfter: err.retryAfter
    });
  } else {
    next(err);
  }
});
```

## Testing

```javascript
// tests/rateLimiter.test.js
const request = require('supertest');
const app = require('../app');

describe('Rate Limiting', () => {
  it('should allow requests within limit', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer token');

    expect(response.status).toBe(200);
    expect(response.headers['x-ratelimit-remaining']).toBeDefined();
  });

  it('should block requests exceeding limit', async () => {
    // Make requests up to limit + 1
    // Assert 429 status code
  });
});
```

## Monitoring

Check rate limit metrics in your monitoring dashboard:

```bash
# Redis CLI - check current usage
redis-cli GET ratelimit:user:123

# View rate limit hit logs
tail -f /var/log/app/rate-limits.log
```

## See Also

- [API Rate Limiting Rules](../rules/api-rate-limiting.rules.md)
- [Redis Rate Limiting ADR](../decisions/adr/redis-rate-limiting.adr.md)
```

## See Also

- [Artifact Types](artifact-types.md)
- [Getting Started](getting-started.md)
- [Cross-References](cross-references.md)

[← Back to Home](../index.md)
