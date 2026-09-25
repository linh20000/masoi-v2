# 23 — Scenario Schema

> Mỗi ván phải được khởi tạo từ một scenario schema rõ ràng. Không được để game runtime suy đoán variant hoặc cấu hình từ UI.

## 1. Yêu cầu bắt buộc

```yaml
scenarioCode: classic-v4
version: 4.1
name: Classic Werewolf V4
playerCount: 10
roleDeck:
  werewolf: 2
  seer: 1
  bodyguard: 1
  witch: 1
  villager: 2
  cupid: 1
  hunter: 1
  wolf-cub: 1
excludedRoles: []
variants:
  wolfDog: VILLAGE_LOCKED
  bloodMoon: DISABLED
  voteTiePolicy: SCAPEGOAT_IF_PRESENT_ELSE_NO_EXECUTION
  wolfVotePolicy: MAJORITY_TIE_NO_ATTACK
  revealRoleOnDeath: true
  allowDualUseWitch: true
  allowTitleTransfer: true
firstNightOrder:
  - thief.setup
  - cupid.choose_lovers
  - lovers.reveal
  - wild-child.choose_idol
  - two-sisters.reveal
  - three-brothers.reveal
  - actor.setup
  - seer.inspect_player
  - fox.inspect_group
  - bodyguard.protect_player
  - werewolf.select_victim
  - little-girl.observe_wolves
  - witch.heal_target
  - witch.poison_target
normalNightOrder:
  - actor.use_role
  - seer.inspect_player
  - fox.inspect_group
  - bodyguard.protect_player
  - werewolf.select_victim
  - little-girl.observe_wolves
  - witch.heal_target
  - witch.poison_target
phaseSettings:
  discussionMinutes: 180
  votingMinutes: 120
  nightMinutes: 90
startPolicy:
  minimumPlayers: 10
  requireAllReady: true
timeoutPolicy:
  night: PASS
  discussion: AUTO_ADVANCE
  voting: ABSTAIN
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
- firstNightOrder
- normalNightOrder
- startPolicy
- timeoutPolicy

## 3. Luật bắt đầu

- Không cho bắt đầu nếu `playerCount` không phù hợp preset.
- `roleDeck` là canonical input; role counts phải cộng đúng `playerCount`.
- `requiredRoles` chỉ là legacy shorthand và phải được normalize thành `roleDeck` trước validation.
- Mỗi action trong `firstNightOrder`/`normalNightOrder` phải tồn tại trong
  `37-role-lifecycle-catalog.md` hoặc action registry; role/action không đủ
  điều kiện sẽ bị scheduler loại khỏi queue.
- `playerCount` không được thay đổi trong ván.
- Nếu role trong `roleDeck` không tồn tại, reject setup.
- Nếu `winPriority` chứa code ngoài canonical catalog, reject setup.

## 4. Mục tiêu

Mục tiêu của schema là làm cho mỗi game có thể replay, audit và test được theo version rõ ràng.
