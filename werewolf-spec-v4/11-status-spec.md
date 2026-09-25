# 11 — Status Specification

`alive` là lifecycle state của Player, không phải status modifier. `ALIVE` và `DEAD` không còn là status code canonical.

## Canonical status catalog

- `PROTECTED`
- `POISONED`
- `SILENCED` — chặn nói/chat, không tự chặn vote
- `VOTE_DISABLED` — chặn vote
- `ABILITY_DISABLED`
- `WOUNDED`
- `HOMELESS`
- `HYPNOTIZED`
- `CURSED`
- `REVEALED`
- `EXTRA_WOLF_LIFE`
- `CHARMED`
- `BEWITCHED`
- `HUNTER_MARKED`
- `THIEF_LOCKED`
- `TRANSFORMED`

## Contract

```text
statusCode, ownerId, sourceId, scope, duration, stacks,
createdAt, expiresAt, removable, refreshPolicy, blocks, visibility, metadata
```

Mọi status phải có lifecycle `APPLIED → ACTIVE → EXPIRED/REMOVED → CLEARED`. Status modifier bị clear khi player chết, trừ khi variant nói rõ là persistent. `alive`, `role`, `alignment` và `title` được lưu ở Player/RoleState.
