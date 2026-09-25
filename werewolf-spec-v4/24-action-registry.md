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
- activation lifecycle/type
- turnOrder và scenario slot
- timeoutPolicy
- activationCondition
- private/public result audience

## 3. Canonical action registry

Danh sách dưới đây là canonical code tối thiểu. Mỗi dòng phải được materialize thành một `ActionDefinition` đầy đủ theo schema ở mục 1; không được coi danh sách này là mô tả thay thế cho definition.

```text
werewolf.select_victim
seer.inspect_player
bodyguard.protect_player
witch.heal_target
witch.poison_target
hunter.mark_target
hunter.shoot
cupid.link_lovers
raven.curse_target
moon-maiden.disable_ability
vote.execution
white-werewolf.kill
werewolf.extra_kill
father-of-werewolves.convert_victim
wild-child.choose_idol
wolf-dog.choose_alignment
fox.inspect_group
pied-piper.bewitch_player
arsonist.burn_house
pharmacist.use_sedative
pharmacist.use_restorative
rusty-sword-knight.check_wolf
assassin.kill
avenger.choose_target
title.transfer
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
- INVALID_TARGET
- ACTION_EXPIRED
- DUPLICATE_REQUEST
