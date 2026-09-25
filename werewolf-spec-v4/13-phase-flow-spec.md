# 13 — Phase & Resolution Specification

## State machine

`WAITING → STARTING → ROLE_REVEAL → NIGHT → NIGHT_RESOLUTION → DAY → DISCUSSION → VOTING → VOTE_RESOLUTION → WIN_CHECK → GAME_OVER / NIGHT`

## Canonical night resolution

Trước mỗi `NIGHT`, server dựng queue theo `37-role-lifecycle-catalog.md`:
`firstNightOrder` cho Night 1 và `normalNightOrder` từ Night 2. Queue chỉ
chứa action vượt qua activation condition; death/event reactions được đưa
vào event queue riêng.

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
11. Resolve non-death conversions (Blood Moon, Father Wolf if enabled)
12. Confirm primary deaths and emit PLAYER_DEATH_CONFIRMED
13. Propagate Lovers/other death relationships
14. Resolve death triggers (Hunter, Avenger, Wolf Cub)
15. Resolve transformations (Wild Child, Wolf-Dog, Devoted Servant, etc.)
16. Recalculate knowledge and public results
17. Check win conditions
```

`PendingDeath` chỉ là trạng thái chờ. `PLAYER_DEATH_CONFIRMED` là boundary duy nhất kích hoạt death trigger. Blood Moon là exception không gây chết và phải resolve trước death confirmation; các transformation còn lại không hồi sinh player và luôn hoàn tất trước win check.

## Timer and reconnect

Java server là authority; client chỉ render deadline. Reconnect dùng `lastSequence` và contract tại `30-websocket-json-schema.md`.
