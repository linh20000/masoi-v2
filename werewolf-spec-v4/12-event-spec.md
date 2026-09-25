# 12 — Event Specification

## 1. Phạm vi và nguyên tắc

Event Card là game-level mechanic, không phải Character Role. Event phải được lưu trong scenario và không được suy diễn từ tên hiển thị.

Blood Moon có nhiều ruleset mâu thuẫn trong source. V4 **không trộn các ruleset**: mỗi ván phải chọn đúng một `variantCode`, lưu cùng `rulesetVersion`, và phát event public khi event được kích hoạt.

## 2. Đánh giá mức độ đầy đủ

Tài liệu trước đây mới xác định được hai hướng luật:

- Official-style/New Moon: nạn nhân của sói bị infection/assimilation, mất special ability và trở thành Villager.
- Advanced/fanmade: có thể tăng số wolf bite, bỏ qua protection/heal hoặc ép wolf internal kill.

Như vậy, tài liệu **chưa implementation-ready** vì còn thiếu:

1. Thời điểm và điều kiện kích hoạt event.
2. Đối tượng bị ảnh hưởng và cách chọn target.
3. Quan hệ giữa infection với protection, healing, Elder và các death trigger.
4. Role/alignment/ability/status nào thay đổi sau infection.
5. Thời điểm transformation và thứ tự với death, relationship, win check.
6. Giới hạn sử dụng, thời hạn và khả năng tái kích hoạt.
7. Public event/private knowledge/audit.
8. Schema dữ liệu, lỗi validation và acceptance tests.
9. Các biến thể advanced chưa có rule cụ thể nên chưa thể triển khai an toàn.

## 3. Khuyến nghị được chọn

V4 chọn variant mặc định:

```yaml
variantCode: BLOOD_MOON_INFECTION
activation: SCENARIO_ENABLED
maxUses: 1
trigger: ON_WOLF_VICTIM_SELECTED
resolutionMode: AFTER_PROTECTION_AND_HEAL
```

Đây là lựa chọn an toàn và dễ kiểm thử nhất: giữ Blood Moon là một event biến đổi trạng thái, không tạo thêm damage/death chain và không phá vỡ các luật phòng thủ hiện có. Các biến thể fanmade chỉ được bổ sung sau khi có đặc tả và acceptance tests riêng.

## 4. Luật chuẩn — `BLOOD_MOON_INFECTION`

### 4.1 Kích hoạt

- Event chỉ hoạt động khi `bloodMoonVariant` được khai báo trong scenario.
- Event được kích hoạt một lần ở đầu ván hoặc tại thời điểm `ON_NIGHT_START` theo scenario; mặc định kích hoạt từ đêm đầu tiên.
- `maxUses: 1`: sau một lần infection thành công, event chuyển sang `CONSUMED` và không chạy lại.
- Nếu không có nạn nhân hợp lệ trong đêm kích hoạt, event vẫn còn hiệu lực cho đêm kế tiếp, trừ khi scenario đặt `expireAfterNight`.
- Server là authority; client không được tự quyết định event đã kích hoạt hay đã tiêu thụ.

### 4.2 Target và điều kiện hợp lệ

Target là nạn nhân của attack chính của phe Sói trong đêm event còn hiệu lực.

Target hợp lệ phải:

```text
- còn sống khi action được freeze;
- bị WOLF_ATTACK chính tạo PendingDeath;
- không phải Werewolf hoặc role đã thuộc phe Sói;
- chưa bị infection trước đó;
- không nằm trong danh sách loại trừ của scenario.
```

Mặc định chỉ có **một target** được infection: target của `WOLF_ATTACK` sau khi áp dụng wolf vote policy. Extra bite, White Wolf kill, Assassin và các death source khác không tạo infection.

### 4.3 Thứ tự resolution

Blood Moon không bypass protection hoặc healing trong variant được chọn. Thứ tự là:

```text
1. Freeze actions
2. Resolve wolf attack
3. Resolve Bodyguard/protection
4. Resolve Witch HEAL/restoration theo healScope
5. Nếu WOLF_ATTACK còn PendingDeath → BLOOD_MOON_INFECTION
6. Hủy PendingDeath do WOLF_ATTACK
7. Transform target
8. Recalculate ability, alignment, knowledge và win condition
9. Phát public/private/audit events
```

Nếu target được bảo vệ hoặc được cứu thành công thì infection **không xảy ra**, event không bị tiêu thụ và `maxUses` không giảm.

### 4.4 Kết quả infection

Khi infection thành công:

| State | Kết quả mặc định |
|---|---|
| `characterRole` | `VILLAGER` |
| `alignment` | `VILLAGE` |
| `alive` | `true` |
| special abilities | Xóa/vô hiệu hóa toàn bộ ability của role cũ |
| active role statuses | Gỡ các status gắn riêng với role cũ nếu không có `preserveStatus` |
| title | Giữ nguyên |
| relationships | Giữ nguyên, trừ khi scenario khai báo loại trừ |
| knowledge đã nhận | Giữ lịch sử knowledge; không cấp knowledge mới của Villager |
| usage history | Giữ audit; các ability cũ không thể dùng lại |

Infection không phải death, không tạo `PLAYER_DEATH_CONFIRMED`, không kích hoạt Hunter, Lovers chain, Wolf Cub, Wild Child hoặc các death trigger khác. Target không hồi sinh vì target chưa chết; `PendingDeath(WOLF_ATTACK)` bị hủy bởi effect của event.

### 4.5 Transformation contract

```yaml
sourceRole: ANY_NON_WOLF_ROLE
trigger: BLOOD_MOON_INFECTION
condition:
  - targetAlive: true
  - pendingDeathCause: WOLF_ATTACK
  - pendingDeathPrevented: false
result:
  role: VILLAGER
  alignment: VILLAGE
  preserveTitle: true
  preserveRelationships: true
  preserveKnowledgeHistory: true
  clearRoleAbilities: true
  clearRoleStatuses: true
  emit: PLAYER_INFECTED
```

Transformation phải được xử lý một lần theo `resolutionId`. Retry hoặc duplicate action không được biến đổi target lần thứ hai.

## 5. Event, visibility và audit

### Public

```text
BLOOD_MOON_STARTED { variantCode, nightNumber }
PLAYER_INFECTED { playerId, publicRoleRevealPolicy }
BLOOD_MOON_CONSUMED { nightNumber }
```

`playerId` và role mới chỉ được công khai nếu scenario đặt `revealRoleOnBloodMoon=true`. Mặc định public chỉ thông báo target bị ảnh hưởng; role cũ, nguyên nhân chi tiết và người đã cứu không được tiết lộ.

### Private

Player bị infection nhận prompt/state update riêng. Knowledge mới phải được lọc theo audience; người chơi khác không tự động biết target đã mất ability hoặc đổi alignment.

### Moderator/audit

Audit bắt buộc ghi:

```text
resolutionId
variantCode
nightNumber
targetId
sourceActionId
pendingDeathId
protectionApplied
healApplied
oldRole
newRole
oldAlignment
newAlignment
consumed
```

## 6. Schema tối thiểu

```yaml
eventCode: BLOOD_MOON
variantCode: BLOOD_MOON_INFECTION
status: ARMED | CONSUMED | EXPIRED | DISABLED
activationNight: 1
maxUses: 1
usesConsumed: 0
trigger: ON_WOLF_VICTIM_SELECTED
resolutionMode: AFTER_PROTECTION_AND_HEAL
excludedRoles: []
preserveTitle: true
preserveRelationships: true
revealRoleOnBloodMoon: false
expireAfterNight: null
```

`eventModifiers` trong `GameState` phải lưu cả `eventCode` và `variantCode`. Bảng `events`/`event_variants` phải tham chiếu variant; không lưu luật Blood Moon bằng boolean đơn lẻ.

## 7. Error và edge cases

- `EVENT_VARIANT_REQUIRED`: scenario bật Blood Moon nhưng không có `variantCode`.
- `EVENT_ALREADY_CONSUMED`: cố xử lý infection sau khi event đã consumed.
- `BLOOD_MOON_TARGET_INVALID`: target không phải nạn nhân của wolf attack chính.
- `BLOOD_MOON_CONFLICTING_VARIANT`: một ván khai báo nhiều variant Blood Moon.
- Nếu target có role miễn infection theo scenario, event không tiêu thụ và resolution ghi `SKIPPED_EXCLUDED_TARGET`.
- Nếu nhiều death source cùng nhắm target, chỉ `WOLF_ATTACK` đủ điều kiện; poison, execution và Assassin vẫn resolve theo luật riêng.
- Nếu target là Lover, relationship vẫn tồn tại; infection không lan sang Lover.
- Nếu target là Wild Child, infection không được coi là idol death và không kích hoạt transformation của Wild Child.
- Nếu target là Father of Werewolves hoặc role có conversion rule, scenario phải khai báo precedence; default Blood Moon chỉ áp dụng sau khi wolf conversion không xảy ra.

## 8. Variant chưa chọn — để dành cho bản sau

Các variant sau **không thuộc default V4** và không được implement bằng cách suy diễn:

- `BLOOD_MOON_EXTRA_BITE`: tăng số wolf attack.
- `BLOOD_MOON_BYPASS_DEFENSE`: bỏ qua protection/heal.
- `BLOOD_MOON_WOLF_INTERNAL_KILL`: ép Sói có internal kill.
- `BLOOD_MOON_MULTI_INFECTION`: infection nhiều target hoặc nhiều đêm.

Mỗi variant phải có riêng: activation, target policy, priority, protection/heal interaction, transformation result, visibility, balance profile và acceptance tests.

## 9. Acceptance tests bắt buộc

1. Blood Moon disabled → wolf attack xử lý như ruleset thường.
2. `BLOOD_MOON_INFECTION` + target được Bodyguard bảo vệ → target sống theo protection, event chưa consumed.
3. `BLOOD_MOON_INFECTION` + Witch HEAL hợp lệ → target sống, không infection, event chưa consumed.
4. Wolf attack không được bảo vệ/cứu → target sống, role thành `VILLAGER`, alignment thành `VILLAGE`, event consumed.
5. Infection không tạo `PLAYER_DEATH_CONFIRMED`, Hunter trigger, Lovers chain hoặc Wolf Cub trigger.
6. Infection xóa ability/status của role cũ nhưng giữ Title, relationship và knowledge history theo default.
7. Extra bite/White Wolf/poison không tự tạo Blood Moon infection.
8. Duplicate resolution/retry không infection target lần hai.
9. Public snapshot không làm lộ role cũ, alignment cũ hoặc người đã cứu nếu scenario không cho phép.
10. Scenario thiếu `variantCode` bị reject trước khi bắt đầu ván.
11. Hai Blood Moon variant trong cùng scenario bị reject.
12. `PLAYER_INFECTED` được phát đúng audience và audit có đủ `resolutionId`, `variantCode`, target, cause và transition.

## 10. Scenario mẫu được khuyến nghị

```yaml
scenarioCode: classic-blood-moon-v4
rulesetVersion: 4.1
bloodMoonVariant: BLOOD_MOON_INFECTION
bloodMoonActivationNight: 1
bloodMoonMaxUses: 1
bloodMoonExcludedRoles: []
bloodMoonRevealRoleOnSuccess: false
bloodMoonPreserveTitle: true
bloodMoonPreserveRelationships: true
bloodMoonExpireAfterNight: null
```

Scenario này là baseline được khuyến nghị để triển khai và cân bằng. Không bật các advanced variant cho đến khi có scenario, resolution matrix và test riêng tương ứng.
