---
title: Examples
description: Real-world examples of context1000 documentation artifacts
---

This guide provides complete, real-world examples of each artifact type following context1000 best practices.

## Complete Example: Caching Strategy

This example shows how all four artifact types work together to document a caching implementation.

### RFC: Caching Strategy

**File**: `.context1000/decisions/rfc/caching-strategy.rfc.md`

```markdown
---
name: caching-strategy
title: Implement Multi-Layer Caching Strategy
status: accepted
tags: [performance, caching, architecture]
---

# Implement Multi-Layer Caching Strategy

## Summary

The backend team needs to reduce database load and improve API response times. We propose implementing a multi-layer caching strategy using Redis and in-memory caches.

## Context and Problem

Current state:
- Database is bottleneck (CPU at 85% during peak hours)
- API p95 latency is 800ms (target: < 200ms)
- Repeated queries for same data (cache hit rate: 0%)
- User profile queries account for 60% of database load

Performance requirements:
- Support 10,000 concurrent users
- API p95 latency < 200ms
- Database CPU < 50%

## Proposed Solution

Implement three-layer caching:

```
Client Request
    ↓
[L1: In-Memory Cache] (< 1ms)
    ↓ miss
[L2: Redis Cache] (< 5ms)
    ↓ miss
[L3: Database] (50-500ms)
```

### Architecture

**L1: In-Memory Cache**
- Node.js Map-based cache
- TTL: 30 seconds
- Size limit: 1000 entries (LRU eviction)
- Per-instance (no sync across instances)

**L2: Redis Cache**
- Shared across all app instances
- TTL: 5 minutes (hot data), 1 hour (cold data)
- Invalidation: On write operations
- Cluster mode for HA

**L3: Database**
- PostgreSQL (existing)
- Query optimization
- Read replicas for read-heavy queries

### Data Categorization

| Data Type | L1 TTL | L2 TTL | Invalidation |
|-----------|--------|--------|--------------|
| User profiles | 30s | 5m | On profile update |
| Session data | 30s | 15m | On logout |
| Static content | 60s | 24h | On content publish |
| Search results | - | 1h | Time-based |

### API Changes

No breaking changes. Caching is transparent to clients.

Add cache headers:
```
X-Cache: HIT/MISS
X-Cache-Layer: L1/L2/L3
```

## Alternatives

### Alternative 1: Redis Only (No L1)

**Pros**:
- Simpler architecture
- Consistent cache state across instances
- No memory pressure on app servers

**Cons**:
- Network latency for every request (~3-5ms)
- Redis becomes single point of contention
- Higher Redis load

**Rejected because**: Even 3-5ms per request is significant at 10K RPS. L1 cache can serve hottest data instantly.

### Alternative 2: Database Query Caching Only

**Pros**:
- No new infrastructure
- PostgreSQL has built-in query cache

**Cons**:
- Cache shared at DB level (less effective)
- Can't cache computed/aggregated data
- Doesn't reduce database connection load

**Rejected because**: Doesn't address connection pool exhaustion.

### Alternative 3: CDN Caching

**Pros**:
- Edge caching for global users
- Handles static content well

**Cons**:
- Doesn't help with dynamic, user-specific data
- Most of our traffic is authenticated API calls

**Decision**: Use CDN for static assets, but not sufficient for API caching.

## Impact

### Performance

Expected improvements:
- API p95 latency: 800ms → 150ms (81% reduction)
- Database CPU: 85% → 40% (53% reduction)
- Cache hit rate: 0% → 85%

Metrics from staging (1000 users):
- L1 hit rate: 45%
- L2 hit rate: 40%
- Database hit rate (miss): 15%

### Compatibility

- **Backward compatible**: No API changes required
- **Eventual consistency**: Cached data may be stale for TTL duration
- **Cache warming**: May see degraded performance on cold start

### Security

- **Redis auth**: Enable AUTH and TLS
- **Sensitive data**: Never cache PII without encryption
- **Cache poisoning**: Validate all cached data before use

### Costs

- Redis Cluster (3 nodes): $200/month
- Increased app server memory: +512MB per instance
- Monitoring tools: $50/month

**Total**: ~$300/month

**ROI**: Current over-provisioned database costs $800/month. Can downsize to $400/month with caching. Net savings: $100/month.

## Implementation Plan

### Phase 1: Redis Setup (Week 1)

1. Provision Redis cluster (3 nodes, HA)
2. Configure AUTH and TLS
3. Set up monitoring (CloudWatch + Grafana)
4. Test failover scenarios

**Milestone**: Redis cluster operational

### Phase 2: L2 Cache Integration (Week 2-3)

1. Implement cache client library
2. Add caching to user profile queries
3. Add caching to session lookups
4. Implement cache invalidation logic
5. Deploy to staging

**Milestone**: L2 cache live in staging

### Phase 3: L1 Cache (Week 4)

1. Implement in-memory LRU cache
2. Add L1 layer to hot paths
3. Load test with 10K concurrent users
4. Tune TTLs based on results

**Milestone**: Full three-layer cache in staging

### Phase 4: Production Rollout (Week 5)

1. Gradual rollout (10% → 50% → 100%)
2. Monitor cache hit rates
3. Adjust TTLs based on production patterns
4. Document runbooks

**Milestone**: Cache live in production

### Rollback Plan

If cache causes issues:
1. Feature flag to disable L1/L2 caching
2. Traffic shifts directly to database
3. System returns to current behavior
4. Database already sized to handle load

## Success Metrics

Measure after 2 weeks in production:

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| API p95 latency | 800ms | < 200ms | DataDog APM |
| Database CPU | 85% | < 50% | CloudWatch |
| Cache hit rate | 0% | > 80% | Redis INFO |
| Error rate | 0.1% | < 0.5% | Error tracking |

## Risks and Open Questions

### Risks

1. **Cache stampede**: Multiple requests for expired key hit database simultaneously
   - **Mitigation**: Implement probabilistic early expiration

2. **Inconsistent data**: User sees stale cached data
   - **Mitigation**: Aggressive cache invalidation on writes

3. **Redis failure**: Cache cluster goes down
   - **Mitigation**: Automatic fallback to database (degraded performance, not failure)

### Open Questions

1. **Q**: Should we cache search results?
   - **A**: Start with no, add later if search becomes bottleneck

2. **Q**: How to handle cache warming on deployment?
   - **A**: Implement pre-warming script that queries common data before traffic shifts

3. **Q**: What to do about cache invalidation across microservices?
   - **A**: Phase 2 work - implement pub/sub invalidation events
```

### ADR: Use Redis for Caching

**File**: `.context1000/decisions/adr/use-redis-caching.adr.md`

```markdown
---
name: use-redis-caching
title: Use Redis for L2 Caching Layer
status: accepted
tags: [caching, redis, performance]
related:
  rfcs: [caching-strategy]
  rules: [caching-rules]
  guides: [redis-setup, cache-implementation]
  depends-on:
    rfcs: [caching-strategy]
---

# Use Redis for L2 Caching Layer

## Context

The caching strategy RFC was accepted. We need to choose a technology for the L2 (shared) cache layer. Requirements:

- Sub-5ms latency for cache hits
- Shared state across multiple app instances
- TTL support for automatic expiration
- High availability (99.9% uptime)
- Support for 100K operations/second
- Atomic operations for cache stampede prevention

Options evaluated: Redis, Memcached, Hazelcast

## Decision

We will use **Redis** (7.x) in cluster mode for the L2 caching layer.

**Specific choices**:
- **Deployment**: AWS ElastiCache for Redis (managed)
- **Configuration**: Cluster mode with 3 shards, 2 replicas each
- **Client**: ioredis (Node.js)
- **Serialization**: MessagePack for binary efficiency
- **Key prefix**: `cache:{service}:{type}:{id}`

### Configuration

```javascript
const Redis = require('ioredis');

const cluster = new Redis.Cluster([
  { host: 'redis-1.example.com', port: 6379 },
  { host: 'redis-2.example.com', port: 6379 },
  { host: 'redis-3.example.com', port: 6379 },
], {
  redisOptions: {
    password: process.env.REDIS_PASSWORD,
    tls: {},
  },
  scaleReads: 'slave',  // Read from replicas
});
```

### Rationale

**Why Redis over Memcached**:
- Redis supports complex data types (lists, sets, sorted sets)
- Built-in cluster mode with automatic sharding
- Persistence options (optional AOF/RDB)
- Pub/sub for cache invalidation events
- Lua scripting for atomic operations

**Why Redis over Hazelcast**:
- More mature ecosystem
- Better operational tooling
- Lower memory overhead
- Team already familiar with Redis

**Why AWS ElastiCache**:
- Managed service (automatic patching, backups)
- Multi-AZ replication
- CloudWatch integration
- Lower operational burden

## Consequences

### What becomes easier

**Performance**:
- Sub-5ms cache hits (tested: p95 = 2.3ms)
- 100K ops/sec capacity (tested up to 250K)
- Automatic sharding distributes load

**Reliability**:
- Multi-AZ replication = 99.95% uptime SLA
- Automatic failover (< 30 second recovery)
- Read replicas reduce primary load

**Development**:
- Rich client libraries (ioredis, node-redis)
- Strong typing with TypeScript
- Easy local development (Redis in Docker)
- Excellent debugging tools (Redis CLI, RedisInsight)

**Operations**:
- Managed by AWS (patching, backups)
- CloudWatch metrics and alarms
- Automated backups (daily snapshots)
- Easy to scale (add shards)

### What becomes harder

**Costs**:
- $200/month for cluster (vs $0 for in-memory only)
- Data transfer costs for cross-AZ reads
- Must monitor and optimize costs

**Complexity**:
- Additional component to monitor
- Cache invalidation logic required
- Potential for cache inconsistency
- Need runbooks for Redis issues

**Operational burden**:
- Monitor cache hit rates
- Handle cache stampede scenarios
- Manage key eviction policies
- Debug cache-related issues

**Limitations**:
- Network latency (vs in-process cache)
- Potential single point of failure (mitigated by cluster)
- Eventual consistency (cache may be stale)

**Data consistency**:
- Cached data may be stale for up to TTL duration
- Need cache invalidation on all writes
- Potential race conditions (mitigated by Lua scripts)

### Migration path

Rolling update:
1. Deploy code with cache disabled (feature flag off)
2. Verify no regressions
3. Enable cache for 10% of traffic
4. Monitor cache hit rates and errors
5. Gradually increase to 100%

Rollback:
- Feature flag to disable cache
- No data migration needed (cache can be empty)
- System continues to work without cache (degraded performance)
```

### Rules: Caching Rules

**File**: `.context1000/rules/caching-rules.rules.md`

```markdown
---
name: caching-rules
title: Caching Implementation Rules
tags: [caching, redis, performance]
related:
  depends-on:
    adrs: [use-redis-caching]
    rfcs: [caching-strategy]
  guides: [cache-implementation]
---

# Caching Implementation Rules

## Key Naming

1. ALL cache keys MUST follow the format: `cache:{service}:{type}:{id}`
2. Use lowercase for all key segments
3. NEVER include user input directly in keys without sanitization
4. Keys MUST be under 250 characters
5. Use colon (`:`) as the only separator

**Example**: `cache:api:user:12345`

## TTL Configuration

1. All cached items MUST have a TTL (never infinite)
2. Hot data (user profiles, sessions): TTL = 5 minutes
3. Cold data (static content): TTL = 1 hour
4. Computed data (aggregations): TTL = 15 minutes
5. Use probabilistic early expiration to prevent cache stampede

## Data Storage

1. Use MessagePack for serialization (smaller than JSON)
2. NEVER cache sensitive data (PII, passwords, tokens) without encryption
3. NEVER cache data larger than 100KB per key
4. Store cache metadata: `{data, cachedAt, version}`
5. Validate cached data before use (check version)

## Cache Invalidation

1. ALWAYS invalidate cache on write operations
2. Use cache tags for related key invalidation
3. Publish invalidation events to Redis pub/sub
4. NEVER delete cache keys synchronously from request path (async only)
5. Log all cache invalidations for debugging

## Error Handling

1. Cache failures MUST NOT cause request failures
2. On cache error, fall back to database (log warning)
3. Implement circuit breaker (5 failures = disable cache for 30s)
4. NEVER retry cache operations synchronously
5. Monitor cache error rate (alert if > 1%)

## Performance

1. Batch cache operations when possible (MGET, MSET)
2. Use pipelining for multiple sequential operations
3. Read from replicas when consistency isn't critical
4. NEVER block on cache writes (fire and forget)
5. Cache operations MUST complete in < 10ms (p95)

## L1 (In-Memory) Cache

1. Use LRU eviction policy
2. Maximum 1000 entries per process
3. TTL MUST be shorter than L2 (30 seconds max)
4. NEVER cache user-specific data in L1 in multi-tenant processes
5. Clear L1 cache on deployment

## Monitoring

1. Track cache hit rate (target > 80%)
2. Monitor p95 latency per cache operation
3. Alert on cache cluster CPU > 70%
4. Log cache misses for performance analysis
5. Measure cache memory usage (alert at 80%)

## Testing

1. All cache logic MUST have unit tests
2. Test cache miss scenarios explicitly
3. Test cache stampede prevention
4. Load test with cache disabled (verify fallback works)
5. Test cache invalidation logic
```

### Guide: Cache Implementation Guide

**File**: `.context1000/guides/cache-implementation.guide.md`

```markdown
---
name: cache-implementation
title: Cache Implementation Guide
tags: [caching, redis, implementation, tutorial]
related:
  adrs: [use-redis-caching]
  rfcs: [caching-strategy]
  rules: [caching-rules]
  depends-on:
    adrs: [use-redis-caching]
    rules: [caching-rules]
---

# Cache Implementation Guide

This guide shows how to implement caching following the [caching ADR](/decisions/adr/use-redis-caching) and [caching rules](/rules/caching-rules).

## Prerequisites

- Redis cluster running (see [Redis Setup Guide](/guides/redis-setup))
- ioredis installed: `npm install ioredis msgpack-lite`

## Cache Client Setup

Create `src/lib/cache.ts`:

```typescript
import Redis from 'ioredis';
import msgpack from 'msgpack-lite';

// Rule #1: Key naming format
export function buildCacheKey(
  service: string,
  type: string,
  id: string
): string {
  // Rule #3: Sanitize inputs
  const sanitize = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9-]/g, '');

  return `cache:${sanitize(service)}:${sanitize(type)}:${sanitize(id)}`;
}

// Rule #4: Metadata structure
interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  version: string;
}

const CACHE_VERSION = 'v1';

export class CacheClient {
  private redis: Redis.Cluster;
  private l1Cache: Map<string, { data: any; expiresAt: number }>;
  private readonly L1_MAX_SIZE = 1000; // Rule #1 (L1 section)
  private readonly L1_TTL_MS = 30 * 1000; // Rule #3 (L1 section)

  constructor() {
    this.redis = new Redis.Cluster([
      { host: process.env.REDIS_HOST_1!, port: 6379 },
      { host: process.env.REDIS_HOST_2!, port: 6379 },
      { host: process.env.REDIS_HOST_3!, port: 6379 },
    ], {
      redisOptions: {
        password: process.env.REDIS_PASSWORD,
        tls: {},
      },
      scaleReads: 'slave', // Rule #3 (Performance)
    });

    this.l1Cache = new Map();

    // Rule #5 (L1): Clear on deployment
    this.clearL1();
  }

  // Get with L1 + L2
  async get<T>(key: string): Promise<T | null> {
    // Check L1 first
    const l1 = this.l1Cache.get(key);
    if (l1 && l1.expiresAt > Date.now()) {
      return l1.data;
    }

    // Check L2 (Redis)
    try {
      const data = await this.redis.getBuffer(key);
      if (!data) return null;

      const entry: CacheEntry<T> = msgpack.decode(data);

      // Rule #5 (Data Storage): Validate cached data
      if (entry.version !== CACHE_VERSION) {
        await this.redis.del(key);
        return null;
      }

      // Populate L1
      this.setL1(key, entry.data);

      return entry.data;
    } catch (error) {
      // Rule #1 (Error Handling): Cache failures don't cause request failures
      console.warn('Cache get failed', { key, error });
      return null;
    }
  }

  // Set with L1 + L2
  async set<T>(
    key: string,
    value: T,
    ttlSeconds: number
  ): Promise<void> {
    const entry: CacheEntry<T> = {
      data: value,
      cachedAt: Date.now(),
      version: CACHE_VERSION,
    };

    // Rule #1 (Data Storage): Use MessagePack
    const packed = msgpack.encode(entry);

    // Rule #3 (Data Storage): Check size
    if (packed.length > 100 * 1024) {
      console.warn('Cache entry too large', { key, size: packed.length });
      return;
    }

    // Rule #4 (Performance): Don't block on writes
    this.redis
      .setex(key, ttlSeconds, packed)
      .catch((error) => {
        console.warn('Cache set failed', { key, error });
      });

    // Update L1
    this.setL1(key, value);
  }

  // Batch get (Rule #1: Performance)
  async mget<T>(keys: string[]): Promise<Map<string, T>> {
    const result = new Map<string, T>();

    // Check L1 first
    const l2Keys: string[] = [];
    for (const key of keys) {
      const l1 = this.l1Cache.get(key);
      if (l1 && l1.expiresAt > Date.now()) {
        result.set(key, l1.data);
      } else {
        l2Keys.push(key);
      }
    }

    if (l2Keys.length === 0) return result;

    // Batch fetch from L2
    try {
      const buffers = await this.redis.mgetBuffer(...l2Keys);

      for (let i = 0; i < l2Keys.length; i++) {
        const buffer = buffers[i];
        if (!buffer) continue;

        const entry: CacheEntry<T> = msgpack.decode(buffer);
        if (entry.version === CACHE_VERSION) {
          result.set(l2Keys[i], entry.data);
          this.setL1(l2Keys[i], entry.data);
        }
      }
    } catch (error) {
      console.warn('Cache mget failed', { keys: l2Keys, error });
    }

    return result;
  }

  // Invalidate (Rule #1: Cache Invalidation)
  async invalidate(key: string): Promise<void> {
    // Remove from L1
    this.l1Cache.delete(key);

    // Rule #4: Async delete
    this.redis.del(key).catch((error) => {
      console.warn('Cache invalidate failed', { key, error });
    });

    // Rule #3: Publish invalidation event
    this.redis
      .publish('cache:invalidate', key)
      .catch((error) => {
        console.warn('Cache publish failed', { key, error });
      });

    // Rule #5: Log invalidation
    console.info('Cache invalidated', { key });
  }

  // L1 Cache management
  private setL1(key: string, data: any): void {
    // Rule #2 (L1): LRU eviction
    if (this.l1Cache.size >= this.L1_MAX_SIZE) {
      const firstKey = this.l1Cache.keys().next().value;
      this.l1Cache.delete(firstKey);
    }

    this.l1Cache.set(key, {
      data,
      expiresAt: Date.now() + this.L1_TTL_MS,
    });
  }

  private clearL1(): void {
    this.l1Cache.clear();
  }
}

export const cache = new CacheClient();
```

## Usage Examples

### Example 1: Cache User Profile

Following [Rule #2 (TTL): Hot data = 5 minutes](/rules/caching-rules#ttl-configuration):

```typescript
import { cache, buildCacheKey } from './lib/cache';
import { db } from './lib/db';

export async function getUserProfile(userId: string) {
  const key = buildCacheKey('api', 'user', userId);

  // Try cache first
  let user = await cache.get(key);

  if (!user) {
    // Cache miss - fetch from database
    user = await db.user.findUnique({ where: { id: userId } });

    if (user) {
      // Rule #2: Hot data TTL = 5 minutes
      await cache.set(key, user, 5 * 60);
    }
  }

  return user;
}

export async function updateUserProfile(userId: string, data: any) {
  // Update database
  const user = await db.user.update({
    where: { id: userId },
    data,
  });

  // Rule #1 (Invalidation): Invalidate on write
  const key = buildCacheKey('api', 'user', userId);
  await cache.invalidate(key);

  return user;
}
```

### Example 2: Batch Cache User Posts

Following [Rule #1 (Performance): Batch operations](/rules/caching-rules#performance):

```typescript
export async function getUserPosts(userIds: string[]) {
  // Build cache keys
  const keys = userIds.map((id) => buildCacheKey('api', 'user-posts', id));

  // Batch fetch from cache
  const cached = await cache.mget<Post[]>(keys);

  // Find missing users
  const missingIds = userIds.filter((id) => {
    const key = buildCacheKey('api', 'user-posts', id);
    return !cached.has(key);
  });

  if (missingIds.length > 0) {
    // Fetch missing from database
    const posts = await db.post.findMany({
      where: { userId: { in: missingIds } },
    });

    // Group by user
    const byUser = new Map<string, Post[]>();
    posts.forEach((post) => {
      if (!byUser.has(post.userId)) byUser.set(post.userId, []);
      byUser.get(post.userId)!.push(post);
    });

    // Cache missing (Rule #3: Computed data = 15 minutes)
    for (const [userId, userPosts] of byUser) {
      const key = buildCacheKey('api', 'user-posts', userId);
      await cache.set(key, userPosts, 15 * 60);
      cached.set(key, userPosts);
    }
  }

  // Combine results
  return userIds.map((id) => {
    const key = buildCacheKey('api', 'user-posts', id);
    return cached.get(key) || [];
  });
}
```

### Example 3: Cache Stampede Prevention

Following [Rule #5 (TTL): Probabilistic early expiration](/rules/caching-rules#ttl-configuration):

```typescript
import crypto from 'crypto';

export async function getWithStampedeProtection<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  const cached = await cache.get<{
    data: T;
    cachedAt: number;
    ttl: number;
  }>(key);

  if (cached) {
    const age = Date.now() - cached.cachedAt;
    const ageSeconds = age / 1000;

    // Probabilistic early expiration
    // XFetch = δ * β * ln(rand(0,1))
    // δ = time since cached, β = 1 (constant), rand = random 0-1
    const delta = ageSeconds;
    const xfetch = delta * Math.abs(Math.log(Math.random()));

    // If XFetch < TTL remaining, use cache
    if (xfetch < ttlSeconds - ageSeconds) {
      return cached.data;
    }
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Cache with metadata
  await cache.set(
    key,
    {
      data,
      cachedAt: Date.now(),
      ttl: ttlSeconds,
    },
    ttlSeconds
  );

  return data;
}

// Usage
const user = await getWithStampedeProtection(
  buildCacheKey('api', 'user', userId),
  5 * 60,
  () => db.user.findUnique({ where: { id: userId } })
);
```

## Testing

Following [Rule #1-5 (Testing)](/rules/caching-rules#testing):

```typescript
describe('Cache', () => {
  // Rule #1: Test cache logic
  it('caches user profiles', async () => {
    const userId = 'test-123';
    const user = { id: userId, name: 'Test User' };

    // First call - cache miss
    jest.spyOn(db.user, 'findUnique').mockResolvedValue(user);
    const result1 = await getUserProfile(userId);
    expect(result1).toEqual(user);
    expect(db.user.findUnique).toHaveBeenCalledTimes(1);

    // Second call - cache hit
    const result2 = await getUserProfile(userId);
    expect(result2).toEqual(user);
    expect(db.user.findUnique).toHaveBeenCalledTimes(1); // Not called again
  });

  // Rule #2: Test cache miss scenarios
  it('handles cache miss correctly', async () => {
    const userId = 'test-456';

    // Cache miss should fetch from DB
    jest.spyOn(db.user, 'findUnique').mockResolvedValue(null);
    const result = await getUserProfile(userId);
    expect(result).toBeNull();
  });

  // Rule #3: Test cache stampede prevention
  it('prevents cache stampede', async () => {
    const key = buildCacheKey('api', 'expensive', '1');
    let callCount = 0;

    const fetchFn = async () => {
      callCount++;
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { result: 'data' };
    };

    // Parallel requests
    const results = await Promise.all([
      getWithStampedeProtection(key, 60, fetchFn),
      getWithStampedeProtection(key, 60, fetchFn),
      getWithStampedeProtection(key, 60, fetchFn),
    ]);

    // Should only call fetchFn once
    expect(callCount).toBe(1);
    expect(results).toHaveLength(3);
  });

  // Rule #4: Test fallback
  it('falls back to DB on cache error', async () => {
    const userId = 'test-789';
    const user = { id: userId, name: 'Test' };

    // Simulate Redis failure
    jest.spyOn(cache, 'get').mockRejectedValue(new Error('Redis down'));
    jest.spyOn(db.user, 'findUnique').mockResolvedValue(user);

    const result = await getUserProfile(userId);
    expect(result).toEqual(user);
  });

  // Rule #5: Test invalidation
  it('invalidates cache on update', async () => {
    const userId = 'test-101';
    const user = { id: userId, name: 'Original' };
    const updated = { id: userId, name: 'Updated' };

    // Cache original
    jest.spyOn(db.user, 'findUnique').mockResolvedValue(user);
    await getUserProfile(userId);

    // Update (should invalidate)
    jest.spyOn(db.user, 'update').mockResolvedValue(updated);
    await updateUserProfile(userId, { name: 'Updated' });

    // Next fetch should get fresh data
    jest.spyOn(db.user, 'findUnique').mockResolvedValue(updated);
    const result = await getUserProfile(userId);
    expect(result).toEqual(updated);
  });
});
```

## Monitoring

Following [Rule #1-5 (Monitoring)](/rules/caching-rules#monitoring):

```typescript
import { metrics } from './lib/metrics';

export class MonitoredCacheClient extends CacheClient {
  async get<T>(key: string): Promise<T | null> {
    const start = Date.now();
    const result = await super.get<T>(key);
    const duration = Date.now() - start;

    // Rule #1: Track cache hit rate
    metrics.increment('cache.get', {
      hit: result !== null,
      layer: 'l2',
    });

    // Rule #2: Monitor latency
    metrics.timing('cache.latency', duration, { operation: 'get' });

    // Rule #4: Log cache misses
    if (result === null) {
      console.debug('Cache miss', { key });
    }

    return result;
  }
}
```

## Troubleshooting

### High Cache Miss Rate

**Symptoms**: Hit rate < 80%

**Causes**:
1. TTL too short
2. Keys not normalized (mismatches)
3. Cache eviction happening

**Solutions**:
1. Increase TTL for hot data
2. Check key building logic
3. Monitor memory usage, increase cache size

### Cache Stampede

**Symptoms**: Multiple simultaneous DB queries for same key

**Solutions**:
1. Implement probabilistic early expiration (see Example 3)
2. Use request coalescing
3. Increase TTL slightly

### Redis Connection Issues

**Symptoms**: `ECONNREFUSED` or timeout errors

**Solutions**:
1. Check Redis cluster health
2. Verify network connectivity
3. Check connection pool settings
4. Enable circuit breaker

## Summary

This guide covered:
- Setting up the cache client with L1 + L2 layers
- Implementing cache operations following all rules
- Batch operations for performance
- Cache stampede prevention
- Testing strategies
- Monitoring and troubleshooting

All implementations follow the [caching ADR](/decisions/adr/use-redis-caching) and [caching rules](/rules/caching-rules).
```

## Summary

This complete example demonstrates:

1. **RFC**: Proposes solution with alternatives and analysis
2. **ADR**: Documents the decision with technical details
3. **Rules**: Derives specific requirements and constraints
4. **Guide**: Provides implementation examples and code

Each artifact references the others through front matter, creating a traceable chain from proposal to implementation. This is the recommended pattern for all context1000 documentation.
