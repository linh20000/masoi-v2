# Ma Sói --- Catalog Role, Activation & Thứ tự gọi

> **Changelog (bản sửa lỗi kỹ thuật):**
> 1. Xóa 13 chuỗi citation placeholder bị lỗi (`citeturn...`, chứa ký
>    tự Unicode ẩn vùng Private Use Area) còn sót từ bản nháp gốc; thay
>    bằng reference thật `[R1]`–`[R3]` trỏ tới rulebook chính thức, xem
>    mục 48.
> 2. Sửa lỗi trùng lặp: Big Bad Wolf, Wolf Father, White Werewolf từng
>    bị liệt kê nhầm vào cả `CHARACTER` (đúng) lẫn `CHARACTER_PLUS`
>    (sai) — đã bỏ khỏi `CHARACTER_PLUS`, xem mục 4.3.
> 3. Chuẩn hóa tên gọi: "White Wolf" → "White Werewolf" cho nhất quán
>    với `id: white_werewolf` dùng trong toàn bộ catalog.
> 4. Bổ sung nhánh còn thiếu: Witch không tự cứu được mình đêm 1 ở một
>    số cấu hình số người chơi — khai báo dưới dạng configurable flag
>    (mục 7.4), tương tự cách `firstNightAllowed` đã xử lý cho Little
>    Girl.

> **Mục đích:** tài liệu đặc tả cho game engine Ma Sói gồm 3 bộ `BASIC`,
> `CHARACTER`, `CHARACTER_PLUS` và event toggle `BLOOD_MOON`.
>
> **Lưu ý về nguồn:** phần thứ tự gọi bên dưới được xây dựng theo logic
> của *The Werewolves of Miller's Hollow / Characters* và được chuẩn hóa
> thành dạng machine-readable. Một số tên như **Avenger** hoặc cách chia
> `CHARACTER_PLUS` không phải tên/nhóm chuẩn trong rulebook Characters
> mà là phần mở rộng/custom theo hệ thống đang xây dựng; các mục này
> được đánh dấu `CUSTOM` để tránh coi chúng là luật chính thức.

------------------------------------------------------------------------

## 1. Nguyên tắc cốt lõi

### 1.1. `turnOrder` không đồng nghĩa với "được gọi mỗi đêm"

Mỗi action phải trả lời 2 câu hỏi riêng:

1.  **Khi nào action đủ điều kiện xuất hiện?**
2.  **Nếu xuất hiện thì chạy trước/sau action nào?**

Ví dụ:

``` yaml
action: cupid.choose_lovers

activation:
  type: FIRST_NIGHT_ONLY

turnOrder: 20
```

Cupid có `turnOrder = 20`, nhưng chỉ được đưa vào queue ở **đêm 1**.

### 1.2. Role và Action là hai khái niệm khác nhau

Một role có thể có:

-   action chỉ đêm 1;
-   action mỗi đêm;
-   passive effect;
-   death trigger;
-   transformation trigger.

Ví dụ Wild Child:

``` text
Night 1:
  choose_model

Sau đó:
  passive state

Nếu model chết:
  transformation event
```

Không nên tạo một `Wild Child` turn mỗi đêm.

------------------------------------------------------------------------

# 2. Các lifecycle chính

  -----------------------------------------------------------------------
  Lifecycle                           Ý nghĩa
  ----------------------------------- -----------------------------------
  `PASSIVE`                           Không cần gọi

  `FIRST_NIGHT_ONLY`                  Chỉ gọi đêm 1

  `EVERY_NIGHT`                       Gọi mỗi đêm nếu actor còn hợp lệ

  `FROM_SECOND_NIGHT`                 Gọi từ đêm 2 trở đi

  `ALTERNATING_NIGHT`                 Chỉ gọi các đêm phù hợp, ví dụ cách
                                      đêm

  `DAY_ACTION`                        Action ban ngày

  `DEATH_EVENT`                       Chỉ tạo action khi có death event

  `CONDITIONAL`                       Chỉ gọi khi condition đúng

  `ONCE_WHEN_CONDITION_MET`           Khi điều kiện lần đầu đúng thì kích
                                      hoạt

  `DURING_OTHER_ACTION`               Không có turn riêng; hoạt động
                                      trong action khác

  `SETUP_ONLY`                        Chỉ xử lý lúc setup game

  `TRANSFORMATION_EVENT`              Kích hoạt khi role/state biến đổi
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 3. State machine của một lượt gọi

``` text
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

### Timeout

Mỗi action phải có `timeoutPolicy`.

Các loại khuyến nghị:

``` text
SKIP
AUTO_RESOLVE
USE_DEFAULT
WAIT_FOR_GROUP
```

------------------------------------------------------------------------

# 4. Phân chia 3 bộ

## BASIC

Bộ lõi:

-   Dân Làng
-   Ma Sói
-   Tiên Tri / Seer
-   Phù Thủy / Witch
-   Thợ Săn / Hunter

Nếu dùng bộ cơ bản mở rộng có Thief, Cupid, Little Girl thì đưa 3 role
này sang `CHARACTER` trong catalog engine để tránh nhầm với bộ core tối
giản.

## CHARACTER

Các role nhân vật theo hệ Characters, gồm các role nổi bật:

-   Cupid
-   Thief
-   Little Girl
-   Wild Child
-   Defender
-   Village Idiot
-   Elder
-   Scapegoat
-   Fox
-   Bear Tamer
-   Two Sisters
-   Three Brothers
-   Rusty Sword Knight
-   Stuttering Judge
-   Devoted Servant
-   Piper
-   White Werewolf
-   Big Bad Wolf
-   Wolf Hound
-   Wolf Father / Accursed Wolf-Father
-   Actor
-   Gypsy
-   và các character/event liên quan tùy catalog.

## CHARACTER_PLUS

Dùng cho các role custom/advanced của hệ thống.

Các role đã được xác định trong thiết kế hiện tại:

-   Avenger
-   Wolf Brothers
-   Wolf Cub
-   các biến thể/custom role khác.

> **Sửa lỗi kỹ thuật:** bản trước liệt kê nhầm Big Bad Wolf, Wolf
> Father và White Wolf vào `CHARACTER_PLUS`. Ba role này đã là role
> chính thức thuộc `CHARACTER` (xem mục 4.2) — không nên duplicate
> sang nhóm custom vì sẽ gây mâu thuẫn nguồn dữ liệu (role vừa "official"
> vừa "custom" cùng lúc). Chỉ những role thực sự không có trong
> rulebook Characters/Pact (Avenger, Wolf Brothers, Wolf Cub) mới thuộc
> `CHARACTER_PLUS`.

> **Quan trọng:** nếu project đã có rulebook riêng cho `CHARACTER_PLUS`,
> catalog cuối cùng phải lấy rulebook đó làm source of truth. Không nên
> tự động coi các role custom là luật chính thức của Characters.

------------------------------------------------------------------------

# 5. THỨ TỰ GỌI --- FIRST NIGHT

Đây là queue đề xuất cho **đêm đầu tiên**.

``` text
01  SETUP / ROLE EXCHANGE
02  THIEF
03  CUPID
04  LOVERS
05  WILD CHILD
06  TWO SISTERS / THREE BROTHERS
07  BEAR TAMER / SETUP ROLES
08  ACTOR / SETUP EFFECT
09  SEER
10  DEFENDER
11  FOX
12  WEREWOLVES
13  LITTLE GIRL — DURING WEREWOLVES
14  WHITE WEREWOLF
15  WOLF FATHER
16  BIG BAD WOLF
17  WITCH
18  GYPSY / OTHER CHARACTER ACTIONS
19  PIPER
20  CHARMED PLAYERS
21  END NIGHT
```

Không phải mọi action trên đều chạy trong mọi game. Scheduler phải lọc
theo:

``` text
role exists
AND player alive
AND activation condition
AND ability available
AND current phase
```

Rulebook Characters cũng xác định một nhóm role chỉ gọi đêm đầu như
Thief, Cupid, Lovers, Wild Child, Sisters/Brothers; còn normal night có
Seer, Fox, Defender, Werewolves, White Werewolf, Witch, Piper... tùy
role được chọn. [R1]

------------------------------------------------------------------------

# 6. THỨ TỰ GỌI --- NORMAL NIGHT

Queue chuẩn hóa:

``` text
01  ACTOR / role-specific recurring setup
02  SEER
03  FOX
04  DEFENDER
05  WEREWOLVES GROUP
06  LITTLE GIRL — DURING WEREWOLVES
07  WHITE WEREWOLF
08  WOLF FATHER
09  BIG BAD WOLF
10  WITCH
11  GYPSY
12  PIPER
13  CHARMED PLAYERS
14  SISTERS / BROTHERS nếu luật đang dùng yêu cầu
15  OTHER CONDITIONAL ACTIONS
16  END NIGHT
```

**Lưu ý:** thứ tự chính thức có thể thay đổi theo composition/role set;
engine nên lưu `turnOrder` ở action catalog thay vì hard-code một danh
sách role duy nhất. Rulebook Characters công bố một calling order theo
presence và cũng tách riêng nhóm "first night only".
[R1]

------------------------------------------------------------------------

# 7. ROLE CATALOG --- CORE

## 7.1 Dân Làng

``` yaml
id: villager
pack: BASIC
activation: PASSIVE
phase: NONE
turnOrder: null
```

### Gọi

**Không gọi.**

Dân Làng chỉ tham gia:

-   thảo luận;
-   vote;
-   các event chung của ngày.

------------------------------------------------------------------------

## 7.2 Ma Sói

``` yaml
id: werewolf
pack: BASIC
activation: EVERY_NIGHT
phase: NIGHT
turnOrder: 100
actorType: GROUP
```

### Gọi

Mỗi đêm khi còn ít nhất một Sói sống.

### Flow

``` text
WOLF_TURN_START
↓
WOLF_DISCUSSION
↓
WOLF_TARGET_SELECTION
↓
GROUP_RESOLUTION
↓
ACTION_CLOSED
```

Đây là **group action**, không phải lần lượt gọi từng con Sói.

### Kết quả

Tạo:

``` text
WOLF_ATTACK(target)
```

Sau đó mới resolve các hiệu ứng cứu/chặn/biến đổi.

------------------------------------------------------------------------

## 7.3 Tiên Tri / Seer

``` yaml
id: seer
pack: BASIC
activation: EVERY_NIGHT
phase: NIGHT
turnOrder: 110
mandatory: true
timeoutPolicy: SKIP
```

### Gọi

Mỗi đêm.

### Action

Chọn 1 player để kiểm tra.

### Result

Private result gửi riêng cho Seer.

------------------------------------------------------------------------

## 7.4 Phù Thủy / Witch

``` yaml
id: witch
pack: BASIC
activation: EVERY_NIGHT_WHEN_ABILITY_AVAILABLE
phase: NIGHT
turnOrder: 150
```

Phù Thủy không nhất thiết phải sử dụng potion mỗi đêm.

Cần tách:

``` text
witch.inspect_night_victim
witch.use_heal
witch.use_poison
```

### Trạng thái

``` yaml
healPotion:
  available: true

poisonPotion:
  available: true
```

Khi dùng:

``` text
available = false
```

### Khuyến nghị

Cho Witch được `ACTION_AVAILABLE` mỗi đêm khi còn ít nhất một potion,
nhưng action là **optional**.

### Lưu ý configurable rule (bị thiếu ở bản trước)

Nhiều bộ luật (đặc biệt khi 7–8 người chơi) **không cho phép Witch tự
cứu mình** nếu chính Witch là nạn nhân của Sói trong đêm đầu tiên. Đây
là rule tùy biến theo edition, tương tự `firstNightAllowed` của Little
Girl, nên nên được khai báo dưới dạng flag thay vì hard-code:

``` yaml
witch:
  canSelfHealNight1: false   # tùy config, mặc định theo rule đang chọn
```

[R2]

------------------------------------------------------------------------

## 7.5 Thợ Săn / Hunter

``` yaml
id: hunter
pack: BASIC
activation: DEATH_EVENT
phase: EVENT
```

### Không gọi trong Night Order.

Khi Hunter chết:

``` text
PLAYER_DIED(HUNTER)
↓
HUNTER_DEATH_TRIGGER
↓
HUNTER_SHOOT
↓
TARGET_DIES
```

Rule Hunter thường kích hoạt khi chết và cho phép chọn người chết cùng.
[R3]

------------------------------------------------------------------------

# 8. FIRST NIGHT ONLY ROLES

## 8.1 Cupid

``` yaml
id: cupid
activation: FIRST_NIGHT_ONLY
phase: NIGHT
turnOrder: 20
mandatory: true
uses: 1
```

### Night 1

``` text
Cupid wakes
↓
chọn Player A
↓
chọn Player B
↓
A.lovers = B
B.lovers = A
↓
Cupid sleeps
```

### Night 2+

**Không gọi.**

Đây là điểm quan trọng nhất:

``` text
night == 1 → ACTION_AVAILABLE
night > 1  → SKIP
```

Cupid có thể tự chọn mình làm một trong hai người yêu theo luật bản
chuẩn. [R2]

------------------------------------------------------------------------

# 9. Lovers

Lovers **không phải một role độc lập được gọi mỗi đêm**.

Sau khi Cupid ghép:

``` text
A.lovers = B
B.lovers = A
```

### Night 1

Có một setup action:

``` text
LOVERS_REVEAL
```

Mục đích:

``` text
A biết B
B biết A
```

Sau đó passive.

### Khi một người chết

``` text
PLAYER_DIED(A)
↓
CHECK_LOVER(A)
↓
B chết
```

Không gọi Lovers trong night order hàng đêm.

------------------------------------------------------------------------

# 10. Thief / Ăn Trộm

Đây là role **đổi role**, vì vậy phải xử lý ở setup.

``` yaml
id: thief
activation: FIRST_NIGHT_ONLY
phase: SETUP
turnOrder: 10
```

### Setup

Nếu Thief được dùng, phải thêm 2 role card dư theo rule.

Ví dụ:

``` text
Deck:
  player roles
  +
  thief
  +
  2 spare role cards
```

Sau khi chia:

``` text
2 cards remain outside
```

### Night 1

``` text
THIEF wakes
↓
xem 2 spare cards
↓
chọn 1
↓
exchange role
↓
old role → removed
new role → active
```

Trong rule bản Village, Thief được gọi ở tour khởi động và nhìn hai lá
bài ở giữa để có thể đổi nhân vật. [R2][R3]

### Quan trọng với engine

Sau khi đổi:

``` text
player.role = NEW_ROLE
```

Scheduler phải **rebuild active abilities**.

Ví dụ:

``` text
Thief → Werewolf
```

thì từ sau thời điểm đổi, player phải tham gia Wolf Group.

------------------------------------------------------------------------

# 11. Wild Child / Đứa Trẻ Hoang Dã

Wild Child có 2 lifecycle.

### Night 1

``` yaml
activation: FIRST_NIGHT_ONLY
action: choose_model
```

Flow:

``` text
Wild Child wakes
↓
choose Model
↓
modelId = X
↓
sleep
```

### Sau Night 1

Không gọi mỗi đêm.

Role ở trạng thái:

``` text
WAITING_FOR_MODEL_DEATH
```

### Model chết bởi Sói

``` text
PLAYER_DIED(model)
↓
WILD_CHILD_MODEL_DIED
↓
TRANSFORM
↓
Wild Child becomes Werewolf
```

Do đó đây là:

``` text
FIRST_NIGHT_ONLY
+
TRANSFORMATION_EVENT
```

không phải `EVERY_NIGHT`.

------------------------------------------------------------------------

# 12. Little Girl / Cô Bé

Cô Bé là role đặc biệt vì **không có turn riêng**.

``` yaml
id: little_girl
activation: DURING_OTHER_ACTION
trigger: wolves.choose_target
```

### Khi Sói hoạt động

``` text
WOLVES_START
↓
Little Girl observation window OPEN
↓
Wolves discuss/select
↓
Little Girl may peek
↓
Wolves close
↓
Little Girl window CLOSE
```

Theo rule Characters, Cô Bé có thể được phép theo dõi lúc Sói thức; một
số phiên bản/nhóm luật quy định từ đêm 2, nên setting phải cho phép cấu
hình `firstNightAllowed`. [R1][R3]

### Engine

Không tạo:

``` text
LITTLE_GIRL_TURN
```

mà tạo:

``` text
WOLF_PHASE:
  subWindow:
    littleGirlObservation
```

------------------------------------------------------------------------

# 13. White Werewolf / Sói Trắng

``` yaml
id: white_werewolf
activation: CONDITIONAL
phase: NIGHT
```

Sói Trắng:

1.  tham gia lượt Sói;
2.  sau đó có **lượt riêng** để giết một Sói theo luật role;
3.  không được xử lý như một phần của target vote chung.

### Queue

``` text
WEREWOLVES
↓
WHITE_WEREWOLF
↓
WITCH
```

### Tần suất

Tùy bộ luật:

``` text
ALTERNATING_NIGHT
```

tức:

``` text
Night 2 → active
Night 3 → skip
Night 4 → active
...
```

Rule Characters mô tả White Werewolf là action theo đêm xen kẽ.
[R1][R2]

------------------------------------------------------------------------

# 14. Big Bad Wolf / Sói Lớn

``` yaml
id: big_bad_wolf
activation: CONDITIONAL
phase: NIGHT
```

### Điều kiện

``` text
Big Bad Wolf alive
AND
no Werewolf teammate has died
AND
ability available
```

### Flow

``` text
WEREWOLVES
↓
BIG_BAD_WOLF
↓
second victim
```

Không gọi nếu:

``` text
đã có Sói chết
```

### Quan trọng

Không hard-code:

``` text
night >= 2
```

mà kiểm tra state:

``` text
werewolfDeaths == 0
```

vì điều kiện có thể phụ thuộc game state.

Rule Characters mô tả Big Bad Wolf có thêm một nạn nhân trong đêm chừng
nào chưa có Sói nào trong phe chết. [R1][R2]

------------------------------------------------------------------------

# 15. Wolf Father / Infect Father

``` yaml
id: wolf_father
activation: CONDITIONAL
phase: NIGHT
```

Tham gia Wolf action trước.

Sau khi Wolves có target:

``` text
WOLF_TARGET_SELECTED
↓
WOLF_FATHER_DECISION
```

Có thể:

``` text
kill normally
OR
infect target
```

### Ability

``` yaml
uses: 1
```

Sau khi dùng:

``` text
infectionAvailable = false
```

### Nếu infect

``` text
target.role → WEREWOLF
```

Nhưng phải phát event:

``` text
PLAYER_TRANSFORMED
```

để các hệ thống khác cập nhật.

------------------------------------------------------------------------

# 16. Wolf Cub / Sói Con

Nếu project dùng biến thể Sói Con:

``` yaml
id: wolf_cub
activation: PASSIVE + CONDITIONAL
```

Không tạo turn riêng trừ khi rule cụ thể của project định nghĩa một
active ability.

Nếu Sói Con chết:

``` text
PLAYER_DIED(WOLF_CUB)
↓
WOLF_CUB_DEATH_EFFECT
```

Ví dụ effect có thể thay đổi lần tấn công kế tiếp.

> Phần này cần lấy đúng rulebook của bộ `CHARACTER_PLUS` đang triển
> khai; không nên tự gán rule của một phiên bản fan-made khác.

------------------------------------------------------------------------

# 17. Wolf Brothers / Anh Em Sói

Role custom/advanced này nên có state:

``` yaml
wolfBrothers:
  awakened: false
  knownMembers: []
```

### Nếu rule yêu cầu chỉ nhận biết nhau ở setup/night 1

``` text
FIRST_NIGHT_ONLY
```

### Nếu chưa đủ điều kiện

``` text
SKIP
```

### Khi awakening

``` text
A knows B
B knows A
```

Không nhất thiết có action target mỗi đêm.

------------------------------------------------------------------------

# 18. Two Sisters / Three Brothers

Đây là **information/setup action**.

``` yaml
activation: FIRST_NIGHT_ONLY
```

Flow:

``` text
Sisters/Brothers wake
↓
recognize one another
↓
sleep
```

Nếu dùng advanced rules có thể cho họ thức cùng nhau vào các đêm sau để
trao đổi; khi đó đây là một `GROUP_INFORMATION_PHASE`, không phải target
action.

Rulebook Characters đưa Sisters/Brothers vào nhóm first-night setup và
cũng ghi chú việc gọi họ trong night sequence nếu người chơi có kinh
nghiệm. [R1]

------------------------------------------------------------------------

# 19. Defender / Salvateur

``` yaml
id: defender
activation: EVERY_NIGHT
phase: NIGHT
turnOrder: 70
```

Mỗi đêm:

``` text
Defender
↓
choose target
↓
target protected
```

### State

``` text
protectedPlayerId
```

Reset sau mỗi đêm.

------------------------------------------------------------------------

# 20. Fox

``` yaml
id: fox
activation: EVERY_NIGHT_WHILE_POWER_AVAILABLE
phase: NIGHT
```

Chọn một nhóm 3 người theo rule.

Result:

``` text
Có Sói trong group?
YES → Fox giữ power
NO  → Fox mất power
```

Nếu mất power:

``` text
fox.powerAvailable = false
```

từ đó không còn được gọi.

Rule Characters mô tả Fox kiểm tra một nhóm và có thể mất năng lực nếu
nhóm không có Sói. [R1]

------------------------------------------------------------------------

# 21. Bear Tamer / Người Thuần Gấu

Đây là **passive/day event**, không phải active target mỗi đêm.

``` yaml
activation: PASSIVE
```

Đầu ngày:

``` text
DAY_STARTED
↓
CHECK_NEIGHBORING_WOLF
↓
bearGrunt = true/false
```

UI có thể hiển thị:

``` text
🐻 GRRRR...
```

------------------------------------------------------------------------

# 22. Elder / Trưởng Lão

``` yaml
activation: PASSIVE
```

Không gọi ban đêm.

Effect xảy ra khi Elder bị giết theo phương thức được role định nghĩa.

Ví dụ:

``` text
VOTE_KILL(Elder)
↓
ELDER_DEATH_EFFECT
```

------------------------------------------------------------------------

# 23. Village Idiot

``` yaml
activation: DEATH_EVENT
trigger: VILLAGE_VOTE
```

Không có Night Turn.

Khi bị vote:

``` text
VOTE_RESOLVED
↓
target == Village Idiot
↓
prevent death
↓
remove voting right
```

------------------------------------------------------------------------

# 24. Scapegoat

``` yaml
activation: VOTE_EVENT
```

Không gọi đêm.

Khi vote hòa:

``` text
VOTE_TIE
↓
SCAPEGOAT_TRIGGER
↓
Scapegoat dies
```

------------------------------------------------------------------------

# 25. Rusty Sword Knight

Passive/death-trigger:

``` text
Werewolves kill Knight
↓
KNIGHT_DEATH_EFFECT
↓
nearest Wolf gets death marker
↓
next resolution
```

Không có active night turn.

------------------------------------------------------------------------

# 26. Stuttering Judge

``` yaml
activation: SETUP_ONLY + DAY_EVENT
```

Night/setup:

``` text
Judge chooses secret signal
```

Day:

``` text
if Judge activates signal:
    second_vote = true
```

Không phải night action hàng đêm.

------------------------------------------------------------------------

# 27. Devoted Servant

``` yaml
activation: DEATH_EVENT
```

Khi một player chết nhưng role chưa reveal:

``` text
PLAYER_DEATH_PENDING_REVEAL
↓
SERVANT_DECISION_WINDOW
↓
takeRole / noTake
↓
ROLE_REVEAL
```

Đây là một **pre-reveal reaction window**.

------------------------------------------------------------------------

# 28. Piper / Pied Piper

``` yaml
activation: EVERY_NIGHT
phase: NIGHT
```

Flow:

``` text
Piper
↓
choose target(s)
↓
targets become CHARMED
```

Sau đó:

``` text
CHARMED_PLAYERS
↓
wake
↓
recognize other charmed players
```

Piper và Charmed Players được tách thành hai action.

------------------------------------------------------------------------

# 29. Actor / Comedian

Actor là role đặc biệt vì **đổi ability/role**.

``` yaml
activation: FIRST_N_NIGHTS
```

Mỗi đêm actor có thể:

``` text
look at available role cards
↓
choose temporary role
↓
use that role
```

Sau giới hạn:

``` text
actor role returns / ability ends
```

Exact duration phải lấy từ rulebook version đang dùng.

------------------------------------------------------------------------

# 30. Gypsy

Nếu dùng:

``` yaml
activation: EVERY_NIGHT
phase: NIGHT
```

Nhưng action thực tế phụ thuộc event/spiritualism setup.

Không nên đưa Gypsy thành một action cứng nếu game chưa bật các
card/event tương ứng.

------------------------------------------------------------------------

# 31. Avenger --- CUSTOM

`Avenger` không nằm trong catalog Characters chuẩn mà tôi tìm thấy, nên
nên coi là `CHARACTER_PLUS/CUSTOM`.

Đề xuất lifecycle:

``` yaml
id: avenger
activation: DEATH_EVENT
trigger: PLAYER_DIED
```

Nếu Avenger chết:

``` text
PLAYER_DIED(Avenger)
↓
AVENGER_TRIGGER
↓
ACTION_AVAILABLE
↓
choose target
↓
target dies
```

Nếu rule custom quy định Avenger được gọi khi **một role cụ thể chết**,
condition phải nằm ở:

``` yaml
activationCondition
```

chứ không đưa Avenger vào Night Order.

------------------------------------------------------------------------

# 32. Death/Event roles --- tổng hợp

Các role sau **không nên xuất hiện trong Night Order thường**:

  Role                 Trigger
  -------------------- ----------------------------
  Hunter               Hunter chết
  Lovers               Một người yêu chết
  Wild Child           Model chết
  Village Idiot        Bị vote
  Scapegoat            Vote hòa
  Elder                Bị chết theo rule
  Devoted Servant      Có người chết trước reveal
  Rusty Sword Knight   Bị Sói giết
  Avenger              Custom death trigger
  Bear Tamer           `DAY_STARTED`
  Piper's Charmed      Sau Piper action

------------------------------------------------------------------------

# 33. Action nào tự động, action nào cần player?

## Tự động / Passive

``` text
Villager
Elder
Bear Tamer
Lovers relationship
Wild Child model tracking
Rusty Sword Knight
Scapegoat trigger
Village Idiot trigger
```

## Player chọn

``` text
Cupid → 2 targets
Thief → 1 spare role
Seer → 1 target
Defender → 1 target
Werewolves → 1 target group decision
White Werewolf → 1 wolf target
Big Bad Wolf → 1 additional target
Wolf Father → infect/not
Witch → heal/poison
Fox → 3-player group
Piper → targets
Hunter → target
Avenger → target
Wild Child → model
```

------------------------------------------------------------------------

# 34. Bảng "khi nào gọi"

  Role                              Đêm 1            Đêm 2+          Ban ngày           Event              Passive
  ------------------ -------------------- ----------------- ----------------- --------------- --------------------
  Villager                             ❌                ❌            ✔ vote              ❌                    ✔
  Werewolf                              ✔                 ✔                ❌              ❌                   ❌
  Seer                                  ✔                 ✔                ❌              ❌                   ❌
  Witch                                 ✔                 ✔                ❌              ❌                   ❌
  Hunter                               ❌                ❌                ❌               ✔                   ❌
  Cupid                                 ✔                ❌                ❌              ❌             ✔ lovers
  Thief                                 ✔                ❌                ❌              ❌           ✔ new role
  Lovers                          ✔ setup                ❌                ❌         ✔ death                    ✔
  Wild Child                      ✔ model                ❌                ❌   ✔ model death                    ✔
  Little Girl                  trong Wolf        trong Wolf                ❌              ❌                   ❌
  Defender                              ✔                 ✔                ❌              ❌                   ❌
  Fox                                   ✔               ✔\*                ❌              ❌   ✔ after power loss
  White Werewolf              có thể ❌/✔          cách đêm                ❌              ❌                   ❌
  Big Bad Wolf            ✔ nếu condition   ✔ nếu condition                ❌              ❌                   ❌
  Wolf Father                   condition         condition                ❌              ❌                   ❌
  Wolf Cub                       tùy rule          tùy rule                ❌               ✔                    ✔
  Wolf Brothers                     setup          tùy rule                ❌              ❌                    ✔
  Sisters/Brothers                      ✔          tùy rule                ❌              ❌                    ✔
  Bear Tamer                           ❌                ❌   ✔ morning check              ❌                    ✔
  Elder                                ❌                ❌                ❌               ✔                    ✔
  Village Idiot                        ❌                ❌                 ✔               ✔                    ✔
  Scapegoat                            ❌                ❌                 ✔               ✔                    ✔
  Rusty Knight                         ❌                ❌                ❌               ✔                    ✔
  Stuttering Judge                  setup                ❌                 ✔              ❌                    ✔
  Piper                                 ✔                 ✔                ❌              ❌                   ❌
  Charmed Players                      ❌     ✔ after Piper                ❌              ❌             ✔ status
  Actor                setup/early nights          tùy rule                ❌              ❌                   ❌
  Gypsy                          tùy rule          tùy rule         tùy event               ✔                   ❌
  Avenger                              ❌                ❌                ❌               ✔                   ❌

`*` Fox chỉ được gọi khi còn ability.

------------------------------------------------------------------------

# 35. Thứ tự chuẩn để đưa vào engine

## First Night

``` yaml
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
  - white_wolf.special_kill
  - wolf_father.infect
  - big_bad_wolf.extra_kill
  - witch.use_potion
  - piper.charm
  - charmed_players.reveal
```

## Normal Night

``` yaml
normalNightOrder:
  - actor.use_role
  - seer.inspect
  - fox.inspect
  - defender.protect
  - wolves.choose_target
  - little_girl.observe_wolves
  - white_wolf.special_kill
  - wolf_father.infect
  - big_bad_wolf.extra_kill
  - witch.use_potion
  - gypsy.action
  - piper.charm
  - charmed_players.reveal
```

**Các action không active bị loại khỏi queue trước khi queue bắt đầu.**

------------------------------------------------------------------------

# 36. Cách scheduler xây queue

Pseudo-code:

``` pseudo
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

Đây là điểm giải quyết hoàn toàn vấn đề:

``` text
nightOrder != active roles
```

------------------------------------------------------------------------

# 37. Activation Condition mẫu

## Cupid

``` yaml
activation:
  type: FIRST_NIGHT_ONLY
  condition:
    - night == 1
    - actor.alive == true
    - actor.abilityUsed == false
```

## Seer

``` yaml
activation:
  type: EVERY_NIGHT
  condition:
    - actor.alive == true
```

## Witch

``` yaml
activation:
  type: CONDITIONAL
  condition:
    any:
      - healPotion.available == true
      - poisonPotion.available == true
```

## White Werewolf

``` yaml
activation:
  type: ALTERNATING_NIGHT
  condition:
    - actor.alive == true
    - night % 2 == 0
```

## Big Bad Wolf

``` yaml
activation:
  type: CONDITIONAL
  condition:
    - actor.alive == true
    - aliveWerewolfCount > 0
    - werewolfDeaths == 0
```

------------------------------------------------------------------------

# 38. Thứ tự ưu tiên khi có death chain

Night action không nên kết thúc ngay sau `kill`.

Ví dụ:

``` text
Wolves kill A
↓
A = Hunter
↓
Hunter action
↓
Hunter kills B
↓
B = Lover of C
↓
C dies
↓
C = Avenger
↓
Avenger action
↓
D dies
```

Engine phải chạy:

``` text
EVENT QUEUE
```

cho đến khi:

``` text
queue.empty == true
```

sau đó mới:

``` text
NEXT_NIGHT_ACTION
```

------------------------------------------------------------------------

# 39. Blood Moon

Blood Moon **không phải role** và không nên nằm trong `nightOrder`.

``` yaml
event:
  id: blood_moon
  enabled: true
```

Nó hoạt động như một modifier:

``` text
BASE RULE
+
BLOOD_MOON_MODIFIER
=
EFFECTIVE RULE
```

Ví dụ schema:

``` yaml
bloodMoon:
  enabled: true

  modifiers:
    activation:
      - ...

    resolution:
      - ...

    target:
      - ...

    timing:
      - ...
```

Chỉ những rule nào mà event thực sự thay đổi mới được modifier.

------------------------------------------------------------------------

# 40. Data model đề xuất cho mỗi Role

``` yaml
role:
  id: cupid
  pack: CHARACTER

  faction: VILLAGE

  actions:

    - id: cupid.choose_lovers

      phase: NIGHT
      turnOrder: 20

      activation:
        type: FIRST_NIGHT_ONLY

      actor:
        type: PLAYER

      targets:
        type: PLAYER
        count: 2
        distinct: true

      mandatory: true

      uses:
        total: 1

      timeoutPolicy:
        type: SKIP

      visibility:
        action: PRIVATE
        result: PRIVATE

      resolution:
        type: CREATE_LOVERS
```

------------------------------------------------------------------------

# 41. Quy tắc đặc biệt: Role đổi Role

Các role có thể đổi role:

``` text
Thief
Wild Child
Wolf Hound
Devoted Servant
Actor
Wolf Father infection target
```

Khi role thay đổi:

``` text
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

**Không được giữ queue cũ nếu role vừa thay đổi.**

Ví dụ:

``` text
Wild Child
↓
Model chết
↓
Wild Child → Werewolf
```

Nếu queue đêm hiện tại đã được tạo trước đó, scheduler phải biết rằng
player mới có thể trở thành actor của Wolf Group từ thời điểm rule cho
phép.

------------------------------------------------------------------------

# 42. Quy tắc: chết = ngừng action

Mặc định:

``` text
player.alive == false
```

thì:

``` text
activeAction = false
```

trừ các action:

``` text
DEATH_EVENT
```

Ví dụ Hunter chết nhưng vẫn được gọi:

``` text
Hunter death action
```

Đây là exception được khai báo rõ ràng, không phải bug.

------------------------------------------------------------------------

# 43. Quy tắc: action đã dùng hết

Mỗi ability nên có:

``` yaml
uses:
  total: 1
  consumed: 0
```

Ví dụ:

``` text
Cupid:
  total = 1

Witch heal:
  total = 1

Witch poison:
  total = 1

Wolf Father infection:
  total = 1

Fox:
  total = 1
```

Khi:

``` text
consumed >= total
```

scheduler bỏ action khỏi queue.

------------------------------------------------------------------------

# 44. Quy tắc: "role tồn tại" chưa đủ

Không dùng:

``` pseudo
if player.role == CUPID:
    addToNightQueue()
```

Phải dùng:

``` pseudo
if action.activationCondition(gameState):
    addToNightQueue()
```

Ví dụ Cupid:

``` pseudo
player.role == CUPID
AND night == 1
AND abilityAvailable
AND player.alive
```

------------------------------------------------------------------------

# 45. Recommended final architecture

``` text
GAME
│
├── Role Catalog
│    ├── BASIC
│    ├── CHARACTER
│    └── CHARACTER_PLUS
│
├── Action Catalog
│
├── Activation Engine
│
├── Night Scheduler
│
├── Day Scheduler
│
├── Event Queue
│
├── Event Resolver
│
├── Transformation Engine
│
├── Death Resolver
│
└── Blood Moon Modifiers
```

### Night

``` text
GameState
   ↓
Activation Engine
   ↓
Night Queue
   ↓
Role Turn Lifecycle
   ↓
Action Resolution
   ↓
Event Queue
   ↓
Death / Transform / Lover / Hunter chains
   ↓
Next Night Action
```

------------------------------------------------------------------------

# 46. Rule of thumb cho implementation

Nếu hỏi:

> "Role này có cần Quản Trò gọi không?"

Dùng bảng:

``` text
Có một lựa chọn cần player thực hiện?
    ↓ YES
ACTIVE ACTION
```

``` text
Chỉ phản ứng khi một event xảy ra?
    ↓ YES
EVENT TRIGGER
```

``` text
Chỉ thay đổi state/khả năng của player?
    ↓ YES
PASSIVE / MODIFIER
```

``` text
Chỉ xảy ra lần đầu?
    ↓ YES
FIRST_NIGHT_ONLY / SETUP_ONLY
```

``` text
Role biến thành role khác?
    ↓ YES
TRANSFORMATION EVENT
```

------------------------------------------------------------------------

# 47. Kết luận cho 3 bộ

Điều quan trọng nhất khi implement là **không tạo một danh sách "role
được gọi mỗi đêm"**.

Hãy tạo:

``` text
ROLE CATALOG
      +
ACTION CATALOG
      +
ACTIVATION CONDITION
      +
TURN ORDER
      +
EVENT TRIGGER
```

Sau đó engine tự sinh:

``` text
FIRST NIGHT QUEUE
NORMAL NIGHT QUEUE
DAY QUEUE
DEATH EVENT QUEUE
TRANSFORMATION QUEUE
```

Như vậy:

-   **Cupid** → chỉ queue Night 1.
-   **Thief** → chỉ setup/Night 1, sau đó role có thể thay đổi.
-   **Lovers** → setup Night 1 + passive death chain.
-   **Wild Child** → chọn model Night 1, sau đó chờ death event.
-   **Little Girl** → không có turn riêng, hoạt động trong Wolf phase.
-   **Werewolves** → group action mỗi đêm.
-   **White Werewolf** → sau Wolves, theo alternating-night/condition.
-   **Big Bad Wolf** → sau White Werewolf, chỉ khi chưa có Wolf chết.
-   **Wolf Father** → sau/đồng hành với Wolf resolution theo rule, chỉ 1
    lần.
-   **Witch** → mỗi đêm khi còn potion, nhưng action optional.
-   **Hunter** → chỉ khi chết.
-   **Lovers** → chỉ khi một người yêu chết.
-   **Avenger** → death event nếu dùng custom rule.
-   **Passive roles** → không bao giờ xuất hiện trong night queue.
-   **Blood Moon** → modifier, không phải role/action.

------------------------------------------------------------------------

## 48. Sources / rulebook references

Các trích dẫn `[R1]`–`[R3]` trong tài liệu này trỏ tới các nguồn sau
(thay thế các placeholder citation bị lỗi ở bản trước):

-   **[R1] — Werewolves of Miller's Hollow: Characters, official
    rulebook (Asmodee/Lui-même)**
    <https://cdn.svc.asmodee.net/production-asmodeeca/uploads/2023/07/WerewolvesCharacters_EN_Rules.pdf>
    Nguồn chính cho: phân nhóm first-night-only vs normal-night,
    calling order, Big Bad Wolf, White Werewolf (alternating night),
    Fox, Two Sisters/Three Brothers.

-   **[R2] — The Werewolves of Miller's Hollow: The Pact, rulebook**
    <https://cdn.1j1ju.com/medias/5f/6f/6b-the-werewolves-of-millers-hollow-the-pact-rulebook.pdf>
    Nguồn chính cho: Cupid có thể tự chọn mình làm lover, thứ tự thức
    dậy chi tiết của nhóm Sói (White Werewolf → Wolf Father → Big Bad
    Wolf → Witch), ghi chú Witch không tự cứu được mình đêm 1 ở một số
    cấu hình người chơi.

-   **[R3] — Base rules tham chiếu / tổng hợp cộng đồng**
    <https://www.ultraboardgames.com/the-werewolves-of-millers-hollow/game-rules.php>
    và thread tổng hợp biến thể trên BoardGameGeek
    <https://boardgamegeek.com/thread/2055802/the-new-characters-and-a-few-tips>
    (nguồn thứ cấp, chỉ dùng để đối chiếu chéo — không coi là luật
    chính thức, đặc biệt với các mục "TIP"/biến thể nhà làm).

> **Lưu ý:** [R3] là nguồn cộng đồng, không phải rulebook chính thức.
> Bất kỳ chi tiết nào chỉ xuất hiện ở [R3] mà không có trong [R1]/[R2]
> nên được coi là "cách chơi phổ biến" chứ không phải luật gốc, và cần
> đối chiếu lại với rulebook `CHARACTER_PLUS` riêng của project nếu có
> mâu thuẫn.

> **Implementation note:** các role `Avenger`, `Wolf Brothers`,
> `Wolf Cub` và bất kỳ role nào thuộc `CHARACTER_PLUS` nhưng không có
> trong rulebook Characters cần được chốt theo rulebook/custom
> specification của project trước khi coi catalog trên là "source of
> truth".
