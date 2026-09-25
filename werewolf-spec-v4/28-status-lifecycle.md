# 28 — Status Lifecycle

> Status như `SILENCED`, `DISABLED`, `WOUNDED`, `PROTECTED`, `THIEF_LOCKED` phải có vòng đời rõ ràng.

## 1. Cấu trúc status

```json
{
  "statusCode": "SILENCED",
  "ownerId": "player-02",
  "sourceId": "player-04",
  "effectCode": "sedative",
  "expiresAtPhase": "DAY_END",
  "stacks": 1,
  "removable": true,
  "canStack": false,
  "blocks": ["SPEAK", "CHAT"],
  "visibility": "PUBLIC"
}
```

## 2. Thuộc tính bắt buộc

- statusCode
- ownerId
- sourceId
- appliedAt
- duration or expiresAt
- stack policy
- removable
- blocks
- visibility

## 3. Lifecycle

```text
APPLIED
→ ACTIVE
→ EXPIRED
→ REMOVED
→ CLEARED
```

## 4. Các status cần có trong game

- SILENCED
- VOTE_DISABLED
- ABILITY_DISABLED
- PROTECTED
- WOUNDED
- POISONED
- CHARMED
- BEWITCHED
- HUNTER_MARKED
- THIEF_LOCKED
- TRANSFORMED

## 5. Rule chung

- Một status không được tự xóa nếu không có lifecycle.
- Nếu status cũ và mới cùng code ở cùng owner và cùng effect, giải quyết theo `refreshPolicy`.
- Status hủy hoạt động khi player chết, trừ khi rõ ràng là status vĩnh viễn theo variant.
