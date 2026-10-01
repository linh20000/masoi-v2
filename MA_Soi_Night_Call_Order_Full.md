# MA SÓI — TÀI LIỆU THỨ TỰ GỌI NHÂN VẬT
## Night Call Order, Call Flow & Action Specification

> **Nguồn chính:** `werewolf_role_lifecycle_catalog(1).md` và `SOURCE_pack.md`.
>
> **Mục đích:** tài liệu này dùng làm source of truth cho việc thiết kế **lượt gọi nhân vật**, **UI quản trò**, **UI người chơi** và **scheduler/game engine**.
>
> **Nguyên tắc quan trọng:** `turnOrder` chỉ xác định thứ tự nếu action được kích hoạt. Nó **không có nghĩa role đó được gọi mỗi đêm**.

---

# 1. Quy ước

## 1.1. Các loại activation

| Activation | Ý nghĩa |
|---|---|
| `SETUP_ONLY` | Chỉ xử lý lúc setup |
| `FIRST_NIGHT_ONLY` | Chỉ gọi đêm 1 |
| `EVERY_NIGHT` | Gọi mỗi đêm nếu còn hợp lệ |
| `FROM_SECOND_NIGHT` | Gọi từ đêm 2 |
| `ALTERNATING_NIGHT` | Chỉ gọi các đêm phù hợp, ví dụ cách đêm |
| `CONDITIONAL` | Chỉ gọi khi điều kiện đúng |
| `DAY_ACTION` | Hành động ban ngày |
| `DEATH_EVENT` | Kích hoạt khi có người chết |
| `VOTE_EVENT` | Kích hoạt khi kết quả vote xảy ra |
| `DURING_OTHER_ACTION` | Không có lượt riêng; hoạt động trong lượt của role khác |
| `PASSIVE` | Không gọi |
| `TRANSFORMATION_EVENT` | Kích hoạt khi role/state biến đổi |

## 1.2. Lifecycle chuẩn của một action

```text
ROLE_TURN_START
    ↓
ACTIVATION_CHECK
    ↓
ACTION_AVAILABLE
    ↓
PLAYER_SUBMITS
    │
    └── TIMEOUT
    ↓
ACTION_CLOSED
    ↓
RESOLVE_ACTION
    ↓
PRIVATE_RESULT / PUBLIC_RESULT
    ↓
EVENT_DISPATCH
    ↓
NEXT_ACTION
```

## 1.3. Timeout

Khuyến nghị:

```text
SKIP
AUTO_RESOLVE
USE_DEFAULT
WAIT_FOR_GROUP
```

---

# 2. Thứ tự gọi chuẩn — ĐÊM 1

Đây là queue chuẩn hóa được ghi trong lifecycle catalog:

```text
01. THIEF
02. CUPID
03. LOVERS
04. WILD CHILD
05. TWO SISTERS / THREE BROTHERS
06. ACTOR / SETUP ROLES
07. SEER
08. DEFENDER
09. FOX
10. WEREWOLVES
11. LITTLE GIRL — trong lượt Sói
12. WHITE WEREWOLF
13. WOLF FATHER
14. BIG BAD WOLF
15. WITCH
16. PIPER
17. CHARMED PLAYERS
18. END NIGHT
```

Engine phải lọc action theo:

```text
role exists
AND actor alive / eligible
AND activation condition đúng
AND ability available
AND phase đúng
```

Do đó một game không nhất thiết chạy toàn bộ 18 bước.

---

# 3. Thứ tự gọi chuẩn — ĐÊM BÌNH THƯỜNG

```text
01. ACTOR
02. SEER
03. FOX
04. DEFENDER
05. WEREWOLVES
06. LITTLE GIRL — trong lượt Sói
07. WHITE WEREWOLF
08. WOLF FATHER
09. BIG BAD WOLF
10. WITCH
11. GYPSY
12. PIPER
13. CHARMED PLAYERS
14. OTHER CONDITIONAL ACTIONS
15. END NIGHT
```

> Các action không active phải bị loại khỏi queue trước khi bắt đầu đêm.

---

# 4. Chi tiết từng lượt gọi

## 4.1. THIEF — Ăn Trộm

**ID:** `thief`

**Activation:** `FIRST_NIGHT_ONLY`

**Phase:** `SETUP / NIGHT`

### Quản trò gọi

```text
"Ăn Trộm, thức dậy."
"Đây là hai lá bài đang được để lại."
"Bạn được chọn một lá."
```

### Người chơi làm

```text
1. Mở mắt.
2. Xem 2 lá bài dư.
3. Chọn 1 lá.
4. Đổi role hiện tại thành role được chọn.
5. Ngủ lại.
```

### Rule từ SOURCE_pack

- Có thêm 2 lá chức năng dư.
- Nếu ít nhất 1 trong 2 lá là Sói, Thief bắt buộc phải chọn Sói.

### Engine

```text
THIEF_START
→ SHOW_SPARE_ROLES
→ PLAYER_SELECT_ROLE
→ ROLE_CHANGED
→ REBUILD_ABILITIES
→ THIEF_END
```

### Quan trọng

Nếu Thief đổi thành role mới:

```text
player.role = NEW_ROLE
```

Sau đó phải:

```text
recalculate faction
recalculate abilities
recalculate night actions
recalculate victory conditions
```

---

# 5. CUPID — Thần Tình Yêu

**ID:** `cupid`

**Activation:** `FIRST_NIGHT_ONLY`

**Uses:** 1

### Quản trò gọi

```text
"Thần Tình Yêu, thức dậy."
"Hãy chọn hai người để trở thành người yêu."
```

### Người chơi làm

```text
1. Chọn Player A.
2. Chọn Player B.
3. A và B trở thành Lovers.
4. Ngủ lại.
```

### Engine

```text
CUPID_START
→ SELECT_PLAYER_A
→ SELECT_PLAYER_B
→ CREATE_LOVERS(A, B)
→ LOVERS_REVEAL
→ CUPID_END
```

### Kết quả

```text
A.lovers = B
B.lovers = A
```

Nếu hai người thuộc hai phe khác nhau, game áp dụng trạng thái cặp đôi khác phe theo source.

---

# 6. LOVERS — Cặp Đôi

Lovers **không phải role được gọi mỗi đêm**.

## Đêm 1

Sau Cupid:

```text
LOVERS_REVEAL
```

### Quản trò

```text
"Những người yêu nhau, thức dậy."
"Hãy nhận biết người yêu của mình."
"Những người yêu nhau, ngủ."
```

### Người chơi

```text
A biết B.
B biết A.
```

## Khi một Lover chết

```text
PLAYER_DIED(A)
→ CHECK_LOVER(A)
→ B_DIES
→ CHECK_LOVER(B)
```

Đây là `DEATH_EVENT`, không phải Night Turn.

---

# 7. WILD CHILD — Đứa Trẻ Hoang Dã

**Activation:** `FIRST_NIGHT_ONLY + TRANSFORMATION_EVENT`

## Đêm 1

### Quản trò

```text
"Đứa Trẻ Hoang Dã, thức dậy."
"Hãy chọn một người làm người thần tượng của bạn."
```

### Player

```text
SELECT_MODEL
```

### Engine

```text
WILD_CHILD_START
→ SELECT_MODEL
→ modelId = X
→ WILD_CHILD_END
```

Sau đó:

```text
WAITING_FOR_MODEL_DEATH
```

## Khi người thần tượng chết

```text
PLAYER_DIED(model)
→ WILD_CHILD_MODEL_DIED
→ TRANSFORM
→ role = WEREWOLF
→ faction = WEREWOLF
→ rebuild abilities
→ rebuild future queue
```

Không tạo lượt Wild Child mỗi đêm.

---

# 8. TWO SISTERS / THREE BROTHERS

**Activation:** `FIRST_NIGHT_ONLY`

### Quản trò

```text
"Hai Chị Em / Ba Anh Em, thức dậy."
"Hãy nhận biết những người cùng nhóm."
"Ngủ."
```

### Player

Không chọn target.

Chỉ:

```text
RECOGNIZE_MEMBERS
```

### Engine

```text
GROUP_INFORMATION_PHASE
→ knownMembers[]
```

---

# 9. ACTOR — Diễn Viên / Kịch Sĩ

**Activation:** `FIRST_N_NIGHTS`

SOURCE_pack quy định:

- Có 3 lá chức năng dư.
- Trong 3 đêm đầu có thể đổi bài với 1 lá dư.
- Sau đêm thứ 3 nếu không đổi nữa thì trở thành Dân thường.

### Quản trò

```text
"Diễn Viên, thức dậy."
"Bạn có thể chọn một trong các lá bài chức năng đang được để bên ngoài."
```

### Player

```text
1. Xem các lá dư.
2. Chọn 1 lá hoặc không đổi.
3. Nếu chọn → đổi role.
```

### Engine

```text
ACTOR_START
→ SHOW_AVAILABLE_ROLES
→ SELECT / SKIP
→ ROLE_CHANGED nếu chọn
→ REBUILD_ABILITIES
→ ACTOR_END
```

---

# 10. SEER — Tiên Tri

**Activation:** `EVERY_NIGHT`

### Quản trò

```text
"Tiên Tri, thức dậy."
"Hãy chọn một người để soi."
```

### Player

```text
SELECT_PLAYER
```

### Quản trò / Engine trả kết quả

```text
Nếu mục tiêu là Sói:
    TRUE

Nếu không:
    FALSE
```

### UI

Kết quả phải là **PRIVATE**.

Ví dụ:

```text
[PRIVATE]
Player 07 — MA SÓI
```

### Engine

```text
SEER_START
→ SELECT_TARGET
→ RESOLVE_SEER
→ PRIVATE_RESULT
→ SEER_END
```

---

# 11. DEFENDER — Bảo Vệ / Cảnh Vệ

**Activation:** `EVERY_NIGHT`

### Quản trò

```text
"Bảo Vệ, thức dậy."
"Hãy chọn một người để bảo vệ đêm nay."
```

### Player

```text
SELECT_PLAYER
```

### Rule từ SOURCE_pack

- Có thể tự bảo vệ.
- Không được bảo vệ cùng một người trong 2 đêm liên tiếp.
- Bảo vệ không cứu được người bị Witch đầu độc.

### Engine

```text
DEFENDER_START
→ VALIDATE_TARGET
→ protectedPlayerId = X
→ DEFENDER_END
```

---

# 12. FOX — Cáo

**Activation:** `EVERY_NIGHT_WHILE_POWER_AVAILABLE`

### Quản trò

```text
"Cáo, thức dậy."
"Hãy chọn ba người chơi liền kề."
```

### Player

Chọn 3 người liền kề.

### Engine kiểm tra

```text
Có ít nhất 1 Werewolf?
    YES → gật đầu → Fox giữ năng lực
    NO  → lắc đầu → Fox mất năng lực
```

### Flow

```text
FOX_START
→ SELECT_3_ADJACENT
→ CHECK_WEREWOLF
→ PRIVATE_RESULT
→ nếu không có Sói:
     fox.powerAvailable = false
→ FOX_END
```

---

# 13. WEREWOLVES — Phe Ma Sói

**Activation:** `EVERY_NIGHT`

Đây là **GROUP ACTION**, không gọi từng con Sói một.

### Quản trò

```text
"Ma Sói, thức dậy."
"Hãy nhận biết đồng đội."
"Hãy thống nhất mục tiêu đêm nay."
```

### Player

```text
1. Các Sói mở mắt.
2. Nhận biết nhau.
3. Thảo luận.
4. Chọn mục tiêu.
5. Có thể chọn không cắn nếu luật/config cho phép.
```

### Engine

```text
WOLF_TURN_START
→ WOLF_DISCUSSION
→ WOLF_TARGET_SELECTION
→ WOLF_TARGET_SELECTED
→ GROUP_RESOLUTION
→ WOLF_TURN_END
```

### Kết quả

```text
WOLF_ATTACK(target)
```

Sau đó mới xử lý:

```text
Defender
Witch
Elder
Rusty Sword Knight
Hunter
Lovers
Wild Child
Avenger
...
```

theo event chain.

---

# 14. LITTLE GIRL — Cô Bé

**Activation:** `DURING_OTHER_ACTION`

**Không có lượt riêng.**

SOURCE_pack quy định:

- Từ đêm 2.
- Khi Sói được gọi dậy, Cô Bé có thể hé mắt nhìn.
- Nếu bị Sói phát hiện, Cô Bé bị giết.

### Trong lượt Sói

```text
WOLVES_START
→ LITTLE_GIRL_OBSERVATION_WINDOW_OPEN
→ WOLVES_DISCUSS
→ LITTLE_GIRL_MAY_PEEK
→ WOLVES_END
→ LITTLE_GIRL_WINDOW_CLOSE
```

### Quản trò

Không gọi riêng:

```text
"Cô Bé, thức dậy."
```

Thay vào đó:

```text
"Ma Sói, thức dậy."
```

và mở observation window cho Cô Bé.

---

# 15. WHITE WEREWOLF — Sói Trắng

**Activation:** `CONDITIONAL / ALTERNATING_NIGHT`

Trong lifecycle catalog: action riêng sau lượt Sói.

### Quản trò

```text
"Sói Trắng, thức dậy."
"Nếu muốn, hãy chọn một con Sói để giết."
```

### Player

```text
SELECT_WEREWOLF_TARGET
```

### Engine

```text
WEREWOLVES_END
→ WHITE_WEREWOLF_START
→ SELECT_WOLF
→ WHITE_WEREWOLF_KILL
→ WHITE_WEREWOLF_END
```

### Lưu ý nguồn

SOURCE_pack mô tả Sói Trắng thức dậy lần nữa sau đàn Sói và có thể giết 1 Sói khác.

Lifecycle catalog dùng `ALTERNATING_NIGHT`.

Nếu project muốn luật khác, phải cấu hình:

```yaml
white_werewolf:
  activation: ALTERNATING_NIGHT
```

Không hard-code thành “mọi đêm”.

---

# 16. WOLF FATHER — Cha Sói

**Activation:** `CONDITIONAL`

**Uses:** 1

### Quản trò

```text
"Cha Sói, thức dậy."
"Bạn có muốn biến nạn nhân của Sói thành Ma Sói thay vì giết không?"
```

### Player

```text
USE_INFECTION
hoặc
NORMAL_KILL
```

### Engine

```text
WOLF_TARGET_SELECTED
→ WOLF_FATHER_DECISION
→ nếu infect:
     target.role = WEREWOLF
     target.alive = true
     PLAYER_TRANSFORMED
→ nếu không:
     target chết
```

---

# 17. BIG BAD WOLF — Sói Lớn Xấu Xa

**Activation:** `CONDITIONAL`

Điều kiện trong lifecycle catalog:

```text
actor alive
AND aliveWerewolfCount > 0
AND werewolfDeaths == 0
AND ability available
```

SOURCE_pack diễn giải thêm rằng năng lực tồn tại khi chưa có Sói / Wild Child / Wolf-Dog chết.

### Quản trò

```text
"Sói Lớn Xấu Xa, thức dậy."
"Chọn thêm một mục tiêu để cắn."
```

### Player

```text
SELECT_SECOND_TARGET
```

### Engine

```text
BIG_BAD_WOLF_START
→ SELECT_TARGET
→ EXTRA_WOLF_ATTACK
→ BIG_BAD_WOLF_END
```

Không dùng điều kiện đơn giản:

```text
night >= 2
```

Phải kiểm tra game state.

---

# 18. WITCH — Phù Thủy

**Activation:** `CONDITIONAL`

Có 2 ability độc lập:

```text
witch.use_heal
witch.use_poison
```

### Quản trò

```text
"Phù Thủy, thức dậy."
"Đây là người bị Sói tấn công."
"Bạn có muốn dùng Bình Cứu không?"
"Bạn có muốn dùng Bình Độc không?"
```

### Player

Có thể:

```text
HEAL
POISON
HEAL + POISON
SKIP
```

theo rule/config và số potion còn lại.

### Engine

```text
WITCH_START
→ SHOW_WOLF_VICTIM
→ HEAL_DECISION
→ POISON_DECISION
→ RESOLVE_POTIONS
→ WITCH_END
```

### State

```yaml
healPotion:
  available: true

poisonPotion:
  available: true
```

Dùng xong:

```text
available = false
```

### Self-heal

Catalog xác định đây là configurable rule:

```yaml
witch:
  canSelfHealNight1: false
```

Không hard-code nếu project có nhiều cấu hình.

---

# 19. PIPER — Thổi Sáo

**Activation:** `EVERY_NIGHT`

### Quản trò

```text
"Thổi Sáo, thức dậy."
"Hãy chọn hai người để thôi miên."
```

### Player

Chọn 2 người hợp lệ.

### Engine

```text
PIPER_START
→ SELECT_TARGETS
→ APPLY_CHARM
→ PIPER_END
```

Sau đó:

```text
CHARMED_PLAYERS
→ wake
→ recognize other charmed players
```

### Win condition

Nếu tất cả người còn sống đều bị thôi miên:

```text
PIPER_WIN_CHECK
```

---

# 20. CHARMED PLAYERS

Không phải role turn độc lập.

Sau Piper:

```text
PIPER_END
→ CHARMED_PLAYERS_REVEAL
```

### Quản trò

```text
"Những người bị thôi miên, thức dậy."
"Hãy nhận biết những người bị thôi miên khác."
"Ngủ."
```

---

# 21. GYPSY — Bà Đồng / Gypsy

Lifecycle catalog có action:

```text
GYPSY
```

nhưng SOURCE_pack hiện mô tả role **Bà đồng / Spiritualist** với 5 lần dùng sức mạnh đêm.

### SOURCE_pack

- Có 5 lần kích hoạt.
- Chọn 1 trong 4 câu hỏi gọi hồn.
- Truyền câu hỏi cho 1 người sống vào sáng hôm sau.
- Người sống đó yêu cầu người chết đầu tiên trả lời Có/Không.

### Quản trò

```text
"Bà Đồng, thức dậy."
"Bạn có muốn sử dụng sức mạnh đêm không?"
"Nếu có, hãy chọn câu hỏi."
"Chọn người sống nhận câu hỏi."
```

### Engine

```text
SPIRITUALIST_START
→ CHECK_USES
→ SELECT_QUESTION
→ SELECT_LIVING_PLAYER
→ QUEUE_DAY_EFFECT
→ USES -= 1
→ END
```

> **ORDER:** nguồn chưa quy định chính xác vị trí tuyệt đối ngoài queue normal night hiện tại đặt `gypsy.action` sau Witch. Giữ vị trí này trong engine cho tới khi project chốt rulebook cụ thể.

---

# 22. HUNTER — Thợ Săn

Có **mâu thuẫn giữa hai tài liệu** cần được giữ rõ:

### SOURCE_pack

Mô tả Thợ Săn:

```text
Mỗi đêm chọn 1 người.
Nếu Hunter bị Sói cắn chết:
→ người được chọn chết theo.
Nếu bị treo cổ ban ngày:
→ có quyền kéo 1 người chết cùng.
```

### Lifecycle catalog

Xếp Hunter vào:

```text
DEATH_EVENT
```

và không đưa vào Night Order.

### Không được tự động coi hai mô tả là giống nhau.

Đề xuất data model để hỗ trợ cả hai cấu hình:

```yaml
hunter:
  nightAction:
    enabled: true

  deathAction:
    enabled: true
```

Nếu bật `nightAction`:

```text
HUNTER_START
→ SELECT_TARGET
→ STORE_TARGET
→ HUNTER_END
```

Khi Hunter chết:

```text
PLAYER_DIED(HUNTER)
→ HUNTER_DEATH_TRIGGER
→ nếu deathByWolf:
     HUNTER_TARGET_DIES
```

Ban ngày nếu bị treo cổ:

```text
VOTE_RESOLVED
→ HUNTER_DIED
→ HUNTER_SHOOT
→ SELECT_TARGET
→ TARGET_DIES
```

---

# 23. BEAR TAMER — Người Thuần Gấu

**Activation:** `PASSIVE / DAY_START`

Không gọi ban đêm.

### Đầu ngày

```text
DAY_STARTED
→ CHECK_LEFT_NEIGHBOR
→ CHECK_RIGHT_NEIGHBOR
→ nếu có Werewolf:
     BEAR_GRUNT = true
```

### Quản trò

Có thể dùng tín hiệu:

```text
"GRRRR..."
```

hoặc UI:

```text
🐻 Có dấu hiệu Sói bên cạnh.
```

---

# 24. ELDER — Già Làng

**Activation:** `PASSIVE + DEATH_EVENT`

Không có Night Turn.

SOURCE_pack:

- Chịu được một lần Sói cắn.
- Chết ngay nếu bị treo cổ, Witch poison hoặc Hunter bắn.
- Khi Elder chết, các dân làng có chức năng đặc biệt (trừ Hunter theo source) mất sức mạnh.

### Engine

```text
ATTACK_ELDER
→ CHECK_ELDER_LIVES
```

Khi Elder chết:

```text
ELDER_DIED
→ DISABLE_SPECIAL_VILLAGER_ABILITIES
```

---

# 25. VILLAGE IDIOT — Thằng Ngốc

**Activation:** `VOTE_EVENT`

Không gọi ban đêm.

Khi bị vote treo:

```text
VOTE_RESOLVED
→ TARGET = VILLAGE_IDIOT
→ REVEAL_ROLE
→ PREVENT_DEATH
→ REMOVE_VOTING_RIGHT
```

Nếu đang giữ chức vụ Sheriff:

```text
TRANSFER_SHERIFF
```

---

# 26. SCAPEGOAT — Người Thế Thân

**Activation:** `VOTE_EVENT`

Khi vote hòa:

```text
VOTE_TIE
→ SCAPEGOAT_TRIGGER
→ SCAPEGOAT_DIES
→ SELECT_NEXT_DAY_VOTERS
```

Không có Night Turn.

---

# 27. RUSTY SWORD KNIGHT — Hiệp Sĩ Kiếm Gỉ

**Activation:** `DEATH_EVENT`

Khi bị Sói cắn:

```text
WOLF_ATTACK(KNIGHT)
→ KNIGHT_DIES
→ MARK_ATTACKING_WOLF
→ WOLF_SURVIVES_ONE_MORE_DAY_NIGHT
→ NEXT_RELEVANT_RESOLUTION
→ WOLF_DIES
```

Không gọi ban đêm riêng.

---

# 28. STUTTERING JUDGE — Thẩm Phán Lắp Bắp

**Activation:** `SETUP_ONLY + DAY_EVENT`

## Đêm 1

```text
JUDGE_START
→ PLAYER_SELECT_SECRET_SIGNAL
→ JUDGE_END
```

## Ban ngày

Một lần duy nhất:

```text
JUDGE_SIGNAL
→ SECOND_VOTE
```

Không phải Night Action hàng đêm.

---

# 29. DEVOTED SERVANT — Đầy Tớ Tận Tụy

**Activation:** `DEATH_EVENT / PRE_REVEAL_REACTION`

Khi có người bị làng vote treo và role chưa reveal:

```text
PLAYER_DEATH_PENDING_REVEAL
→ SERVANT_DECISION_WINDOW
→ TAKE_ROLE / NO_TAKE
```

Nếu Take:

```text
SERVANT_ROLE = DEAD_PLAYER_ROLE
→ ROLE_CHANGED
→ REBUILD_ABILITIES
```

Không có Night Turn cố định.

---

# 30. WOLF CUB — Sói Con

Có 2 phần:

```text
NORMAL_WOLF_GROUP_ACTION
+
DEATH_TRIGGER
```

### Khi còn sống

Tham gia:

```text
WEREWOLVES_GROUP
```

### Khi Sói Con chết

SOURCE_pack:

```text
WOLF_CUB_DIED
→ NEXT_NIGHT_WOLVES_ATTACK_COUNT = 2
```

Không tạo một lượt gọi riêng nếu rule project không yêu cầu.

---

# 31. WOLF BROTHERS — Anh Em Sói

**Activation:** `FIRST_NIGHT_ONLY + CONDITIONAL`

## Đêm 1

```text
WOLF_BROTHERS_START
→ RECOGNIZE_MEMBERS
→ SLEEP
```

SOURCE_pack:

- Sói Anh và Sói Em nhận biết nhau.
- Sói Em chưa thức dậy cùng đàn.
- Khi Sói Anh chết, Sói Em nổi giận.
- Sói Em tự cắn một người.
- Sau đó gia nhập đàn Sói.

## Khi Sói Anh chết

```text
WOLF_BROTHER_ELDER_DIED
→ WOLF_CUB_FURY
→ SELECT_TARGET
→ TARGET_DIES
→ WOLF_BROTHERS_JOIN_PACK
```

---

# 32. PHARMACIST — Dược Sĩ

**Nguồn:** Characters Plus.

Có:

```text
Sleep Potion
Recovery Potion
```

Mỗi bình dùng 1 lần.

### Chức năng

- Sleep Potion: khiến 1 người mất quyền nói và bỏ phiếu trong 1 ngày.
- Recovery Potion: cứu người bị Witch đầu độc.

### Activation

SOURCE_pack chỉ mô tả chức năng, **không chỉ rõ vị trí tuyệt đối trong Night Order**.

Do đó:

```text
ORDER = TBD / CONDITIONAL
```

Không tự coi đây là thứ tự chính thức.

---

# 33. KNIGHT — Kỵ Sĩ

**Activation:** `DAY_ACTION`

Chỉ dùng 1 lần.

### Trước khi treo cổ

```text
KNIGHT_START
→ SELECT_PLAYER
→ REVEAL_WOLF_CHECK
```

Nếu mục tiêu là Sói:

```text
WOLF_DIES
→ DAY_END
```

Nếu không:

```text
KNIGHT_DIES
→ CONTINUE_DAY
```

Không gọi ban đêm.

---

# 34. PUPPETEER — Người Múa Rối

SOURCE_pack:

- 1 lần duy nhất.
- Ép phe Sói cắn người chỉ định.
- Hoặc ép Sói tự cắn nhau.

Đây là **conditional intervention** vào Wolf action.

### Không nên tạo:

```text
PUPPETEER_TURN
```

nếu rule chưa chỉ rõ thời điểm.

Nên thiết kế:

```text
WOLF_ACTION_INTERVENTION
```

và cho phép Puppeteer thay đổi:

```text
wolfTarget
```

trước `WOLF_TARGET_RESOLVE`.

**ORDER:** `TBD` trong nguồn hiện tại.

---

# 35. HYPNOTIST — Thầy Thôi Miên

**Activation:** `EVERY_NIGHT`

### Quản trò

```text
"Thầy Thôi Miên, thức dậy."
"Hãy chọn một người để mê hoặc."
```

### Player

```text
SELECT_TARGET
```

Không được chọn cùng một người 2 đêm liên tiếp.

### Effect

```text
target.hypnotized = true
```

Nếu Hypnotist bị giết trong đêm:

```text
HYPNOTIST_DIED
→ HYPNOTIZED_TARGET_DIES
```

---

# 36. NECROMANCER — Người Gọi Hồn

SOURCE_pack:

```text
Mỗi đêm:
→ gọi Necromancer
→ yêu cầu người chết gần nhất chỉ người mình nghi ngờ
→ người chết không được nói
```

### Quản trò

```text
"Người Gọi Hồn, thức dậy."
"Người chết gần nhất, hãy chỉ vào người bạn nghi ngờ."
"Không được nói."
```

**ORDER:** source chưa quy định vị trí tuyệt đối trong queue. Đánh dấu:

```text
CONDITIONAL NIGHT ACTION
ORDER = TBD
```

---

# 37. MOON MAIDEN — Nguyệt Nữ

**Activation:** `EVERY_NIGHT`

### Quản trò

```text
"Nguyệt Nữ, thức dậy."
"Hãy chọn một người để khóa năng lực đêm."
```

### Player

```text
SELECT_TARGET
```

### Effect

```text
target.nightAbilityDisabled = true
```

Không khóa:

```text
Defender
Day abilities
```

theo SOURCE_pack.

**Order:** nguồn chưa chốt vị trí tuyệt đối.

---

# 38. FIRE WOLF — Sói Lửa

**Activation:** `CONDITIONAL`

Điều kiện:

```text
ít nhất 1 Werewolf đã chết
```

Đêm tiếp theo:

```text
FIRE_WOLF_START
→ SELECT_TARGET
→ DISABLE_TARGET_ABILITY_PERMANENTLY
```

Nếu có từ 2 Sói chết:

```text
SECOND_USE_AVAILABLE
```

**Order:** nên nằm trong nhóm Wolf-related conditional action, nhưng source hiện tại chưa chỉ rõ vị trí tuyệt đối.

---

# 39. ASSASSIN — Sát Thủ

SOURCE_pack:

```text
Mỗi 2 đêm,
nếu tích đủ >= 4 phiếu phạt / phiếu bầu hướng vào Assassin,
→ được giết 1 người.
```

### Activation

```text
ALTERNATING_NIGHT + CONDITIONAL
```

### Flow

```text
ASSASSIN_CHECK
→ check night interval
→ check penaltyVotes >= 4
→ ACTION_AVAILABLE
→ SELECT_TARGET
→ TARGET_DIES
```

Nếu điều kiện không đạt:

```text
SKIP
```

---

# 40. RAVEN — Con Quạ

Có 2 mô tả trong SOURCE_pack:

### Characters

Cuối mỗi đêm chọn 1 người nghi là Sói:

```text
target receives 2 vote penalties next day
```

### Characters Plus

Hằng đêm chọn 1 người đặt lời nguyền:

```text
next day = +2 votes
```

Hai mô tả cùng bản chất, có thể chuẩn hóa thành:

```text
RAVEN_START
→ SELECT_TARGET
→ APPLY_VOTE_CURSE(+2)
→ RAVEN_END
```

### Vị trí

Đặt ở:

```text
END_OF_NIGHT_ACTIONS
```

trước:

```text
END_NIGHT
```

nếu project sử dụng Raven.

---

# 41. SHADOW / ẢNH TỬ

**Activation:** `FIRST_NIGHT_ONLY + TRANSFORMATION_EVENT`

### Đêm 1

```text
SHADOW_START
→ SELECT_TARGET
→ targetId = X
```

Nếu target sống đến cuối:

```text
SHADOW_WIN_WITH_VILLAGE
```

Nếu target chết:

```text
TARGET_DIED
→ SHADOW_TAKES_ROLE
→ ROLE_CHANGED
→ REBUILD_ABILITIES
```

Không gọi mỗi đêm.

---

# 42. AVENGER — Kẻ Báo Thù

**Activation:** `FIRST_NIGHT_ONLY + DEATH_EVENT`

## Đêm 1

```text
AVENGER_START
→ CHOOSE_FACTION
    - WEREWOLF
    - VILLAGE
→ AVENGER_END
```

## Khi Avenger chết trong đêm

Nếu chọn phe Sói:

```text
AVENGER_DEATH
→ SELECT_TARGET
→ nếu target là Village:
     TARGET_DIES
```

Nếu chọn phe Dân:

```text
AVENGER_DEATH
→ SELECT_TARGET
→ nếu target là Werewolf:
     TARGET_DIES
```

Đây là event action, không phải Night Order hàng đêm.

---

# 43. ANGEL — Thiên Sứ

**Activation:** `FIRST_NIGHT / FIRST_DAY CONDITION`

Mục tiêu:

```text
bị Sói cắn đêm 1
OR
bị làng treo cổ sáng 1
```

Nếu đạt:

```text
ANGEL_WINS
```

Nếu thất bại:

```text
ANGEL → VILLAGER
```

Không có action chọn target.

Đây là **condition watcher**, không phải active Night Turn.

---

# 44. WOLF-DOG / BÁN SÓI

SOURCE_pack mô tả:

```text
Đầu game được chọn:
→ Villager
hoặc
→ Werewolf
```

Một biến thể khác:

```text
bị Sói cắn
→ không chết
→ hóa Werewolf
```

Do nguồn có nhiều biến thể, engine phải dùng config:

```yaml
wolf_dog:
  setupChoice: true
  transformOnWolfAttack: false
```

Không tự bật cả hai.

---

# 45. ARSONIST — Kẻ Đốt Nhà

SOURCE_pack mô tả:

- Chọn đốt 1 căn nhà.
- Dùng 1 lần.
- Nhà bị đốt bị loại.
- Chủ nhà thành Homeless.
- Có interaction đặc biệt nếu đốt đúng nhà nạn nhân Sói cắn.

**Order:** source chưa quy định chính xác.

Nên model thành:

```text
CONDITIONAL_NIGHT_ACTION
USES = 1
ORDER = TBD
```

---

# 46. SECT LEADER — Thành Viên Giáo Phái

SOURCE_pack mô tả đây là role/phe có cơ chế chia người chơi thành 2 nhóm dựa trên đặc điểm nhận dạng và thắng khi loại bỏ phe đối địch bằng vote.

Không có Night Call cụ thể trong source.

```text
ACTIVATION = PASSIVE / DAY_SYSTEM
NIGHT_ORDER = NONE
```

---

# 47. SHERIFF / TOWN MAYOR

Đây là **chức danh phụ**, không phải role chính.

Không có Night Call.

### Day

```text
vote weight = 2
```

Khi chết:

```text
TRANSFER_SHERIFF
```

---

# 48. POLICE OFFICER

Đây là chức danh phụ.

Không có Night Call.

Buổi sáng:

```text
POLICE_READ_EVENT_CARD
```

Cảnh sát trưởng có thể bổ nhiệm/bãi nhiệm.

---

# 49. BLOOD MOON — Trăng Máu

Blood Moon **không phải role**.

Không được đưa vào:

```text
nightOrder
```

Nó là:

```text
GAME_EVENT_MODIFIER
```

### Event

```text
DAY_EVENT
→ BLOOD_MOON_ENABLED
→ modify next night rules
```

SOURCE_pack có hai nhóm mô tả:

### New Moon

Nạn nhân Sói:

```text
infected / assimilated
→ mất năng lực
→ thành Villager
```

Một số biến thể:

```text
→ đổi phe thành Werewolf
```

### Fanmade / Characters Plus

Có thể:

```text
Werewolves attack 2 targets
```

và/hoặc:

```text
Wolf attack xuyên qua cứu / bảo vệ
```

Các rule này phải là configuration, không hard-code chung.

---

# 50. DEATH EVENT QUEUE

Night action không được kết thúc ngay khi có người chết.

Ví dụ:

```text
WOLVES KILL A
↓
A = HUNTER
↓
HUNTER DEATH ACTION
↓
B DIES
↓
B = LOVER OF C
↓
C DIES
↓
C = AVENGER
↓
AVENGER DEATH ACTION
↓
D DIES
↓
RESOLVE ALL EVENTS
↓
NEXT NIGHT ACTION
```

Engine cần:

```text
EVENT_QUEUE
```

và xử lý cho đến khi:

```text
EVENT_QUEUE.empty == true
```

---

# 51. ROLE CHANGE

Các role có thể làm thay đổi role/state:

```text
Thief
Wild Child
Wolf-Dog
Devoted Servant
Actor
Wolf Father target
Shadow
```

Khi role thay đổi:

```text
ROLE_CHANGED
↓
recalculate faction
↓
recalculate abilities
↓
recalculate night actions
↓
recalculate victory conditions
↓
rebuild future action queue
```

Không giữ queue cũ một cách mù quáng.

---

# 52. ROLE CHẾT

Mặc định:

```text
player.alive == false
→ không còn active action
```

Ngoại lệ:

```text
DEATH_EVENT
```

Ví dụ:

```text
Hunter
Lovers
Avenger
Devoted Servant
Rusty Sword Knight
Wild Child model
```

---

# 53. BẢNG TỔNG HỢP — KHI NÀO GỌI

| Role | Đêm 1 | Đêm 2+ | Trong role khác | Ban ngày | Death/Event | Passive |
|---|---:|---:|---:|---:|---:|---:|
| Villager | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Werewolf | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Seer | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Defender | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Witch | ✅ | ✅* | ❌ | ❌ | ❌ | ❌ |
| Hunter | ⚠️ | ⚠️ | ❌ | ✅ | ✅ | ❌ |
| Cupid | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Lovers | ✅ reveal | ❌ | ❌ | ❌ | ✅ | ✅ |
| Thief | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Wild Child | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Sisters | ✅ | tùy rule | ❌ | ❌ | ❌ | ✅ |
| Brothers | ✅ | tùy rule | ❌ | ❌ | ❌ | ✅ |
| Fox | ✅ | ✅* | ❌ | ❌ | ❌ | ❌ |
| Little Girl | ❌ | ❌ | ✅ trong Sói | ❌ | ❌ | ❌ |
| White Werewolf | config | cách đêm* | ❌ | ❌ | ❌ | ❌ |
| Big Bad Wolf | condition | condition | ❌ | ❌ | ❌ | ❌ |
| Wolf Father | condition | condition | ❌ | ❌ | ❌ | ❌ |
| Wolf Cub | trong Sói | trong Sói | ❌ | ❌ | ✅ | ✅ |
| Wolf Brothers | setup | tùy rule | ❌ | ❌ | ✅ | ✅ |
| Bear Tamer | ❌ | ❌ | ❌ | morning | ❌ | ✅ |
| Elder | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Idiot | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Scapegoat | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Raven | ❌ | cuối đêm | ❌ | effect | ❌ | ❌ |
| Rusty Knight | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Stuttering Judge | setup | ❌ | ❌ | ✅ | ❌ | ❌ |
| Spiritualist/Gypsy | config | config | ❌ | effect | ❌ | ❌ |
| Devoted Servant | ❌ | ❌ | ❌ | vote | ✅ | ❌ |
| Actor | setup | đêm 1-3 | ❌ | ❌ | ❌ | ❌ |
| Piper | config | ✅ | ❌ | ❌ | ❌ | ❌ |
| Charmed Players | ❌ | sau Piper | ❌ | ❌ | ❌ | status |
| Angel | condition | ❌ | ❌ | condition | ❌ | watcher |
| Wolf-Dog | setup | config | ❌ | ❌ | condition | state |
| Arsonist | TBD | TBD | ❌ | ❌ | condition | ❌ |
| Sect Leader | ❌ | ❌ | ❌ | vote | ❌ | ✅ |
| Pharmacist | TBD | TBD | ❌ | ❌ | TBD | state |
| Knight | ❌ | ❌ | ❌ | ✅ | ❌ | uses |
| Puppeteer | TBD | TBD | can modify Wolf | ❌ | TBD | uses |
| Hypnotist | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Necromancer | TBD | TBD | ❌ | ❌ | uses dead | ❌ |
| Moon Maiden | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Fire Wolf | condition | condition | ❌ | ❌ | ❌ | ❌ |
| Assassin | condition | cách đêm + condition | ❌ | ❌ | ❌ | ❌ |
| Shadow | ✅ | ❌ | ❌ | ❌ | ✅ | watcher |
| Avenger | setup | ❌ | ❌ | ❌ | ✅ | watcher |

`*` = phụ thuộc ability/state/config.

`TBD` = tài liệu nguồn hiện tại chưa quy định thứ tự tuyệt đối.

---

# 54. QUEUE IMPLEMENTATION CHUẨN

## First Night

```yaml
firstNightOrder:
  - thief.setup
  - cupid.choose_lovers
  - lovers.reveal
  - wild_child.choose_model
  - sisters_brothers.reveal
  - actor.setup
  - seer.inspect
  - defender.protect
  - fox.inspect
  - wolves.choose_target
  - little_girl.observe_wolves
  - white_werewolf.special_kill
  - wolf_father.infect
  - big_bad_wolf.extra_kill
  - witch.use_potion
  - piper.charm
  - charmed_players.reveal
```

## Normal Night

```yaml
normalNightOrder:
  - actor.use_role
  - seer.inspect
  - fox.inspect
  - defender.protect
  - wolves.choose_target
  - little_girl.observe_wolves
  - white_werewolf.special_kill
  - wolf_father.infect
  - big_bad_wolf.extra_kill
  - witch.use_potion
  - gypsy.action
  - piper.charm
  - charmed_players.reveal
  - other.conditional_actions
```

---

# 55. Scheduler

```pseudo
function buildNightQueue(gameState):

    candidates = ACTION_CATALOG
        .filter(action => action.phase == NIGHT)

    activeActions = []

    for action in candidates:

        if !roleExists(action.role):
            continue

        if !activationConditionMet(action, gameState):
            continue

        if !actorIsEligible(action, gameState):
            continue

        if !abilityAvailable(action, gameState):
            continue

        activeActions.push(action)

    return sortBy(activeActions, action.turnOrder)
```

Điểm quan trọng:

```text
nightOrder != active roles
```

---

# 56. Chuẩn hóa một Role Action

```yaml
role:
  id: seer
  pack: BASIC
  faction: VILLAGE

  actions:
    - id: seer.inspect
      phase: NIGHT
      turnOrder: 110

      activation:
        type: EVERY_NIGHT

      actor:
        type: PLAYER

      targets:
        type: PLAYER
        count: 1

      mandatory: true

      timeoutPolicy:
        type: SKIP

      visibility:
        action: PRIVATE
        result: PRIVATE

      resolution:
        type: CHECK_WEREWOLF
```

---

# 57. Chuẩn hóa UI cho mỗi lượt

Mỗi Night Action nên có 5 trạng thái UI:

## 1. WAITING

```text
Role đang chờ được gọi.
```

## 2. ACTIVE

```text
Role đang được gọi.
```

## 3. ACTION_AVAILABLE

```text
Người chơi có thể chọn hành động.
```

## 4. SUBMITTED

```text
Người chơi đã xác nhận.
```

## 5. RESOLVED

```text
Engine đã xử lý.
```

---

# 58. Template UI quản trò

```text
┌────────────────────────────────────┐
│          NIGHT 03 — STEP 07        │
├────────────────────────────────────┤
│                                    │
│        🐺 WHITE WEREWOLF           │
│                                    │
│ Status: ACTION_AVAILABLE            │
│ Player: #07                         │
│                                    │
│ Target: Player #12                  │
│                                    │
│ [ WAITING ] [ SKIP ] [ RESOLVE ]   │
│                                    │
└────────────────────────────────────┘
```

---

# 59. Template UI người chơi

```text
┌────────────────────────────────────┐
│            YOUR TURN               │
├────────────────────────────────────┤
│                                    │
│        🔮 TIÊN TRI                 │
│                                    │
│ Chọn 1 người để soi                │
│                                    │
│ [ Player 01 ] [ Player 02 ]        │
│ [ Player 03 ] [ Player 04 ]        │
│                                    │
│            [ XÁC NHẬN ]             │
└────────────────────────────────────┘
```

---

# 60. Event Priority

Khi một action gây chết người:

```text
ACTION_RESOLVED
→ PLAYER_DIED
→ DEATH_EVENT_QUEUE
→ RESOLVE_DEATH_EFFECTS
→ RESOLVE_CHAINED_DEATH
→ CHECK_ROLE_CHANGE
→ CHECK_WIN_CONDITION
→ RETURN_TO_NIGHT_QUEUE
```

Không được:

```text
PLAYER_DIED
→ bỏ qua event
→ sang role tiếp theo
```

---

# 61. Các role KHÔNG nên nằm trong Night Order

```text
Villager
Bear Tamer
Elder
Village Idiot
Scapegoat
Rusty Sword Knight
Stuttering Judge
Knight
Sheriff
Police Officer
Sect Leader
```

Chúng dùng:

```text
PASSIVE
DAY_EVENT
VOTE_EVENT
DEATH_EVENT
SETUP_ONLY
```

---

# 62. Các role không có thứ tự tuyệt đối trong nguồn

Các role sau có chức năng nhưng nguồn hiện tại chưa quy định rõ vị trí chính xác trong Night Order:

```text
Pharmacist
Puppeteer
Necromancer
Moon Maiden
Fire Wolf
Assassin
Arsonist
Wolf-Dog
```

Không nên tự ghi thành luật chính thức.

Đề xuất engine:

```yaml
turnOrder:
  status: TBD
```

hoặc:

```yaml
turnOrder:
  group: CONDITIONAL_ACTIONS
```

---

# 63. Các điểm cần chốt trước khi code production

## 63.1. Hunter

Hai tài liệu khác nhau:

```text
SOURCE_pack:
  mỗi đêm chọn target

Lifecycle catalog:
  DEATH_EVENT
```

Cần chọn:

```text
night target enabled?
death trigger enabled?
```

## 63.2. White Werewolf

Lifecycle catalog:

```text
ALTERNATING_NIGHT
```

SOURCE_pack:

```text
có lượt riêng sau Sói
```

Cần cấu hình tần suất.

## 63.3. Witch self-heal

Cần config:

```yaml
canSelfHealNight1: true | false
```

## 63.4. Little Girl

SOURCE_pack:

```text
từ đêm 2
```

Lifecycle catalog cho phép configurable `firstNightAllowed`.

## 63.5. Characters Plus

Các role custom phải có rulebook riêng trước khi khóa `turnOrder`.

---

# 64. Nguyên tắc cuối cùng

Không xây engine theo kiểu:

```text
if role == CUPID:
    callCupidEveryNight()
```

Mà xây:

```text
Action
    ├── phase
    ├── turnOrder
    ├── activation
    ├── actor
    ├── target
    ├── mandatory
    ├── uses
    ├── timeoutPolicy
    ├── visibility
    └── resolution
```

Scheduler:

```text
BUILD QUEUE
    ↓
ACTIVATION CHECK
    ↓
SORT BY turnOrder
    ↓
RUN ACTION
    ↓
RESOLVE
    ↓
DISPATCH EVENTS
    ↓
PROCESS DEATH / TRANSFORMATION CHAIN
    ↓
CHECK WIN
    ↓
NEXT ACTION
```

Đây là cấu trúc phù hợp để chuyển trực tiếp thành:

```text
Flutter UI
    ↓
Game State
    ↓
Night Scheduler
    ↓
Role Action Engine
    ↓
Event Queue
    ↓
Victory Resolver
```

---

# 65. Source-of-truth note

Tài liệu này **không tự coi mọi role trong SOURCE_pack là luật chính thức của cùng một edition**. SOURCE_pack chứa BASIC, Characters, Characters Plus, custom/advanced roles và các biến thể.

Vì vậy mỗi role phải có:

```text
pack
ruleVersion
activation
turnOrder
activationCondition
```

và những điểm chưa được nguồn quy định phải để `TBD/configurable`, không tự hard-code.

## Nguồn sử dụng

- `werewolf_role_lifecycle_catalog(1).md`
- `SOURCE_pack.md`
