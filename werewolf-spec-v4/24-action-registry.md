# 24 — Action Registry

> Action registry là bộ danh sách action có thể được gọi trong game. Mỗi action phải có định nghĩa rõ ràng để client, server và test cùng dùng.

## 1. Cấu trúc chung

```yaml
actionCode: werewolf.select_victim
name: Chọn mục tiêu cắn
actorRoles: [werewolf]
phase: NIGHT
targetType: PLAYER
targetCount: 1
allowSelf: false
allowDead: false
usagePolicy: ONCE_PER_NIGHT
validation:
  - actor_alive
  - actor_has_ability
  - phase_is_night
  - target_is_alive
  - target_not_self
priority: 5000
resultEffects:
  - schedule_pending_death
publicEvent: PLAYER_DEATH_PENDING
privateEvent: null
allowedVariants: [CLASSIC, PACK_2]
```

## 2. Bắt buộc cho action

- code
- actorRoles
- phase
- targetType
- targetCount
- usagePolicy
- validation checks
- priority
- effect list
- event contract

## 3. Các action core cần có

```text
werewolf.select_victim
seer.inspect_player
bodyguard.protect_player
witch.heal_target
witch.poison_target
hunter.mark_target
hunter.shoot
cupid.link_lovers
ravens.curse_target
moon_maiden.disable_ability
vote.execution
```

## 4. Validation mặc định

- actor alive
- actor has ability
- correct phase
- target exists
- target allowed
- target not dead unless targetState=DEAD
- no duplicate targets
- no invalid role/relationship check
- action not expired

## 5. Error mapping

Action invalid phải trả mã lỗi rõ ràng, ví dụ:

- PLAYER_DEAD
- WRONG_PHASE
- ABILITY_DISABLED
- TARGET_INVALID
- ACTION_EXPIRED
- DUPLICATE_REQUEST
