# Document Consistency Log — V4

Ngày rà soát: 2026-09-25  
Phạm vi: `werewolf-game-spec.md`, toàn bộ `werewolf-spec-v4/**/*.md`, gồm role details, sources và audit hiện có.

## Trạng thái sau khi áp dụng khuyến nghị

Đã cập nhật các tài liệu canonical để giải quyết các conflict DOC-001 đến DOC-013:

- **Đã xử lý ở cấp tài liệu:** DOC-001, DOC-002, DOC-003, DOC-004, DOC-005, DOC-006, DOC-007, DOC-008, DOC-009, DOC-010, DOC-011, DOC-012, DOC-013.
- **Đã bổ sung:** DOC-014 — Role activation/call flow được chuẩn hóa tại `37-role-lifecycle-catalog.md` dựa trên `werewolf_role_lifecycle_catalog.md`.
- **Còn cần kiểm chứng bằng code/test:** schema validator, action registry completeness, DB migration/foreign keys, resolution integration tests và reconnect contract tests.
- **Quyết định canonical đã chốt:**
  - Blood Moon là `NON_DEATH_CONVERSION` trước `DEATH_CONFIRMATION`.
  - Angel dùng `ANGEL_FIRST_OBJECTIVE`.
  - Win priority dùng `WEREWOLF`, không dùng `WOLVES`.
  - WebSocket dùng `clientRequestId`, `serverSequence`, `lastSequence`; audit fields không bắt buộc trong public event.
  - Idempotency dùng `(game_id, player_id, client_request_id)`.
  - Reconnect quá cũ fallback bằng snapshot; `SEQUENCE_TOO_OLD` chỉ dành cho replay API bắt buộc lịch sử.
  - `roleDeck`, `startPolicy`, `timeoutPolicy` là field canonical của scenario.
  - Priority registry duy nhất nằm ở `25-resolution-matrix.md`.

### DOC-014 — Role activation và thứ tự gọi chưa có canonical contract

- **Nguồn bổ sung:** `werewolf_role_lifecycle_catalog.md`.
- **Đã xử lý:** tạo `37-role-lifecycle-catalog.md` với lifecycle types, role activation matrix, role turn lifecycle, first-night order, normal-night order, day/event queue, scheduler contract và normalization mapping.
- **Điểm được normalize:** `defender → bodyguard`, `wolf_father → father-of-werewolves`,
  `big_bad_wolf → big-bad-wolf`, `piper → pied-piper`; Blood Moon vẫn là event modifier.
- **Điểm giữ dưới dạng variant:** Hunter night mark vs death reaction, White Werewolf alternating-night, Wolf-Dog activation và Actor duration.
- **Trạng thái:** đã giải quyết ở cấp tài liệu; chưa cần implement trong phạm vi hiện tại.

## Kết luận tổng quan

Bộ tài liệu đã được đồng bộ ở cấp contract, bao gồm cả role activation/call flow. Vì phạm vi hiện tại là đánh giá tài liệu, các validator/fixture/test runtime vẫn được ghi nhận là bước sau, không phải issue tài liệu chưa giải quyết.

Mức độ:

- **P0 — chặn triển khai:** có thể làm backend/engine hiểu khác nhau hoặc sinh state sai.
- **P1 — cần chốt trước sprint đầu:** chưa chắc gây sai runtime ngay nhưng làm contract không ổn định.
- **P2 — cần dọn trước khi đóng tài liệu:** alias, typo, thiếu liên kết hoặc thiếu dữ liệu kiểm thử.

## P0 — Conflict cần xử lý trước

### DOC-001 — Blood Moon có hai vị trí trong resolution pipeline

- **Evidence:**
  - `12-event-spec.md:68-83`: Blood Moon xử lý sau protection/heal, hủy `PendingDeath`, rồi transform target còn sống.
  - `13-phase-flow-spec.md:7-26`: xác nhận primary death ở bước 11, death trigger ở bước 13, Blood Moon transformation ở bước 14.
  - `25-resolution-matrix.md:25-34`: mọi transformation chạy sau death trigger.
- **Vấn đề:** nếu dùng pipeline 13/25, target Blood Moon sẽ chết trước khi event có cơ hội hủy pending death; nếu dùng 12 thì Blood Moon là một exception chạy trước death confirmation. Hai engine khác nhau sẽ cho kết quả khác nhau về death trigger, Lovers, Wolf Cub và win check.
- **Lý do:** Blood Moon được mô tả là transformation không gây chết, trong khi pipeline tổng quát hiện giả định transformation xảy ra sau death confirmation.
- **RCM:** chốt Blood Moon là **pre-death resolution exception**. Đưa explicit bước `Resolve non-death conversions (Blood Moon, Father Wolf nếu được cấu hình)` sau heal và trước death confirmation; giữ transformation thông thường sau death trigger. Ghi exception này trực tiếp vào `13`, `25` và acceptance tests của `21`.

### DOC-002 — Win code của Angel bị đổi nhưng chưa đồng bộ toàn bộ tài liệu

- **Evidence:**
  - `10-win-condition-spec.md:11-16`: canonical là `ANGEL_FIRST_OBJECTIVE`, cấm dùng `ANGEL_FIRST_NIGHT_DEATH`.
  - `27-win-condition-predicates.md:30-38`: vẫn định nghĩa `ANGEL_FIRST_NIGHT_DEATH`.
  - `21-complete-rules-and-acceptance-tests.md:230-238`: vẫn dùng `ANGEL_FIRST_NIGHT_DEATH`.
- **Vấn đề:** seed/catalog/test có thể tạo ra hai win code cho cùng một điều kiện; priority lookup có thể không match predicate.
- **Lý do:** phần canonical code đã được cập nhật nhưng predicate và acceptance test còn sót tên cũ.
- **RCM:** dùng duy nhất `ANGEL_FIRST_OBJECTIVE`; cập nhật predicate thành hai nhánh `FIRST_NIGHT_WOLF_ATTACK` hoặc `FIRST_DAY_EXECUTION`, cập nhật `21` và mọi fixture. Nếu cần tương thích dữ liệu cũ, chỉ khai báo alias migration, không để alias xuất hiện trong runtime contract mới.

### DOC-003 — Win priority dùng hai mã phe Sói khác nhau

- **Evidence:**
  - `10-win-condition-spec.md:21`, `27-win-condition-predicates.md:18-24`: dùng `WEREWOLF`.
  - `21-complete-rules-and-acceptance-tests.md:317`: scenario mẫu dùng `WOLVES`.
- **Vấn đề:** `winPriority` từ scenario không map được tới canonical win condition `WEREWOLF_DOMINATION` nếu parser phân biệt code.
- **Lý do:** `WOLVES` là tên phe/group cũ, còn V4 đã chuẩn hóa code điều kiện thắng là `WEREWOLF`.
- **RCM:** chọn `WEREWOLF` làm enum duy nhất trong `winPriority`; sửa scenario mẫu và thêm schema validation reject unknown priority code.

### DOC-004 — Transport contract canonical bị phá bởi implementation contract

- **Evidence:**
  - `30-websocket-json-schema.md:13,28,43-61` dùng `clientRequestId`, `serverSequence`, `lastSequence`.
  - `16-websocket-protocol.md:25-35` cấm alias `requestId`, `sequence`.
  - `22-role-implementation-contract.md:551-553,569-592` vẫn sample `requestId`, `sequence` và bắt buộc event field `sequence`, `targetId/actorId`, `cause`, `priority`.
  - `30-websocket-json-schema.md:51` lại cho phép public `PLAYER_DIED` không có `cause` mặc định và schema event không yêu cầu `priority`.
- **Vấn đề:** client/server có thể serialize cùng một event theo hai JSON shape khác nhau; public event không thể vừa thiếu cause vừa thỏa contract bắt buộc cause.
- **Lý do:** `22` chứa contract cũ chưa được migrate sau khi `30` trở thành canonical transport.
- **RCM:** đặt `30` làm transport authority tuyệt đối. Trong `22`, đổi toàn bộ sample/field sang `serverSequence` và `clientRequestId`; tách `AuditEvent` nội bộ khỏi `GameEvent` public. `cause`, `priority`, role cũ và source detail chỉ nằm trong moderator/audit payload hoặc được reveal theo scenario.

### DOC-005 — Idempotency và DDL không cùng một khóa/đủ bảng

- **Evidence:**
  - `14-database-spec.md:13,27`: yêu cầu bảng `game_idempotency_keys`, unique `(game_id, player_id, client_request_id)`.
  - `16-websocket-protocol.md:39`: phạm vi idempotency là `(gameId, playerId)`.
  - `32-database-ddl.md:45-55,109-110`: `game_actions` chỉ unique `(game_id, client_request_id)` và không tạo `game_idempotency_keys`.
  - `31-reconnect-and-idempotency.md:7-9`: nói lưu theo `clientRequestId` nhưng không chốt composite key.
- **Vấn đề:** cùng một client request id ở hai player có thể bị coi là duplicate; hoặc implementation phải tự chọn giữa `game_actions` và bảng idempotency riêng.
- **Lý do:** persistence model được mở rộng ở `14/31` nhưng DDL chưa cập nhật tương ứng.
- **RCM:** chọn một model duy nhất: tạo `game_idempotency_keys` đúng schema trong `14`, unique `(game_id, player_id, client_request_id)`, hash request và reference tới result; `game_actions` giữ `action_id` và có foreign key tới idempotency record. Cập nhật `32` và acceptance test duplicate.

### DOC-006 — Reconnect quá cũ vừa fallback snapshot vừa reject lỗi

- **Evidence:**
  - `14-database-spec.md:23`, `31-reconnect-and-idempotency.md:26`: cursor hết retention thì gửi snapshot.
  - `29-error-catalog.md:24` có `SEQUENCE_TOO_OLD`.
  - `31-reconnect-and-idempotency.md:37`: `lastSequence` quá cũ thì reject `SEQUENCE_TOO_OLD`.
- **Vấn đề:** cùng một reconnect request có thể nhận snapshot hoặc error tùy service/module.
- **Lý do:** error code legacy được giữ lại nhưng rule reconnect mới đã chọn snapshot fallback.
- **RCM:** với flow reconnect bình thường, cursor quá cũ luôn `SNAPSHOT + stream mới`; chỉ dùng `SEQUENCE_TOO_OLD` cho API replay bắt buộc event history hoặc request sai policy. Ghi rõ scope của error trong `29` và xóa câu reject khỏi `31`.

## P1 — Thiếu hoặc không đồng bộ, cần chốt trước implementation

### DOC-007 — Scenario schema dùng `requiredRoles` nhưng bắt buộc `roleDeck`, thiếu field bắt buộc trong example

- **Evidence:** `23-scenario-schema.md:12-21` có `requiredRoles`; `23:59-66` bắt buộc `roleDeck`, `startPolicy`, `timeoutPolicy`; example không có ba field này.
- **Vấn đề:** validator không biết `requiredRoles` là input chính hay chỉ là shorthand; example được gọi là scenario mẫu nhưng không implementation-ready.
- **RCM:** chọn `roleDeck` là canonical, biểu diễn count rõ ràng; nếu giữ `requiredRoles` thì khai báo là deprecated shorthand và normalize trước validation. Bổ sung `startPolicy` và `timeoutPolicy` vào example; thống nhất `variants` object với `variantCodes` list ở `21/22` bằng một schema duy nhất.

### DOC-008 — Resolution priority có nhiều bảng số và không nhất quán với thứ tự văn bản

- **Evidence:**
  - `25-resolution-matrix.md:5-23`: `PROTECTION=4000`, `HEAL=5000`, `DAMAGE=6000`, `DEATH_CONFIRMATION=8000`, `TRANSFORMATION=11000`.
  - `22-role-implementation-contract.md:442-461`: `PROTECTION=3000`, `HEAL=4000`, `DEATH=6000`, đồng thời ghi `Relationship > Transformation`.
  - `21-complete-rules-and-acceptance-tests.md:99-116`: có pipeline riêng nhưng không map đầy đủ vào cùng numeric registry.
- **Vấn đề:** effect cùng loại có thể resolve khác thứ tự; `priority` được lưu trong audit nhưng không có nghĩa duy nhất.
- **RCM:** lấy `25` làm registry priority canonical, đưa bảng số vào một file contract duy nhất hoặc thêm `resolution-stage` enum. Sửa `22` để tham chiếu registry, không tự định nghĩa bảng thứ hai; bổ sung các exception Blood Moon/Father Wolf/Devoted Servant bằng stage rõ ràng.

### DOC-009 — Action registry chưa thực sự là registry và có mã action sai

- **Evidence:**
  - `03-action-spec.md:3` tuyên bố `24-action-registry.md` là nguồn duy nhất.
  - `24-action-registry.md:5-28` chỉ có một action definition mẫu, chưa có danh sách definition đầy đủ.
  - `24:55` ghi `ravens.curse_target`, còn `03:44` ghi `raven.curse_target`.
  - `03:49` dùng `knight.check_wolf`, nhưng canonical catalog chỉ có `rusty-sword-knight` trong `01` và không có role detail `knight`.
  - `03:37` dùng `father_wolf.convert_victim`, trong khi role code canonical là `father-of-werewolves`.
- **Vấn đề:** client action availability, server validator và role mapping không thể sinh từ cùng một nguồn; một số action trỏ tới role không tồn tại.
- **RCM:** tạo bảng registry đầy đủ cho mọi action, mỗi action có `actionCode`, owner role/ability, phase, target, validation, priority, effects và event. Chuẩn hóa namespace theo role code canonical; đổi `knight` thành `rusty-sword-knight` nếu đây là cùng role, hoặc thêm một role riêng có spec đầy đủ. Thêm CI check action owner tồn tại và action code không trùng.

### DOC-010 — Role catalog nói 43 role nhưng contract validator không hỗ trợ passive/knowledge-only role

- **Evidence:**
  - Role details như `villager.md:11`, `elder.md:11`, `three-brothers.md:11` ghi không có action hoặc chỉ knowledge/passive.
  - `22-role-implementation-contract.md:437-440` yêu cầu validator `assertNotEmpty(role.getAbilities())`, `assertNotEmpty(role.getActionCodes())`, `assertNotEmpty(role.getRules())`.
  - `02-ability-spec.md:6-14` cho phép `PASSIVE`, `KNOWLEDGE`, `REACTIVE`.
- **Vấn đề:** các role hợp lệ theo catalog sẽ bị validator đánh dấu invalid dù không có active action.
- **RCM:** validator chỉ bắt buộc `abilities/actions/rules` theo capability profile: role passive có thể có action list rỗng nhưng phải có passive rule; role knowledge-only phải có knowledge contract. Thêm `applicability`/`N/A` rõ ràng vào role audit matrix, không dùng non-empty chung cho mọi role.

## P2 — Dọn alias/độ chính xác tài liệu

### DOC-011 — Canonical database name và DDL name khác nhau

- **Evidence:** `14-database-spec.md:21` dùng `server_sequence`; `32-database-ddl.md:36-42` dùng cột `sequence`; protocol dùng `serverSequence`.
- **RCM:** chốt convention: transport `serverSequence`, DB `server_sequence`, domain `serverSequence`; cập nhật DDL hoặc mapping document, không dùng `sequence` trần trong public contract.

### DOC-012 — Spec cũ vẫn có protocol/action/win aliases dễ bị đọc nhầm là canonical

- **Evidence:** `werewolf-game-spec.md:1288` dùng `requestId`/`action`; `:1409` dùng `lastEventId`; `:1461` dùng `requestId`; `:742` dùng `ANGEL_FIRST_NIGHT_DEATH`; các mã uppercase legacy vẫn xuất hiện ở catalog cũ.
- **RCM:** giữ file cũ làm historical source nhưng thêm banner `LEGACY / NON-CANONICAL` ở đầu file và link tới V4; không dùng file này để generate seed, DTO hoặc test.

### DOC-013 — Status catalog chưa hoàn toàn đồng nhất

- **Evidence:** `11-status-spec.md:5-20` có `HOMELESS`, `CURSED`, `REVEALED`, `EXTRA_WOLF_LIFE`; `28-status-lifecycle.md:44-55` không liệt kê các status này.
- **RCM:** dùng `11` làm canonical catalog, đưa toàn bộ status vào `28` kèm duration, blocks, visibility và death persistence; hoặc đánh dấu rõ status là derived state không thuộc lifecycle catalog.

## Các điểm đã kiểm tra nhưng không coi là conflict

- 43 role và 43 role-detail files khớp về số lượng.
- Blood Moon là Event, Lovers là Relationship, Sheriff/Police là Title: các ranh giới này nhất quán trong V4.
- `16-websocket-protocol.md` tự nhận là legacy alias và trỏ về `30`; việc giữ file không phải conflict nếu không thêm field mới vào đó.
- `werewolf-spec-v4/05-audit/review-report.md` đã ghi Wolf-Dog, Blood Moon, priority và runtime persistence là quyết định còn mở; các mục đó là gap có chủ ý, không phải bằng chứng rằng nguồn đã chốt.

## Thứ tự giải quyết khuyến nghị

1. Chốt resolution pipeline và exception Blood Moon (DOC-001, DOC-008).
2. Chốt canonical enum/code: Angel, Werewolf priority, role/action namespace (DOC-002, DOC-003, DOC-009).
3. Chốt transport + audit/public event split (DOC-004).
4. Chốt persistence/idempotency/reconnect (DOC-005, DOC-006, DOC-011).
5. Sửa scenario schema và tạo một scenario fixture pass validation (DOC-007).
6. Nới role validator cho passive/knowledge-only role và cập nhật role audit matrix (DOC-010).
7. Đánh dấu spec cũ là legacy và đồng bộ status catalog (DOC-012, DOC-013).

## Definition of resolved

Một mục chỉ được coi là đã giải quyết khi:

1. Có một file canonical duy nhất định nghĩa rule/schema/code.
2. Các file tham chiếu không còn định nghĩa phiên bản khác.
3. Có validator hoặc test bắt lỗi regression.
4. Scenario mẫu pass schema validation và có acceptance test tương ứng.
