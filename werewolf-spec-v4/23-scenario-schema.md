# 23 — Scenario Schema

> Mỗi ván phải được khởi tạo từ một scenario schema rõ ràng. Không được để game runtime suy đoán variant hoặc cấu hình từ UI.

## 1. Yêu cầu bắt buộc

```yaml
scenarioCode: classic-v4
version: 4.1
name: Classic Werewolf V4
playerCount: 10
requiredRoles:
  - werewolf
  - werewolf
  - seer
  - bodyguard
  - witch
  - villager
  - villager
  - cupid
  - hunter
  - wolf-cub
excludedRoles: []
variants:
  wolfDog: VILLAGE_LOCKED
  bloodMoon: DISABLED
  voteTiePolicy: SCAPEGOAT_IF_PRESENT_ELSE_NO_EXECUTION
  wolfVotePolicy: MAJORITY_TIE_NO_ATTACK
  revealRoleOnDeath: true
  allowDualUseWitch: true
  allowTitleTransfer: true
nightOrder:
  - werewolf
  - seer
  - bodyguard
  - witch
  - cupid
  - wolf-cub
  - hunter
phaseSettings:
  discussionMinutes: 180
  votingMinutes: 120
  nightMinutes: 90
winPriority:
  - ANGEL
  - LOVERS
  - PIPER
  - SECT
  - WHITE_WOLF
  - WEREWOLF
  - VILLAGE
```

## 2. Bắt buộc phải có các field sau

- scenarioCode
- version
- playerCount
- roleDeck
- excludedRoles
- variants
- winPriority
- phaseSettings
- nightOrder
- startPolicy
- timeoutPolicy

## 3. Luật bắt đầu

- Không cho bắt đầu nếu `playerCount` không phù hợp preset.
- Nếu `requiredRoles` thiếu, dùng `roleDeck` được build từ `catalog`.
- `playerCount` không được thay đổi trong ván.
- Nếu role trong `requiredRoles` không tồn tại, reject setup.

## 4. Mục tiêu

Mục tiêu của schema là làm cho mỗi game có thể replay, audit và test được theo version rõ ràng.
