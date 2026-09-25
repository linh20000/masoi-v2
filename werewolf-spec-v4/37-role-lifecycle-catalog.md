# 37 — Role Lifecycle, Activation & Call Order

> Đây là contract canonical cho việc xác định role/action nào được đưa vào
> queue, khi nào được gọi và thứ tự gọi. Tài liệu nguồn tham chiếu là
> `../werewolf_role_lifecycle_catalog.md`; các role code trong file này đã
> được normalize theo `01-role-catalog-reference.md`.

## 1. Nguyên tắc

`turnOrder` chỉ xác định thứ tự tương đối khi action đã đủ điều kiện; không
đồng nghĩa role được gọi mỗi đêm. Scheduler luôn đánh giá:

```text
role/action exists
AND actor is eligible
AND phase is correct
AND activation condition is true
AND ability is available
```

Role và action được tách riêng. Một role có thể có first-night action,
recurring action, passive effect, death trigger hoặc transformation trigger.

## 2. Lifecycle types

```text
PASSIVE
SETUP_ONLY
FIRST_NIGHT_ONLY
EVERY_NIGHT
FROM_SECOND_NIGHT
ALTERNATING_NIGHT
CONDITIONAL
DAY_ACTION
DEATH_EVENT
VOTE_EVENT
DURING_OTHER_ACTION
TRANSFORMATION_EVENT
```

Mỗi active action phải khai báo `timeoutPolicy`:
`SKIP | AUTO_RESOLVE | USE_DEFAULT | WAIT_FOR_GROUP`.

## 3. Role turn lifecycle

```text
ROLE_TURN_START
→ ACTIVATION_CHECK
→ ACTION_AVAILABLE
→ PLAYER_SUBMITS / TIMEOUT
→ ACTION_CLOSED
→ RESOLVE_ACTION
→ PRIVATE_RESULT / PUBLIC_RESULT
→ EVENT_DISPATCH
→ NEXT_ACTION
```

Action không đủ điều kiện bị `SKIP`, không tạo một turn rỗng. Player chết
không còn active action, trừ action được khai báo `DEATH_EVENT`.

## 4. Canonical activation catalog

| Role code | Activation | Phase/slot | Ghi chú |
|---|---|---|---|
| `villager` | `PASSIVE` | DAY/VOTE | Không có night turn |
| `bodyguard` | `EVERY_NIGHT` | Night | Mỗi đêm chọn một target |
| `seer` | `EVERY_NIGHT` | Night | Mỗi đêm inspect một player, private result |
| `witch` | `CONDITIONAL` | Sau wolf/protection | Có thể inspect victim; heal/poison optional |
| `hunter` | `COMPOSITE` | NIGHT + `DEATH_EVENT` + DAY variant | `mark_target` mỗi đêm chỉ bật nếu scenario yêu cầu; `shoot` mở khi death cause hợp lệ |
| `cupid` | `FIRST_NIGHT_ONLY` | First-night setup | Tạo Lovers một lần |
| `werewolf` | `EVERY_NIGHT` | Group wolf slot | Group action, không gọi từng Sói |
| `wolf-cub` | `PASSIVE + CONDITIONAL` | Wolf/death event | Death tạo extra bite theo scenario |
| `thief` | `SETUP_ONLY` / `FIRST_NIGHT_ONLY` | Setup | Đổi với spare card, sau đó rebuild role state |
| `pied-piper` | `EVERY_NIGHT` | Night | Charmed-player reveal là sub-action sau đó |
| `wolf-dog` | `SETUP_ONLY` hoặc `CONDITIONAL` | Setup / wolf attack | Phụ thuộc variant `VILLAGE_LOCKED`, `WOLF_LOCKED` hoặc bitten |
| `white-werewolf` | `CONDITIONAL` | Sau wolf group | Có thể `ALTERNATING_NIGHT` theo scenario |
| `little-girl` | `DURING_OTHER_ACTION` | Trong wolf slot | Observation window, mặc định từ Night 2 |
| `idiot` | `VOTE_EVENT` | Execution resolution | Hủy execution, mất vote |
| `elder` | `PASSIVE + DEATH_EVENT` | Death resolution | Extra wolf life, không có night turn |
| `scapegoat` | `VOTE_EVENT` | Vote tie | Chỉ kích hoạt khi tie hợp lệ |
| `raven` | `EVERY_NIGHT` | Cuối night | Tạo vote modifier cho ngày kế |
| `raven-plus` | `EVERY_NIGHT` | Raven variant slot | Variant của `raven`, không tạo slot độc lập |
| `two-sisters` | `FIRST_NIGHT_ONLY` | Setup knowledge | Nhận biết nhau |
| `three-brothers` | `FIRST_NIGHT_ONLY` | Setup knowledge | Nhận biết nhau |
| `angel` | `CONDITIONAL` | First-night attack/first-day execution | Win objective hoặc transform khi fail |
| `stuttering-judge` | `SETUP_ONLY + DAY_ACTION` | Setup/day | Secret signal, tối đa một lần |
| `rusty-sword-knight` | `DEATH_EVENT` | Death resolution | Đánh dấu Sói gây thương |
| `fox` | `EVERY_NIGHT` while available | Trước wolf slot | Mất ability nếu scan không có Sói |
| `bear-tamer` | `PASSIVE` | Day start | Check hai hàng xóm sống |
| `actor` | `CONDITIONAL` | First N nights | Mặc định 3 đêm; scenario phải khai báo duration |
| `devoted-servant` | `DEATH_EVENT` | Pre-reveal execution window | Có thể nhận role nạn nhân |
| `sect-member` | `PASSIVE` | Win evaluation | Không có turn riêng |
| `wild-child` | `FIRST_NIGHT_ONLY + TRANSFORMATION_EVENT` | Setup/model death | Chọn idol rồi chờ idol chết |
| `big-bad-wolf` | `CONDITIONAL` | Sau wolf group | Extra target khi điều kiện còn đúng |
| `father-of-werewolves` | `CONDITIONAL` | Wolf target resolution | Conversion một lần, trước death confirmation |
| `spiritualist` | `CONDITIONAL` | Scenario event/day | Chỉ bật khi spiritualism/event được dùng |
| `moon-maiden` | `EVERY_NIGHT` | Pre-action disable | Không khóa Bodyguard/day ability |
| `hypnotist` | `EVERY_NIGHT` | Night | Không chọn cùng target liên tiếp |
| `pharmacist` | `CONDITIONAL` | Night | Sedative/restorative mỗi loại một lần |
| `puppeteer` | `CONDITIONAL` | Trong wolf resolution | Ép wolf target, một lần |
| `assassin` | `ALTERNATING_NIGHT` / `CONDITIONAL` | Scenario-defined | Chỉ mở khi cadence và vote threshold đạt |
| `necromancer` | `CONDITIONAL` | Night | Chỉ khi có dead-player context |
| `fire-wolf` | `CONDITIONAL` | Sau wolf death | Ability disable theo charge/scenario |
| `wolf-brothers` | `FIRST_NIGHT_ONLY + CONDITIONAL` | Setup/awakening | Wolf Brother state và activation phải lưu riêng |
| `shadow` | `FIRST_NIGHT_ONLY + TRANSFORMATION_EVENT` | Setup/target death | Copy role theo target khi đủ điều kiện |
| `avenger` | `DEATH_EVENT` | Custom death trigger | Không đưa vào normal night queue |
| `arsonist` | `CONDITIONAL` | Night | Đốt house, một lần |

## 5. First-night order

Scenario có thể override thứ tự, nhưng phải giữ dependency và dùng canonical
role code:

```yaml
firstNightOrder:
  - thief.setup
  - cupid.choose_lovers
  - lovers.reveal
  - wild-child.choose_idol
  - two-sisters.reveal
  - three-brothers.reveal
  - wolf-brothers.setup
  - actor.setup
  - seer.inspect_player
  - fox.inspect_group
  - bodyguard.protect_player
  - werewolf.select_victim
  - little-girl.observe_wolves
  - white-werewolf.kill
  - father-of-werewolves.convert_victim
  - big-bad-wolf.extra_kill
  - witch.heal_target
  - witch.poison_target
  - moon-maiden.disable_ability
  - hypnotist.hypnotize_player
  - pharmacist.use_sedative
  - pharmacist.use_restorative
  - pied-piper.bewitch_player
  - pied-piper.reveal_charmed
```

Các action không có role, không đủ condition hoặc không có ability available
bị loại khỏi queue trước khi bắt đầu.

## 6. Normal-night order

```yaml
normalNightOrder:
  - actor.use_role
  - seer.inspect_player
  - fox.inspect_group
  - bodyguard.protect_player
  - moon-maiden.disable_ability
  - hypnotist.hypnotize_player
  - werewolf.select_victim
  - little-girl.observe_wolves
  - white-werewolf.kill
  - father-of-werewolves.convert_victim
  - big-bad-wolf.extra_kill
  - fire-wolf.disable_ability
  - witch.heal_target
  - witch.poison_target
  - pharmacist.use_sedative
  - pharmacist.use_restorative
  - arsonist.burn_house
  - necromancer.ask_dead_player
  - pied-piper.bewitch_player
  - pied-piper.reveal_charmed
```

`hunter.shoot`, `avenger.choose_target`, `devoted-servant.take_role`,
`idiot.survive_execution`, `scapegoat.resolve_tie`, `wild-child.transform`
và `lovers.chain_death` thuộc event queue, không phải normal-night queue.

## 7. Event/day queue

```text
DAY_START
→ bear-tamer.neighbor_check
→ stuttering-judge.second_vote (nếu active)
→ VOTE_RESOLUTION
→ devoted-servant.take_role (trước reveal)
→ idiot.survive_execution / scapegoat.resolve_tie
→ PLAYER_DEATH_CONFIRMED
→ hunter.shoot / rusty-sword-knight.reaction / avenger.choose_target
→ lovers.chain_death / wild-child.transform
→ WIN_CHECK
```

Death chain phải chạy tới khi event queue rỗng rồi mới chuyển sang action
night tiếp theo hoặc phase kế tiếp.

## 8. Scheduler contract

```text
buildQueue(gameState, phase, nightNumber):
  candidates = actions where action.phase matches phase
  active = candidates.filter(
    roleExists
    && actorEligible
    && activationConditionMet
    && abilityAvailable
  )
  return sortBy(active, scenarioOrder, action.turnOrder, actionCode)
```

Khi role đổi role/alignment/ability set, phải rebuild các action queue tương
lai. Không giữ queue cũ nếu transformation xảy ra giữa resolution.

## 9. Normalization và variant boundaries

- `defender` trong source catalog = canonical `bodyguard`.
- `village-idiot` = `idiot`; `piper` = `pied-piper`.
- `wolf_father` = `father-of-werewolves`; `big_bad_wolf` = `big-bad-wolf`.
- `white_werewolf` = canonical `white-werewolf`; `wolf_dog` = `wolf-dog`.
- Hunter có hai phần độc lập: `hunter.mark_target` là night action tùy
  scenario; `hunter.shoot` là death/day reaction. Không coi hai nguồn mô tả
  là cùng một activation.
- White Werewolf alternating-night là variant; scenario phải khai báo rõ,
  không suy diễn từ role name.
- `Gypsy` không có trong canonical 43-role catalog V4; chỉ thêm khi có role
  definition và scenario riêng.
- Blood Moon là event modifier, không có trong bất kỳ role/night queue nào.
