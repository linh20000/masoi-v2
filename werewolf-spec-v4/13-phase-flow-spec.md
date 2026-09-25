# 13 — Phase & Resolution Specification

## State machine

`WAITING → STARTING → ROLE_REVEAL → NIGHT → NIGHT_RESOLUTION → DAY → DISCUSSION → VOTING → VOTE_RESOLUTION → WIN_CHECK → GAME_OVER / NIGHT`

## Canonical night resolution

Pipeline này thay thế mọi thứ tự ngắn hoặc mơ hồ trong tài liệu cũ:

```text
1. Freeze actions
2. Validate actions
3. Resolve pre-action disables/statuses
4. Resolve wolf vote and primary attack
5. Resolve special attacks and extra bite
6. Resolve protection
7. Resolve healing/restoration
8. Resolve poison, curse, burn and direct damage
9. Resolve survival rules
10. Create/update PendingDeath records
11. Confirm primary deaths and emit PLAYER_DEATH_CONFIRMED
12. Propagate Lovers/other death relationships
13. Resolve death triggers (Hunter, Avenger, Wolf Cub)
14. Resolve transformations (Wild Child, Wolf-Dog, Blood Moon, etc.)
15. Recalculate knowledge and public results
16. Check win conditions
```

`PendingDeath` chỉ là trạng thái chờ. `PLAYER_DEATH_CONFIRMED` là boundary duy nhất kích hoạt death trigger. Transformation không hồi sinh player và luôn hoàn tất trước win check.

## Timer and reconnect

Java server là authority; client chỉ render deadline. Reconnect dùng `lastSequence` và contract tại `30-websocket-json-schema.md`.
