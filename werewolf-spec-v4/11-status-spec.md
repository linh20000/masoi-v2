# 11 — Status Specification

## Status catalog
- ALIVE
- DEAD
- PROTECTED
- POISONED
- SILENCED
- VOTE_DISABLED
- ABILITY_DISABLED
- WOUNDED
- HOMELESS
- HYPNOTIZED
- CURSED
- REVEALED
- EXTRA_WOLF_LIFE

## Contract
`statusCode, ownerId, sourceId, scope, duration, stacks, createdAt, expiresAt, metadata`

Status là runtime fact; Rule/Resolver dùng status để quyết định outcome.
