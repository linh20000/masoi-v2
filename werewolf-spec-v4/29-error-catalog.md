# 29 — Error Catalog

> Server phải trả mã lỗi chuẩn. Không dùng text tùy tiện.

## 1. Error codes

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
```

## 2. Response format

```json
{
  "type": "ACTION_RESULT",
  "status": "REJECTED",
  "error": {
    "code": "ABILITY_ALREADY_USED",
    "messageKey": "game.error.ability_already_used",
    "retryable": false
  }
}
```

## 3. Quy tắc

- Không trả message dạng tự do nếu có error code.
- `retryable` chỉ dùng nếu client có thể retry đúng cách.
- Request fail phải có `serverSequence` hiện tại nếu có.
