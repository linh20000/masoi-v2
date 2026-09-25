# 29 — Error Catalog

Server trả error code ổn định, không dùng text tự do làm logic.

## Error codes

```text
GAME_NOT_FOUND
GAME_NOT_STARTED
PLAYER_NOT_IN_GAME
PLAYER_DEAD
WRONG_PHASE
WRONG_TURN
ACTION_EXPIRED
ABILITY_DISABLED
ABILITY_ALREADY_USED
INVALID_TARGET
TARGET_DEAD
TARGET_NOT_ALLOWED
SELF_TARGET_NOT_ALLOWED
INVALID_ROLE
DUPLICATE_REQUEST
MISSING_REQUIREMENT
SEQUENCE_TOO_OLD
RECONNECT_NOT_AUTHORIZED
VARIANT_NOT_FOUND
VARIANT_NOT_ENABLED
WIN_ALREADY_DECLARED
SCENARIO_INVALID
REQUEST_RATE_LIMITED
EVENT_VARIANT_REQUIRED
EVENT_ALREADY_CONSUMED
BLOOD_MOON_TARGET_INVALID
BLOOD_MOON_CONFLICTING_VARIANT
DEATH_CYCLE_DETECTED
```

`TARGET_INVALID` là legacy alias, không dùng trong response mới; mapping phải trả `INVALID_TARGET`.

`SEQUENCE_TOO_OLD` chỉ dùng cho API replay bắt buộc lịch sử; reconnect thông thường fallback bằng `SNAPSHOT`.

## Response

```json
{
  "type": "ACTION_RESULT",
  "status": "REJECTED",
  "gameId": "game-001",
  "clientRequestId": "uuid",
  "serverSequence": 42,
  "error": {
    "code": "INVALID_TARGET",
    "messageKey": "game.error.invalid_target",
    "retryable": false
  }
}
```
