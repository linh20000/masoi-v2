# 22 — Role Implementation Contract

> Tài liệu này mô tả cách chuyển từng role trong `02-role-details/` thành cấu trúc dữ liệu và service thực thi trong Java backend. Đây là contract bắt buộc cho người triển khai: không được viết role logic tách rời khỏi mô hình này.

## 1. Mục tiêu

Role implementation contract có 3 mục đích:

1. Chuyển mô tả nguồn sang model dữ liệu có thể kiểm thử.
2. Giữ `Role → Ability → Action → Validator → Rule → Effect → GameEvent` bất biến.
3. Cho phép thêm role mới mà không sửa engine core.

## 2. Nguyên tắc bắt buộc

### 2.1 Tách rõ layer

- `RoleDefinition`: mô tả vai trò, metadata, sở hữu ability, nhóm, alignment, đòn bẩy, assets.
- `AbilityDefinition`: mô tả năng lực, phạm vi hoạt động, trigger, action tương ứng.
- `ActionDefinition`: command hợp lệ do player gửi server.
- `RuleDefinition`: điều kiện logic, predicate, priority, target filter.
- `EffectDefinition`: mutation lên GameState.
- `GameEvent`: thông điệp tạo ra khi resolution hoàn thành.

Không được cho role class trực tiếp gọi `gameState.setSomething()` mà không đi qua `EffectResolver`.

### 2.2 Role không được lưu là class riêng lẻ

Không tạo kiểu:

```java
class WitchRole extends Role {}
class SeerRole extends Role {}
```

Thay vào đó dùng:

```java
RoleDefinition
AbilityDefinition
ActionDefinition
RuleDefinition
EffectDefinition
```

Từng Role có `roleCode` cố định và được đăng ký trong `RoleCatalog`.

## 3. Mô hình dữ liệu bắt buộc

### 3.1 `RoleDefinition`

```json
{
  "roleCode": "witch",
  "displayName": "Phù thủy",
  "group": "VILLAGE",
  "alignment": "VILLAGE",
  "type": "CHARACTER",
  "capabilities": ["ACTIVE", "LIMITED_USE", "KNOWLEDGE"],
  "defaultVariant": "CLASSIC",
  "assetKey": "witch.card",
  "abilities": ["witch.heal", "witch.poison"],
  "actions": ["witch.heal_target", "witch.poison_target"],
  "triggers": ["on_night_start"],
  "rules": ["witch.heal.once", "witch.poison.once"],
  "knowledge": ["knows_wolf_attack_target"],
  "relationships": [],
  "transformations": [],
  "winConditions": [],
  "statusImmunities": [],
  "source": {
    "sourcePack": "classic",
    "sourceName": "Phù thủy"
  }
}
```

### 3.2 `AbilityDefinition`

```json
{
  "abilityCode": "witch.heal",
  "name": "Bình cứu",
  "activationType": "ACTIVE",
  "ownerRole": "witch",
  "phase": "NIGHT",
  "targetType": "PLAYER",
  "targetCount": 1,
  "usagePolicy": "ONCE_PER_GAME",
  "conditions": [
    "actor.alive == true",
    "actor.phase == NIGHT",
    "target.alive == true"
  ],
  "effects": ["save_player"],
  "triggers": ["after_wolf_attack"],
  "visibility": "PRIVATE",
  "priority": 3000
}
```

### 3.3 `ActionDefinition`

```json
{
  "actionCode": "witch.heal_target",
  "actorRole": "witch",
  "phase": "NIGHT",
  "targetType": "PLAYER",
  "targetCount": 1,
  "requestShape": {
    "actorId": "string",
    "targets": ["string"]
  },
  "validations": [
    "isNightPhase",
    "isActorAlive",
    "isTargetAlive",
    "effectUseRemaining"
  ],
  "priority": 5000,
  "payloadSchema": {
    "additionalProperties": false,
    "required": ["actorId", "targets"]
  }
}
```

### 3.4 `RuleDefinition`

```json
{
  "ruleCode": "witch.heal.once",
  "description": "Phù thủy dùng thuốc cứu tối đa một lần trong game.",
  "type": "USAGE_LIMIT",
  "scope": "PLAYER",
  "predicate": "abilityUsed('witch.heal') == false",
  "priority": 3000,
  "effect": "block_if_used",
  "variantAware": true
}
```

### 3.5 `EffectDefinition`

```json
{
  "effectCode": "save_player",
  "kind": "STATE_MUTATION",
  "description": "Cứu người chơi khỏi pending death của wolf attack.",
  "mutates": ["pendingDeaths", "statuses"],
  "appliesTo": "target",
  "requiresPriority": 5000,
  "canStack": false,
  "publicEvent": "PLAYER_SAVED",
  "privateEvent": "YOU_WERE_SAVED"
}
```

### 3.6 `GameEvent`

```json
{
  "eventCode": "PLAYER_SAVED",
  "eventType": "PUBLIC",
  "phase": "NIGHT_RESOLUTION",
  "serverSequence": 54,
  "payload": {
    "victimId": "p05",
    "cause": "WOLF_ATTACK",
    "source": "witch.heal"
  }
}
```

## 4. Role runtime contract

### 4.1 Contract bắt buộc cho mọi role

Mỗi role implementation phải khai báo:

```java
public interface RoleRuntimeContract {
    String getRoleCode();
    RoleGroup getGroup();
    Alignment getAlignment();
    List<String> getAbilityCodes();
    List<String> getActionCodes();
    List<String> getTriggerCodes();
    List<String> getRuleCodes();
    List<String> getKnowledgeCodes();
    List<String> getStatusImmunities();
    Optional<WinCondition> getWinCondition(GameState state, PlayerState player);
    void validate(GameContext context, ActionRequest request);
    List<Effect> resolve(GameContext context, ActionRequest request);
}
```

### 4.2 Không cho dùng logic hardcoded trong Flutter

Flutter chỉ nhận:

```json
{
  "actionDefinitions": [...],
  "phase": "NIGHT",
  "validTargets": ["p01", "p02"],
  "remainingTime": 30,
  "publicState": {...}
}
```

Flutter không được:

- xác định thắng/thua,
- quyết định ai chết,
- đặt `priority`,
- infer `rule` từ UI state,
- tự tính `pending death`.

## 5. Role registry

### 5.1 `RoleCatalog`

```java
public interface RoleCatalog {
    RoleDefinition getRoleByCode(String roleCode);
    Map<String, RoleDefinition> getAllRoles();
    boolean isKnownRole(String roleCode);
    List<String> getRoleCodesByGroup(RoleGroup group);
}
```

### 5.2 Mỗi role cần có `RoleDefinition` và `RoleRuntimeContract`

```java
public final class RoleRegistry {
    public static final Map<String, RoleDefinition> ROLES = Map.of(
        "witch", WitchDefinition.INSTANCE,
        "seer", SeerDefinition.INSTANCE,
        "werewolf", WerewolfDefinition.INSTANCE,
        "bodyguard", BodyguardDefinition.INSTANCE,
        "hunter", HunterDefinition.INSTANCE,
        "cupid", CupidDefinition.INSTANCE,
        "wolf-cub", WolfCubDefinition.INSTANCE,
        "wild-child", WildChildDefinition.INSTANCE
    );
}
```

## 6. Role execution pipeline

### 6.1 Pipeline bắt buộc

```text
ActionRequest
  ↓
CommandValidation
  ↓
TargetValidation
  ↓
RuleEvaluation
  ↓
ResolutionPlanner
  ↓
EffectResolver
  ↓
GameStateMutation
  ↓
GameEventPublisher
  ↓
KnowledgeFilter
  ↓
ClientBroadcast
```

### 6.2 Mỗi action phải có lifecycle

```text
SUBMITTED
→ VALIDATED
→ ENQUEUED
→ RESOLVABLE
→ RESOLVED
→ EFFECTS_APPLIED
→ EVENTS_PUBLISHED
→ KNOWLEDGE_FILTERED
→ COMPLETE
```

Mỗi lifecycle state phải có `timestamp`, `serverSequence`, `actorId`, `targetIds`, `resolutionId`.

## 7. Bảng mapping bắt buộc cho từng role

Mỗi role khi triển khai phải có file hoặc object dạng sau:

```yaml
roleCode: witch
displayName: Phù thủy
group: VILLAGE
alignment: VILLAGE
defaultVariant: CLASSIC
abilities:
  - code: witch.heal
    activationType: ACTIVE
    phase: NIGHT
    uses: 1
  - code: witch.poison
    activationType: ACTIVE
    phase: NIGHT
    uses: 1
actions:
  - code: witch.heal_target
    targetType: PLAYER
    targetCount: 1
  - code: witch.poison_target
    targetType: PLAYER
    targetCount: 1
rules:
  - code: witch.heal.once
  - code: witch.poison.once
triggerEvents:
  - on_night_start
statusImmunities: []
privateKnowledge:
  - knows_if_wolf_attack_target
winConditions: []
sourceNotes:
  - "Phù thủy có 1 bình cứu và 1 bình độc"
```

## 8. Quy tắc mẫu cho role phổ biến

### 8.1 Witch

```yaml
roleCode: witch
rules:
  - code: witch.heal.once
    description: "Bình cứu chỉ dùng 1 lần trong game"
  - code: witch.poison.once
    description: "Bình độc chỉ dùng 1 lần trong game"
  - code: witch.same_night_dual_use
    description: "Nếu scenario bật dualUse thì có thể dùng cả hai trong cùng đêm"
  - code: witch.heal_scope
    description: "HEAL chỉ cứu pending death do wolf attack khi chưa xác nhận final death"
```

#### Action contract

- `witch.heal_target`: valid khi actor alive, phase NIGHT, target có pending death `WOLF_ATTACK`, target chưa được `SAVE`.
- `witch.poison_target`: valid khi actor alive, phase NIGHT, target alive, actor still has poison charge.
- Nếu target đã death-confirmed thì không healing/poison.

#### Resolve order

```text
wolf attack
→ pending death created
→ heal check
→ poison check
→ final death confirmation
```

### 8.2 Werewolf

```yaml
roleCode: werewolf
rules:
  - code: werewolf.night_attack
    description: "Phe Sói chọn 1 mục tiêu mỗi đêm"
  - code: werewolf.majority_vote
    description: "Nhiều người sói phải đồng thuận hoặc đa số để lấy target"
  - code: werewolf.self_attack_forbidden
    description: "Không chọn tự giết mình"
```

#### Action contract

- `werewolf.select_victim`: target player alive, target count = 1.
- Nếu không có vote đủ, target theo `wolfVotePolicy`.
- Nếu `wolfVotePolicy = majority_tie_no_attack` thì hòa không cắn.

### 8.3 Bodyguard

```yaml
roleCode: bodyguard
rules:
  - code: bodyguard.one_target_per_night
  - code: bodyguard.no_same_target_consecutive_nights
  - code: bodyguard.cannot_protect_after_death
```

#### Action contract

- `bodyguard.protect_player`: target alive, target count = 1.
- Không cho bảo vệ cùng target 2 đêm liền nếu `FORBID_CONSECUTIVE`.
- Nếu target được bảo vệ trước khi pending death xác nhận, pending death bị hủy.

### 8.4 Wild Child

```yaml
roleCode: wild-child
rules:
  - code: wild-child.choose_idol_at_game_start
  - code: wild-child.transform_when_idol_dies
```

#### Resolve order

- Idol được chọn trong `STARTING` hoặc `NIGHT 1` tùy scenario.
- Khi idol chết được xác nhận, role về `WEREWOLF` nếu scenario cho phép.
- Trigger phải chạy sau death chain và trước win check.

## 9. Quy tắc validation bắt buộc cho builder

Khi triển khai role trong Java, builder phải validate các trường sau:

```java
public final class RoleDefinitionValidator {
    public void validate(RoleDefinition role) {
        assertNotBlank(role.getRoleCode());
        assertNotNull(role.getGroup());
        assertNotNull(role.getAlignment());
        assertNotNull(role.getCapabilities());
        assertCapabilitiesMatchProfile(role);
        if (role.requiresActiveAction()) {
            assertNotEmpty(role.getActionCodes());
        }
        if (role.requiresAbility()) {
            assertNotEmpty(role.getAbilities());
        }
        if (role.requiresRuleOrKnowledgeContract()) {
            assertTrue(!role.getRules().isEmpty() || !role.getKnowledgeCodes().isEmpty());
        }
        assertNotNull(role.getSource());
        assertNoDuplicateCodes(role);
    }
}
```

Cấm:

- role thiếu `ruleCode`
- action không khớp với ability
- effect không có `priority`
- event chưa ghi `audience`
- trigger không có `phase`
- targetType không phù hợp với action

## 10. Quy tắc `priority` bắt buộc

Mỗi effect/ability/action phải có `priority` theo registry tại `25-resolution-matrix.md`; file này không định nghĩa một bảng priority riêng:

```text
1000 PRE_ACTION
2000 ACTION_VALIDATION
3000 SPECIAL_ATTACK
4000 PROTECTION
5000 HEAL
6000 DAMAGE
7000 PENDING_DEATH
7500 NON_DEATH_CONVERSION
8000 DEATH_CONFIRMATION
9000 RELATIONSHIP
10000 DEATH_TRIGGER
11000 TRANSFORMATION
12000 KNOWLEDGE_RECALCULATION
13000 WIN_CHECK
```

Cần ưu tiên rõ hơn cho đúng case phức tạp:

- `Protection` < `Heal` < `Damage` < `PendingDeath` < `DeathConfirmation`
- `NonDeathConversion` chạy sau protection/heal nhưng trước `DeathConfirmation`.
- `Relationship` < `DeathTrigger` < `Transformation`.
- `WinCheck` luôn cuối cùng

Không được dùng `if/else` ngẫu nhiên theo order nhúng trong role logic.

## 11. `Knowledge` là state được filter riêng

### 11.1 Quy tắc riêng

```text
Knowledge = recipient-scoped info
Knowledge must never leak through public state or event payloads
```

#### Ví dụ

- `seer.inspect_player` chỉ gửi kết quả cho Tiên tri, không broadcast cho cả phòng.
- `werewolf.know_teammates` chỉ gửi cho thành viên phe Sói.
- `cupid.lovers` chỉ gửi tới hai Lover.

#### Implementation contract

```java
public interface KnowledgeFilter {
    PublicGameState filterPublicState(GameState state);
    PlayerKnowledge filterPrivateKnowledge(PlayerState player, GameState state);
}
```

## 12. `GameState` phải có các section rõ ràng

```java
public class GameState {
    private String gameId;
    private Phase phase;
    private int round;
    private int nightNumber;
    private int dayNumber;
    private Map<String, PlayerState> players;
    private List<PendingAction> pendingActions;
    private List<PendingDeath> pendingDeaths;
    private List<RelationshipState> relationships;
    private List<StatusState> statuses;
    private List<KnowledgeState> knowledge;
    private Map<String, Integer> timers;
    private List<GameEvent> eventLog;
    private WinState winState;
}
```

## 13. `PlayerState` bắt buộc có các field này

```java
public class PlayerState {
    private String playerId;
    private String displayName;
    private String roleCode;
    private String titleCode;
    private String teamAlignment;
    private boolean alive;
    private boolean canVote;
    private boolean canSpeak;
    private boolean actionDisabled;
    private List<String> statuses;
    private List<String> knowledgeIds;
    private List<String> relationshipIds;
    private Map<String, Integer> usageCounter;
}
```

## 14. `ActionRequest` và `ActionResult` JSON shape

### 14.1 Input

```json
{
  "actionCode": "werewolf.select_victim",
  "actorId": "p03",
  "targets": ["p08"],
  "payload": {},
  "clientRequestId": "8d57f9d5-4dd8-47f4-a9bd-6a67a5dc72bb",
  "phase": "NIGHT",
  "submittedAt": "2026-09-25T12:00:00Z"
}
```

### 14.2 Output

```json
{
  "clientRequestId": "8d57f9d5-4dd8-47f4-a9bd-6a67a5dc72bb",
  "status": "VALIDATED",
  "serverSequence": 21,
  "eventCode": "ACTION_ACCEPTED",
  "publicMessage": null,
  "privateKnowledge": null,
  "errors": []
}
```

## 15. Event output contract

Mỗi event phải có:

```json
{
  "eventCode": "PLAYER_DIED",
  "phase": "NIGHT_RESOLUTION",
  "serverSequence": 62,
  "audience": "PUBLIC",
  "actorId": null,
  "targetId": "p08",
  "payload": {
    "reason": "Bị Sói cắn",
    "role": "bodyguard"
  }
}
```

Public `GameEvent` không được thiếu:

- `eventCode`
- `phase`
- `serverSequence`
- `audience`
- `payload` theo schema transport

`cause`, `variant`, `priority`, actor/target detail và role detail là audit fields. Chúng bắt buộc trong `AuditEvent`, nhưng chỉ xuất hiện trong public event khi scenario cho phép hoặc trong audience `MODERATOR`.

## 16. Audit log bắt buộc

Mỗi effect và mỗi action phải có `auditEntry`:

```json
{
  "auditId": "a-001",
  "gameId": "g-101",
  "resolutionId": "r-002",
  "actorId": "p03",
  "targetId": "p08",
  "actionCode": "werewolf.select_victim",
  "effectCode": "schedule_pending_death",
  "cause": "WOLF_ATTACK",
  "phase": "NIGHT_RESOLUTION",
  "serverSequence": 58,
  "priority": 6000,
  "variant": "CLASSIC",
  "createdAt": "2026-09-25T12:00:01Z"
}
```

## 17. Ruleset versioning

Mỗi game phải ghi:

```yaml
rulesetVersion: 4.1
variants:
  wolfDog: VILLAGE_LOCKED
  bloodMoon: DISABLED
  voteTiePolicy: SCAPEGOAT_IF_PRESENT_ELSE_NO_EXECUTION
```

Các role không có `variantCode` phải dùng default variant của ruleset; không được suy diễn biến thể khi runtime.

## 18. Acceptance criteria cho mỗi role

Một role được coi là implementation-ready khi thỏa tất cả:

1. Có `RoleDefinition`.
2. Có `AbilityDefinition` mạnh nhất 1–n.
3. Có `ActionDefinition` tương ứng.
4. Có `RuleDefinition` đủ để validate.
5. Có `EffectDefinition` rõ ràng.
6. Có `KnowledgeFilter` nếu có private info.
7. Có test cho mỗi `action` và mỗi `death trigger`.
8. Có `variantCode` nếu role có nhiều cách chơi.
9. Có `priority` trong engine.
10. Có audit log cho mỗi effect.

## 19. Role checklist mẫu

### Example: Witch

```yaml
roleCode: witch
status: READY
definitions:
  - roleDefinition: yes
  - abilityDefinitions: [witch.heal, witch.poison]
  - actionDefinitions: [witch.heal_target, witch.poison_target]
  - ruleDefinitions: [witch.heal.once, witch.poison.once]
  - effectDefinitions: [save_player, poison_player]
  - knowledgeFilter: yes
  - audit: yes
  - tests: [wolf_attack_plus_heal, poison_and_guard, dual_use_when_enabled]
```

### Example: Werewolf

```yaml
roleCode: werewolf
status: READY
definitions:
  - roleDefinition: yes
  - abilityDefinitions: [werewolf.attack]
  - actionDefinitions: [werewolf.select_victim]
  - ruleDefinitions: [werewolf.majority_vote, werewolf.self_attack_forbidden]
  - effectDefinitions: [schedule_pending_death]
  - knowledgeFilter: yes
  - audit: yes
  - tests: [wolf_attack, vote_hang, tie_policy]
```

## 20. Kết luận

File này là “contract thực thi” của tài liệu luật. Nếu một role không có đầy đủ các phần trên, nó chưa đủ để đưa vào backend hoặc test automation.

Mỗi role, mỗi action, mỗi effect và mỗi trigger phải đi qua cùng một pipeline chung:

```text
RoleDefinition → Ability → Action → Validator → Rule → Effect → GameState → GameEvent → KnowledgeFilter → Audit
```

Đây là đường thẳng mà engine Java phải phục tùng. Khi mọi role tuân contract này, việc thêm role mới sẽ trở nên modular, có thể test và không phá vỡ logic cốt lõi của game.
