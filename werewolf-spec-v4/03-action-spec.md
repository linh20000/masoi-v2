# 03 — Action Specification

## 1. Definition
Action là command hợp lệ mà player gửi server.

## 2. Contract
```json
{
  "actionCode": "INSPECT_PLAYER",
  "actorId": "player-01",
  "targets": ["player-05"],
  "payload": {},
  "clientRequestId": "uuid"
}
```

Server pipeline:
`Command → Actor/Phase Validation → Target Validation → Rule Evaluation → Resolution → Events`

## 3. Canonical action catalog
- INSPECT_PLAYER
- PROTECT_PLAYER
- HEAL_WOLF_VICTIM
- POISON_PLAYER
- HUNTER_MARK_TARGET
- HUNTER_SHOOT
- WOLF_SELECT_VICTIM
- WHITE_WOLF_KILL
- EXTRA_WOLF_KILL
- CONVERT_WOLF_VICTIM
- LINK_LOVERS
- CHOOSE_EXTRA_ROLE
- CHOOSE_IDOL
- CHOOSE_ALIGNMENT
- PEEK_WOLVES
- FOX_INSPECT_GROUP
- APPLY_RAVEN_CURSE
- BEWITCH_PLAYER
- BURN_HOUSE
- USE_SEDATIVE
- USE_RESTORATIVE
- KNIGHT_CHECK_WOLF
- FORCE_WOLF_TARGET
- ASK_DEAD_PLAYER
- DISABLE_NIGHT_ABILITY
- ASSASSIN_KILL
- AVENGE_TARGET
- VOTE_EXECUTION
- TRANSFER_TITLE

Generic UI actions such as `CHOOSE_TARGET` are not domain actions; they are UI selection primitives.

## 4. Action vs Effect
Action = intent của player.
Effect = mutation sau resolution.
