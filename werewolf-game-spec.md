# Werewolf Game — Source of Truth & Implementation Roadmap

> **LEGACY / NON-CANONICAL:** Tài liệu này là roadmap và source lịch sử. Không dùng trực tiếp để sinh DTO, seed, action registry hoặc test runtime. Contract canonical hiện tại nằm trong `werewolf-spec-v4/`; khi có khác biệt, V4 được ưu tiên.

> Mục tiêu: chuẩn hóa toàn bộ `pack.md` thành một hệ thống dữ liệu và game engine rõ ràng, dễ triển khai, có thể mở rộng role mới mà không phải sửa hàng loạt code Java.
>
> Stack định hướng:
> - Client: Flutter
> - Game Backend: Java / Spring Boot
> - Realtime: WebSocket
> - Database: PostgreSQL
> - Object Storage: S3-compatible (MinIO dev/self-host, S3/R2 production)
> - Voice: WebRTC + voice service riêng
> - Deployment: các service độc lập, có thể deploy trên các VPS khác nhau
> - Không dùng Gateway nếu chưa có nhu cầu thực tế.

---

# 1. Nguyên tắc kiến trúc

## 1.1 Server là nguồn sự thật duy nhất

Flutter **không quyết định game state**.

Flutter chỉ:

```text
Render Game State
      ↓
Hiển thị Action được server cho phép
      ↓
Gửi Action Request
      ↓
Nhận Game Event / State Update
```

Java server quyết định:

- phase hiện tại
- timer
- role
- faction/alignment
- action có hợp lệ hay không
- target có hợp lệ hay không
- effect
- damage/death
- protection
- relationship
- knowledge
- win condition
- game over

Không được đưa business rule quan trọng vào Flutter.

---

# 2. Mục tiêu của hệ thống Role

Không tạo 35+ class:

```text
WitchRole.java
SeerRole.java
WolfRole.java
FoxRole.java
...
```

Thay vào đó:

```text
Role
  ↓
Ability
  ↓
Action
  ↓
Validator
  ↓
Effect
  ↓
GameState
  ↓
GameEvent
```

Các rule đặc biệt:

```text
Trigger
  ↓
Rule
  ↓
Effect
```

Các hệ thống song song:

```text
Knowledge
Relationship
Transformation
WinCondition
Status
```

---

# 3. Phân loại Card

## 3.1 CHARACTER

Role nhân vật chính.

Ví dụ:

```text
VILLAGER
SEER
BODYGUARD
WITCH
HUNTER
CUPID
WEREWOLF
WOLF_CUB
...
```

## 3.2 TITLE

Chức danh gắn thêm cho Player.

Ví dụ:

```text
SHERIFF
POLICE_OFFICER
```

Player có thể:

```text
CharacterRole = SEER
Title = SHERIFF
```

Không biến Sheriff thành CharacterRole.

## 3.3 EVENT

Event thay đổi luật hoặc phase.

Ví dụ:

```text
BLOOD_MOON
```

Event phải có `EventVariant` nếu luật có nhiều phiên bản.

## 3.4 RELATIONSHIP

Không phải role.

Ví dụ:

```text
LOVERS
SIBLINGS
WOLF_PACK
WOLF_BROTHERS
HYPNOTIZED
CULT_GROUP
```

---

# 4. Source of Truth

Từ `pack.md`, chuẩn hóa thành các file Markdown độc lập:

```text
docs/game/
├── 00-overview.md
├── 01-role-catalog.md
├── 02-ability-catalog.md
├── 03-action-catalog.md
├── 04-trigger-catalog.md
├── 05-rule-catalog.md
├── 06-effect-catalog.md
├── 07-knowledge-catalog.md
├── 08-relationship-catalog.md
├── 09-transformation-catalog.md
├── 10-win-condition-catalog.md
├── 11-status-catalog.md
├── 12-event-catalog.md
├── 13-phase-flow.md
├── 14-database-design.md
├── 15-java-backend-architecture.md
├── 16-websocket-protocol.md
├── 17-flutter-client-architecture.md
├── 18-asset-management.md
├── 19-test-scenarios.md
└── 20-deployment.md
```

Nếu muốn đơn giản hóa lúc bắt đầu, có thể gộp thành một file:

```text
werewolf-spec.md
```

Sau khi ổn định mới tách thành các file nhỏ.

---

# 5. Role Catalog

Mỗi Role phải có tối thiểu:

| Field | Ý nghĩa |
|---|---|
| `code` | ID bất biến |
| `name` | Tên hiển thị |
| `type` | CHARACTER / TITLE / EVENT |
| `defaultAlignment` | Phe mặc định |
| `abilities` | Ability |
| `actions` | Action |
| `triggers` | Trigger |
| `rules` | Passive/conditional rules |
| `knowledgeRules` | Knowledge |
| `relationshipRules` | Relationship |
| `transformations` | Transformation |
| `winConditions` | Điều kiện thắng |
| `assetKey` | Key ảnh |
| `sourcePack` | Pack |

## 5.1 Basic

```text
VILLAGER
SEER
BODYGUARD
WITCH
HUNTER
CUPID

WEREWOLF
WOLF_CUB

THIEF
PIPER
```

## 5.2 Characters

```text
TWO_SISTERS
THREE_BROTHERS
RUSTY_SWORD_KNIGHT
BEAR_TAMER
FOX
IDIOT
ELDER
SCAPEGOAT
RAVEN
LITTLE_GIRL
STUTTERING_JUDGE
SPIRITUALIST
```

## 5.3 Wolf

```text
WHITE_WEREWOLF
BIG_BAD_WOLF
FATHER_OF_WEREWOLVES
```

## 5.4 Neutral / Transforming

```text
ANGEL
WILD_CHILD
DEVOTED_SERVANT
ACTOR
WOLF_DOG
ARSONIST
SECT_MEMBER
```

## 5.5 Characters Plus

```text
PHARMACIST
KNIGHT
PUPPETEER
HYPNOTIST
NECROMANCER
MOON_MAIDEN

FIRE_WOLF
WOLF_BROTHERS
ASSASSIN
RAVEN_PLUS
SHADOW
AVENGER
```

---

# 6. Ability Catalog

Ability là capability của Role.

Ví dụ:

```text
WITCH
├── HEAL
└── POISON

SEER
└── INSPECT

BODYGUARD
└── PROTECT

WEREWOLF
└── WOLF_KILL
```

Ability không trực tiếp mutate GameState.

Nó liên kết tới Action hoặc Trigger.

Schema khái niệm:

```text
Ability
├── code
├── name
├── description
├── ownerRole
├── activationType
├── actions[]
└── triggers[]
```

`activationType`:

```text
ACTIVE
PASSIVE
TRIGGERED
```

---

# 7. Action Catalog

Action là hành động mà Player có thể yêu cầu server thực hiện.

Mỗi Action:

```text
Action
├── code
├── actor
├── phase
├── targetType
├── targetCount
├── conditions
├── limits
├── priority
├── validator
├── effects
└── visibility
```

Ví dụ:

```yaml
code: INSPECT_PLAYER
actor: SEER
phase: NIGHT
targetType: PLAYER
targetCount: 1
limit: ONCE_PER_NIGHT
visibility: PRIVATE
effects:
  - REVEAL_ALIGNMENT
```

## 7.1 Action chính

```text
INSPECT_PLAYER
PROTECT_PLAYER

HEAL_PLAYER
POISON_PLAYER

HUNTER_SHOOT

WOLF_KILL
WHITE_WOLF_KILL
EXTRA_WOLF_KILL
CONVERT_VICTIM_TO_WOLF

LINK_LOVERS
CHOOSE_EXTRA_CARD

BEWITCH_PLAYER
PEEK_WEREWOLVES

FOX_INSPECT_GROUP
CURSE_PLAYER

CHOOSE_IDOL
CHOOSE_ALIGNMENT

BURN_HOUSE

SEDATIVE
RESTORATIVE

KNIGHT_CHECK_WOLF
FORCE_WOLF_TARGET

HYPNOTIZE_PLAYER
ASK_DEAD_PLAYER
DISABLE_NIGHT_ABILITY

DISABLE_ABILITY
ASSASSIN_KILL

CHOOSE_TARGET
CHOOSE_FACTION
AVENGE
```

---

# 8. Trigger Catalog

Trigger xảy ra khi một Game Event xuất hiện.

Ví dụ:

```text
ON_GAME_START
ON_NIGHT_START
ON_NIGHT_END
ON_DAY_START
ON_VOTING_START
ON_VOTE_CAST
ON_VOTE_TIE
ON_EXECUTION
ON_PLAYER_DEATH
ON_WOLF_ATTACK
ON_WOLF_DEATH
ON_TARGET_DEATH
ON_ROLE_TRANSFORM
ON_PHASE_CHANGE
ON_GAME_END_CHECK
```

Ví dụ:

```text
WILD_CHILD
  ON_TARGET_DEATH
      ↓
  TRANSFORM_TO_WEREWOLF
```

```text
ELDER
  ON_WOLF_ATTACK
      ↓
  CONSUME_LIFE
```

```text
WOLF_CUB
  ON_PLAYER_DEATH
      ↓
  ENABLE_DOUBLE_WOLF_BITE_NEXT_NIGHT
```

---

# 9. Rule Catalog

Rule mô tả luật nghiệp vụ.

Không nên để trong Role Java.

Ví dụ:

```text
BODYGUARD_CANNOT_PROTECT_SAME_TARGET_CONSECUTIVELY

ELDER_HAS_TWO_WOLF_LIVES

IDIOT_SURVIVES_EXECUTION

IDIOT_LOSES_VOTING_RIGHT

RAVEN_TARGET_HAS_TWO_EXTRA_VOTES

SCAPEGOAT_DIES_ON_TIE

FOX_LOSES_ABILITY_IF_NO_WOLF

LITTLE_GIRL_CAN_PEEK_FROM_NIGHT_2

STUTTERING_JUDGE_ONE_EXTRA_VOTE

WITCH_HEAL_ONCE

WITCH_POISON_ONCE
```

Rule nên được đánh giá bởi Rule Engine.

```java
interface Rule {
    boolean evaluate(GameContext context);
}
```

---

# 10. Effect Catalog

Effect là thay đổi thực tế lên GameState.

Các Effect nguyên thủy nên ít và có thể kết hợp.

```text
KILL_PLAYER
DAMAGE_PLAYER
SAVE_PLAYER
PROTECT_PLAYER
REVEAL_ROLE
REVEAL_ALIGNMENT
ADD_STATUS
REMOVE_STATUS
ADD_VOTE_MODIFIER
REMOVE_VOTE_RIGHT
DISABLE_ABILITY
ENABLE_ABILITY
CHANGE_ALIGNMENT
CHANGE_ROLE
CREATE_RELATIONSHIP
REMOVE_RELATIONSHIP
SCHEDULE_DEATH
CANCEL_DEATH
ADD_KNOWLEDGE
REMOVE_KNOWLEDGE
SET_FLAG
CLEAR_FLAG
TRANSFER_TITLE
CREATE_EVENT_MODIFIER
```

Ví dụ:

```text
WOLF_KILL
    ↓
SCHEDULE_DEATH(target)
```

Nhưng chưa chết ngay.

Sau đó Resolution Engine xử lý:

```text
Protection
Witch
Elder
Rusty Sword Knight
Lovers
Other modifiers
```

rồi mới tạo:

```text
PLAYER_DIED
```

---

# 11. Knowledge Catalog

Knowledge là thông tin private mà server cấp cho Player.

```text
KNOWN_PLAYER
KNOWN_ROLE
KNOWN_ALIGNMENT
KNOWN_RELATIONSHIP
INSPECTION_RESULT
PRIVATE_EVENT_RESULT
TEAM_MEMBER
```

Ví dụ:

```text
Werewolf
    knows → Wolf teammates

Seer
    knows → inspection result

Witch
    knows → Wolf victim

Cupid
    knows → lovers relationship

Lover
    knows → other lover

Two Sisters
    knows → sister members

Three Brothers
    knows → brother members
```

Knowledge phải được server filter trước khi gửi WebSocket.

Không broadcast:

```json
{
  "target": "P07",
  "role": "WEREWOLF"
}
```

cho toàn phòng.

---

# 12. Relationship Catalog

Relationship là runtime state.

```text
LOVERS
SIBLINGS
WOLF_PACK
WOLF_BROTHERS
HYPNOTIZED_GROUP
CULT_GROUP
IDOL
```

Ví dụ:

```text
Cupid
  ↓
LINK_LOVERS
  ↓
Relationship(LOVERS, P01, P07)
```

Khi một Lover chết:

```text
ON_MEMBER_DEATH
    ↓
KILL_OTHER_MEMBER
```

---

# 13. Transformation Catalog

Role có thể thay đổi trong runtime.

| Role | Trigger | Result |
|---|---|---|
| Wild Child | Idol chết | Werewolf |
| Wolf Dog | Chọn đầu game | Village / Werewolf |
| Wolf Dog | Bị cắn (variant) | Werewolf |
| Angel | Không đạt điều kiện thắng | Villager |
| Actor | Hết Night 3 | Villager |
| Devoted Servant | Đổi với người bị vote | Nhận role victim |
| Shadow | Target chết | Nhận role target |
| Father Wolf | Wolf victim | Werewolf |
| Blood Moon | Infection | Villager |

Transformation phải là state transition:

```text
oldRole
  ↓
TransformationCondition
  ↓
newRole
```

---

# 14. Win Condition Catalog

Không hard-code chiến thắng.

```text
VILLAGE_ELIMINATE_WEREWOLVES
WEREWOLF_DOMINATION
WHITE_WOLF_SOLE_SURVIVOR
PIPER_ALL_BEWITCHED
ANGEL_FIRST_NIGHT_DEATH
LOVERS_LAST_TWO
SECT_ELIMINATE_OPPOSING_GROUP
```

Interface:

```java
interface WinCondition {
    Optional<WinResult> evaluate(GameState state);
}
```

---

# 15. Game State

GameState là snapshot authoritative của một ván.

```text
GameState
├── gameId
├── phase
├── round
├── nightNumber
├── dayNumber
├── players
├── activeActions
├── pendingActions
├── relationships
├── knowledge
├── statuses
├── eventModifiers
├── votes
├── timers
└── winState
```

Không lưu tất cả vào Player.

---

# 16. Player State

```text
Player
├── playerId
├── displayName
├── role
├── title
├── alignment
├── alive
├── statuses
├── knowledge
└── relationships
```

Các thông tin private phải được filter khi serialize.

---

# 17. Game Flow

```text
WAITING
   ↓
STARTING
   ↓
ROLE_REVEAL
   ↓
NIGHT
   ↓
ROLE_TURN
   ↓
NIGHT_RESOLUTION
   ↓
DAY
   ↓
DISCUSSION
   ↓
VOTING
   ↓
VOTE_RESOLUTION
   ↓
WIN_CHECK
   ├── GAME_OVER
   └── NIGHT
```

Server sở hữu timer.

Flutter chỉ hiển thị:

```text
phase
remainingTime
currentTurn
availableActions
```

---

# 18. Action Processing Pipeline

Mọi Action Request phải đi qua một pipeline chung:

```text
Client
  ↓
WebSocket
  ↓
ActionController
  ↓
ActionService
  ↓
ActionValidator
  ↓
RuleEngine
  ↓
EffectResolver
  ↓
GameState
  ↓
GameEvent
  ↓
EventPublisher
  ↓
Clients
```

Ví dụ:

```text
SEER
  ↓
INSPECT_PLAYER(P07)
  ↓
Validator
  ├── Is Seer alive?
  ├── Is Night?
  ├── Is Seer turn?
  ├── Is P07 valid?
  └── Is action available?
  ↓
Effect
  ↓
INSPECTION_RESULT
  ↓
Private WebSocket event → Seer
```

---

# 19. Night Resolution

Đây là phần phải thiết kế kỹ nhất.

Không xử lý:

```text
Wolf kill → chết ngay
```

Mà:

```text
Actions collected
        ↓
Priority resolution
        ↓
Protection
        ↓
Healing
        ↓
Poison
        ↓
Special survival
        ↓
Scheduled deaths
        ↓
Relationship deaths
        ↓
Transformation
        ↓
Final deaths
        ↓
Win check
```

Nên có:

```java
interface ResolutionStep {
    void resolve(GameContext context);
}
```

Ví dụ:

```text
ResolveWolfAttack
ResolveProtection
ResolveWitch
ResolveSpecialDefense
ResolveDeath
ResolveRelationships
ResolveTransformations
ResolveWinCondition
```

---

# 20. Priority

Không nên dùng thứ tự `if/else` ngẫu nhiên.

Mỗi Effect/Rule có priority.

Ví dụ:

```text
1000 PRE_ACTION
2000 ACTION
3000 PROTECTION
4000 HEAL
5000 DAMAGE
6000 DEATH
7000 RELATIONSHIP
8000 TRANSFORMATION
9000 WIN_CHECK
```

Đây chỉ là khung ban đầu. Khi chốt luật từng Role, priority phải được kiểm thử bằng scenario.

---

# 21. Database Design

PostgreSQL lưu **definition** và **persistent game data**, không nên biến DB thành game engine.

## 21.1 Catalog tables

```text
packs
cards
roles
abilities
actions
triggers
rules
effects
knowledge_rules
relationship_types
transformation_rules
win_conditions
events
event_variants
```

## 21.2 Mapping tables

```text
role_abilities
ability_actions
ability_triggers
role_rules
role_knowledge_rules
role_relationship_rules
role_transformations
role_win_conditions
event_variants
```

## 21.3 Runtime tables

```text
games
game_players
game_state
game_actions
game_events
game_votes
game_relationships
game_statuses
game_knowledge
```

---

# 22. Quan hệ DB chính

```text
packs
  1
  │
  N
cards
  │
  └── role_id
          ↓
        roles
          │
          N
          │
          ▼
    role_abilities
          │
          ▼
       abilities
          │
          N
          ▼
   ability_actions
          │
          ▼
       actions
```

Rules:

```text
roles
  ↓
role_rules
  ↓
rules
```

Knowledge:

```text
roles
  ↓
role_knowledge_rules
  ↓
knowledge_rules
```

Transformation:

```text
roles
  ↓
role_transformations
  ↓
transformation_rules
```

Win:

```text
roles
  ↓
role_win_conditions
  ↓
win_conditions
```

---

# 23. Không lưu ảnh trong PostgreSQL

Không lưu:

```text
BYTEA card_image
```

Thay vào đó:

```text
cards.asset_key
```

Ví dụ:

```text
cards/roles/seer.webp
cards/roles/werewolf.webp
cards/roles/witch.webp
```

Object storage:

```text
MinIO
S3
Cloudflare R2
```

Flutter lấy metadata từ server và tải asset.

---

# 24. Java Backend

Đề xuất package:

```text
com.werewolf.game
├── domain
│   ├── card
│   ├── role
│   ├── ability
│   ├── action
│   ├── rule
│   ├── effect
│   ├── knowledge
│   ├── relationship
│   ├── transformation
│   ├── wincondition
│   ├── player
│   └── game
│
├── application
│   ├── game
│   ├── action
│   ├── room
│   └── event
│
├── infrastructure
│   ├── persistence
│   ├── websocket
│   ├── scheduler
│   └── storage
│
└── interfaces
    ├── websocket
    └── http
```

---

# 25. Không để Controller chứa Game Logic

Sai:

```java
@PostMapping("/action")
public void action(...) {
    if (player.getRole() == WITCH) {
        ...
    }
}
```

Đúng:

```java
@PostMapping("/action")
public ActionResponse action(ActionRequest request) {
    return actionService.execute(request);
}
```

Service:

```java
public ActionResult execute(ActionRequest request) {
    Action action = actionRegistry.get(request.actionCode());

    validator.validate(context, action, request);

    EffectResult result =
        effectEngine.execute(context, action, request);

    eventPublisher.publish(result.events());

    return result;
}
```

---

# 26. Action Registry

Có thể dùng:

```java
interface ActionHandler {
    ActionResult execute(
        GameContext context,
        ActionRequest request
    );
}
```

Registry:

```text
ActionRegistry
├── INSPECT_PLAYER
├── PROTECT_PLAYER
├── WOLF_KILL
├── HEAL_PLAYER
├── POISON_PLAYER
└── ...
```

Không cần 35 Role Handler.

---

# 27. Validator

Validator kiểm tra:

```text
Is player alive?
Is correct phase?
Is correct turn?
Does player own ability?
Is target valid?
Does target satisfy role rule?
Has ability been used?
Is target protected/forbidden?
```

Ví dụ:

```java
interface ActionValidator {
    void validate(
        GameContext context,
        ActionDefinition action,
        ActionRequest request
    );
}
```

---

# 28. Effect Engine

Effect phải nhỏ và composable.

Ví dụ:

```text
WOLF_KILL
→ SCHEDULE_DEATH

WITCH_HEAL
→ CANCEL_DEATH

ELDER
→ CONSUME_LIFE

LOVER_DEATH
→ SCHEDULE_OTHER_LOVER_DEATH
```

Không nên có:

```text
WitchEffect.java chứa toàn bộ Witch
```

---

# 29. WebSocket Protocol

Client → Server:

```json
{
  "type": "ACTION",
  "requestId": "uuid",
  "action": "INSPECT_PLAYER",
  "targets": ["player-07"]
}
```

Server → Client:

```json
{
  "type": "GAME_EVENT",
  "event": "PLAYER_DIED",
  "data": {
    "playerId": "player-07"
  }
}
```

Private:

```json
{
  "type": "PRIVATE_EVENT",
  "event": "INSPECTION_RESULT",
  "data": {
    "targetPlayerId": "player-07",
    "result": "WEREWOLF"
  }
}
```

---

# 30. Action Definition gửi cho Flutter

Flutter không hard-code:

```dart
if (role == Role.witch) ...
```

Server gửi:

```json
{
  "availableActions": [
    {
      "code": "POISON_PLAYER",
      "targetType": "PLAYER",
      "targetCount": 1,
      "available": true
    }
  ]
}
```

Flutter render UI dựa trên definition.

Điều này cho phép thêm Role mới mà giảm tối đa việc sửa client.

---

# 31. Flutter Architecture

```text
lib/
├── core/
├── network/
│   ├── websocket/
│   └── api/
│
├── domain/
│   ├── game/
│   ├── player/
│   ├── role/
│   └── action/
│
├── features/
│   ├── lobby/
│   ├── room/
│   ├── game/
│   └── result/
│
└── presentation/
```

Game screen:

```text
GameScreen
├── GameTable
├── PlayerSeat
├── RoleCard
├── ActionPanel
├── GameTimer
├── VotePanel
└── EventLog
```

Main game landscape-first.

Lobby/selection có thể portrait-first.

---

# 32. Reconnect

Client phải có:

```text
playerId
gameId
sessionId
lastReceivedEventId
```

Reconnect:

```text
Flutter
  ↓
RECONNECT(gameId, playerId, lastEventId)
  ↓
Server
  ↓
Snapshot + missing events
  ↓
Flutter rebuild state
```

Không dựa vào local state của Flutter để khôi phục game.

---

# 33. Game Event

GameEvent nên immutable:

```java
record GameEvent(
    UUID eventId,
    UUID gameId,
    long sequence,
    String type,
    Instant createdAt,
    Object payload
) {}
```

Ví dụ:

```text
GAME_STARTED
PHASE_CHANGED
ACTION_AVAILABLE
ACTION_EXECUTED
PLAYER_PROTECTED
PLAYER_POISONED
PLAYER_DIED
ROLE_CHANGED
RELATIONSHIP_CREATED
VOTE_CAST
VOTE_RESOLVED
GAME_OVER
```

---

# 34. Idempotency

Action request cần:

```text
requestId
```

Nếu client retry:

```text
same requestId
```

server không execute hai lần.

Đặc biệt quan trọng với:

```text
POISON
HEAL
WOLF_KILL
VOTE
```

---

# 35. Testing

Mỗi Role phải có scenario test.

Ví dụ:

```text
Scenario:
Wolf attacks Elder first time

Given:
Elder alive
Elder has 2 wolf lives

When:
Wolf kills Elder

Then:
Elder remains alive
Elder lives = 1
```

Witch:

```text
Wolf attacks P01
Witch heals P01

Then:
P01 alive
```

Bodyguard:

```text
Night 1:
protect P01

Night 2:
protect P01

Then:
Night 2 action rejected
```

Lovers:

```text
Cupid links P01 + P02

P01 dies

Then:
P02 scheduled to die
```

Wild Child:

```text
Wild Child selects P02 as idol

P02 dies

Then:
Wild Child alignment = WEREWOLF
```

---

# 36. Definition Test vs Runtime Test

Tách hai loại.

## Definition Test

Kiểm tra catalog:

```text
WITCH
  has HEAL
  has POISON

SEER
  has INSPECT
```

## Runtime Test

Kiểm tra game:

```text
Witch uses heal
Wolf attack resolves
Player survives
```

---

# 37. Deployment

Không gom toàn bộ vào một project deploy duy nhất.

Đề xuất:

```text
VPS 1
├── Java Game Server
└── Docker Compose

VPS 2
├── Node Service
└── Docker Compose

VPS 3
├── PostgreSQL
└── Docker Compose
```

Nếu cần object storage:

```text
VPS / External
└── MinIO
```

Voice:

```text
VPS riêng
└── WebRTC / Voice Server
```

Không cần Gateway ở giai đoạn đầu.

---

# 38. Java Docker Compose

Java VPS:

```text
java-server/
├── Dockerfile
├── compose.yml
└── .env
```

Compose tối thiểu:

```yaml
services:
  game-server:
    build: .
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DATABASE_URL: ${DATABASE_URL}
```

Nếu PostgreSQL ở VPS khác thì không cần chạy PostgreSQL cùng Java.

---

# 39. Node Service

Node không được quyết định game state.

Node chỉ nên phụ trách những thứ cần Node nếu thực sự cần:

```text
- Asset/API helper
- Notification
- Presence
- Voice signaling
- External integrations
```

Game logic vẫn ở Java.

Nếu chưa có nghiệp vụ cần Node thì **không bắt buộc phải tạo Node service ngay**.

---

# 40. PostgreSQL

DB server riêng:

```text
postgres/
├── compose.yml
├── .env
└── data/
```

Production:

```text
PostgreSQL
├── backup
├── WAL
├── monitoring
└── restricted network access
```

Java chỉ mở connection từ IP/VPC được phép.

---

# 41. Roadmap triển khai

## M0 — Scope

Chốt:

```text
- player count
- role list
- phase
- ruleset
- win conditions
```

## M1 — Role Catalog

Tạo:

```text
01-role-catalog.md
```

Không code.

## M2 — Ability Catalog

```text
02-ability-catalog.md
```

Map:

```text
Role → Ability
```

## M3 — Action Catalog

```text
03-action-catalog.md
```

Map:

```text
Ability → Action
```

## M4 — Trigger

```text
04-trigger-catalog.md
```

## M5 — Rule

```text
05-rule-catalog.md
```

## M6 — Effect

```text
06-effect-catalog.md
```

## M7 — Knowledge / Relationship

```text
07-knowledge-catalog.md
08-relationship-catalog.md
```

## M8 — Transformation / Win

```text
09-transformation-catalog.md
10-win-condition-catalog.md
```

## M9 — Game Flow

```text
13-phase-flow.md
```

## M10 — Database

```text
14-database-design.md
```

## M11 — Java Domain

```text
15-java-backend-architecture.md
```

## M12 — Game Engine

Implement:

```text
ActionEngine
RuleEngine
EffectEngine
ResolutionEngine
WinConditionEngine
```

## M13 — WebSocket

```text
16-websocket-protocol.md
```

## M14 — Flutter

```text
17-flutter-client-architecture.md
```

## M15 — Testing

```text
19-test-scenarios.md
```

## M16 — Deployment

```text
20-deployment.md
```

---

# 42. Thứ tự code thực tế

Không nên code theo thứ tự UI → Backend → DB.

Thứ tự khuyến nghị:

```text
1. Role Catalog
        ↓
2. Ability Catalog
        ↓
3. Action Catalog
        ↓
4. Trigger Catalog
        ↓
5. Rule Catalog
        ↓
6. Effect Catalog
        ↓
7. Knowledge / Relationship
        ↓
8. Transformation
        ↓
9. Win Condition
        ↓
10. Game Flow
        ↓
11. PostgreSQL Schema
        ↓
12. Java Domain
        ↓
13. Game Engine
        ↓
14. WebSocket
        ↓
15. Flutter
        ↓
16. Reconnect
        ↓
17. Voice
        ↓
18. Deployment
```

---

# 43. Definition of Done

Không coi một Role là hoàn thành chỉ vì đã có:

```text
Role name
```

Một Role hoàn chỉnh phải có:

```text
[ ] Role definition
[ ] Alignment
[ ] Ability
[ ] Action
[ ] Trigger
[ ] Rule
[ ] Effect
[ ] Knowledge
[ ] Relationship
[ ] Transformation
[ ] Win condition
[ ] Usage limit
[ ] Phase
[ ] Target rules
[ ] Visibility
[ ] Asset
[ ] Runtime tests
```

Những mục không áp dụng ghi:

```text
N/A
```

không được bỏ trống.

---

# 44. Nguyên tắc mở rộng Role mới

Ví dụ thêm:

```text
NEW_ROLE
```

Quy trình:

```text
01-role-catalog.md
       ↓
02-ability-catalog.md
       ↓
03-action-catalog.md
       ↓
05-rule-catalog.md
       ↓
06-effect-catalog.md
       ↓
07-knowledge-catalog.md
       ↓
09-transformation-catalog.md
       ↓
10-win-condition-catalog.md
       ↓
DB seed
       ↓
Runtime tests
```

Nếu Role chỉ dùng các Ability/Action/Effect có sẵn:

**không cần sửa Java engine.**

Nếu xuất hiện mechanic hoàn toàn mới:

```text
New Rule
hoặc
New Effect
hoặc
New Resolution Strategy
```

thì mới mở rộng engine.

---

# 45. Nguyên tắc quan trọng nhất

Toàn bộ hệ thống phải giữ được 5 lớp rõ ràng:

```text
ROLE
"Who can do this?"

ABILITY
"What capability does this role have?"

ACTION
"What can the player request?"

RULE
"When is it allowed / what special rule applies?"

EFFECT
"What actually changes in the game?"
```

Ví dụ:

```text
WITCH
  ↓
POISON ABILITY
  ↓
POISON_PLAYER ACTION
  ↓
CAN_USE_POISON rule
  ↓
POISON / SCHEDULE_DEATH effect
  ↓
GameState
  ↓
PLAYER_DIED event
```

Đây là abstraction chính cần giữ xuyên suốt toàn bộ backend.

---

# 46. Kết luận kiến trúc

Mục tiêu cuối:

```text
                  ┌──────────────┐
                  │ Role Catalog │
                  └──────┬───────┘
                         ↓
                    ┌─────────┐
                    │ Ability │
                    └────┬────┘
                         ↓
                    ┌────────┐
                    │ Action │
                    └───┬────┘
                        ↓
                 ┌─────────────┐
                 │  Validator  │
                 └──────┬──────┘
                        ↓
                ┌──────────────┐
                │ Rule Engine  │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │ Effect Engine│
                └──────┬───────┘
                       ↓
                  GameState
                       ↓
                  GameEvent
                       ↓
             ┌─────────┴─────────┐
             ↓                   ↓
          Flutter             Players
```

**Database lưu definition + runtime state.**

**Java giữ toàn bộ game authority.**

**Flutter chỉ render state và gửi command.**

**Role là data, không phải một đống Java class.**

**Action là command. Rule quyết định command có hợp lệ và xử lý đặc biệt. Effect thay đổi state. Event thông báo state đã thay đổi.**

Đây là nền tảng nên chốt trước khi bắt đầu code Java.
