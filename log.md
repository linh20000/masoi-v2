# Audit Log — Rà soát tài liệu `linh20000/masoi-v2`

- **Ngày rà soát:** 2026-09-25
- **Phạm vi:** `werewolf-game-spec.md`, `werewolf-spec-v4/00–36`, `02-role-details/`, `03-non-role/`, `05-audit/`, `sources/` và các tài liệu contract liên quan.
- **Mục tiêu:** ghi nhận điểm không phù hợp, tài liệu không đồng bộ và conflict cần xử lý trước khi implementation.
- **Quy ước mức độ:**
  - **P0 — Blocker:** có thể làm client/server xử lý khác nhau hoặc làm sai game state.
  - **P1 — High:** cần chốt trước khi triển khai feature tương ứng.
  - **P2 — Medium:** không chặn toàn hệ thống nhưng gây khó hiểu, khó test hoặc khó bảo trì.
  - **P3 — Low:** vấn đề biên tập, inventory hoặc tài liệu hóa.

> `00-overview.md` tuyên bố khi source mâu thuẫn phải ghi vào audit và không tự phát minh luật. Các mục có đề xuất bên dưới là **khuyến nghị chuẩn hóa**, chưa được xem là luật game đã được product owner phê duyệt.

---

## 1. Tóm tắt thống kê

| Nhóm | Số lượng |
|---|---:|
| Conflict trực tiếp giữa các tài liệu | 10 |
| Điểm chưa phù hợp/chưa implementation-ready | 10 |
| Vấn đề inventory/truy vết tài liệu | 4 |
| **Tổng findings** | **24** |
| P0 | 3 |
| P1 | 12 |
| P2 | 7 |
| P3 | 2 |

---

## 2. Conflict trực tiếp

### C-01 — WebSocket request contract không thống nhất — **P0**

**Nguồn:** `16-websocket-protocol.md` §Client → Server; `30-websocket-json-schema.md` §1; `03-action-spec.md` §2.

- File 16 dùng `type: ACTION`, field `requestId`, `action`.
- File 30 dùng `type: ACTION_REQUEST`, field `clientRequestId`, `actionCode`.
- File 03 dùng `actionCode` và `clientRequestId` nhưng không mô tả `gameId`, `submittedAt` như file 30.
- File 16 liệt kê message `VOTE`, trong khi file 30 mô hình hóa vote như action/request riêng.

**Rủi ro:** Flutter, WebSocket handler và idempotency store có thể dùng tên field khác nhau.

**Khuyến nghị:** chọn file 30 làm canonical transport contract; chuẩn hóa tất cả request thành `ACTION_REQUEST`, dùng `clientRequestId`, `actionCode`, `gameId`, `playerId`, `targets`, `payload`, `submittedAt`. Nếu vẫn cần alias legacy, ghi rõ version và thời hạn loại bỏ.

---

### C-02 — WebSocket event/sequence/ACK không thống nhất — **P0**

**Nguồn:** `16-websocket-protocol.md` §Server → Client; `30-websocket-json-schema.md` §3–5; `31-reconnect-and-idempotency.md`.

- File 16 dùng `event`, `sequence`, `visibility`, `EVENT_ACK`.
- File 30 dùng `eventCode`, `serverSequence`, `audience`, `EVENT_ACK` nhưng ACK lại gửi `serverSequence`.
- File 31 dùng `lastSequence`, `serverSequence` và replay “events after last_sequence”.

**Rủi ro:** reconnect/replay có thể bỏ sót hoặc phát lại event; private audience có thể được xử lý khác nhau.

**Khuyến nghị:** canonicalize thành `eventCode`, `serverSequence`, `audience`, `clientRequestId`/`actionId`; dùng `lastSequence` trong reconnect và `serverSequence` trong event/ACK. Cập nhật file 16 hoặc đánh dấu file này là legacy.

---

### C-03 — Action code naming bị chia thành nhiều namespace — **P0**

**Nguồn:** `03-action-spec.md` §3; `24-action-registry.md` §1–3; `16-websocket-protocol.md`; `30-websocket-json-schema.md`.

Ví dụ cùng ý nghĩa nhưng khác code:

| Ý nghĩa | File 03 | File 24 | File 30 example |
|---|---|---|---|
| Sói chọn nạn nhân | `WOLF_SELECT_VICTIM` | `werewolf.select_victim` | `seer.inspect_player` |
| Tiên tri soi | `INSPECT_PLAYER` | `seer.inspect_player` | `seer.inspect_player` |
| Phù thủy cứu | `HEAL_WOLF_VICTIM` | `witch.heal_target` | chưa nêu |
| Vote | `VOTE_EXECUTION` | `vote.execution` | chưa nêu |

**Rủi ro:** registry, client action panel, persistence và test không thể dùng chung ID bất biến.

**Khuyến nghị:** chọn một format duy nhất, khuyến nghị namespaced lowercase (`werewolf.select_victim`, `seer.inspect_player`). Tạo bảng alias migration nếu đã có implementation. `03-action-spec.md` phải tham chiếu registry thay vì duy trì catalog riêng.

---

### C-04 — Thứ tự resolution của transformation và final death bị đảo — **P0**

**Nguồn:** `13-phase-flow-spec.md` §Night resolution; `21-complete-rules-and-acceptance-tests.md` §5; `25-resolution-matrix.md` §3.5–3.6.

- File 13: `scheduled deaths → relationship propagation → transformations → final deaths → win check`.
- File 21: `scheduled deaths → relationship propagation → death triggers → transformations → ... → win check`.
- File 25: transformation sau relationship death và trước win check, nhưng không chốt rõ final death.

**Rủi ro:** Wild Child, Devoted Servant, Lovers, Father conversion và death-trigger có thể cho kết quả khác nhau tùy engine.

**Khuyến nghị:** dùng một pipeline canonical duy nhất trong file 21; tách rõ `PendingDeath`, `PLAYER_DEATH_CONFIRMED`, death triggers, transformation và win check. Không transform sau khi đã chốt win; không dùng “final deaths” mơ hồ nếu chưa định nghĩa event boundary.

---

### C-05 — Angel dùng nhiều mã điều kiện thắng — **P1**

**Nguồn:** `10-win-condition-spec.md` §Core; `21-complete-rules-and-acceptance-tests.md` §8; `27-win-condition-predicates.md` §3.1; `werewolf-game-spec.md` §14.

- `ANGEL_FIRST_OBJECTIVE`
- `ANGEL_FIRST_NIGHT_DEATH`
- Source mô tả được thắng khi bị Sói cắn đêm đầu **hoặc** bị treo cổ sáng đầu.

**Rủi ro:** predicate và database code không match; có thể bỏ sót một objective hợp lệ.

**Khuyến nghị:** dùng `ANGEL_FIRST_OBJECTIVE` làm code tổng quát, với predicate khai báo rõ `FIRST_NIGHT_WOLF_ATTACK` hoặc `FIRST_DAY_EXECUTION`. Nếu muốn một code duy nhất, đổi toàn bộ sang `ANGEL_FIRST_OBJECTIVE` và cập nhật acceptance tests.

---

### C-06 — Vote policy và complete rules có khác biệt về SILENCED — **P1**

**Nguồn:** `21-complete-rules-and-acceptance-tests.md` §7.1; `26-vote-policy.md` §2.

- File 21: player `SILENCED` vẫn được vote nếu không có `VOTE_DISABLED`.
- File 26 viết “người chết và bị SILENCED không được vote nếu `voteDisabled`”, câu này có thể hiểu SILENCED mặc định bị cấm vote hoặc chỉ bị cấm khi có flag.

**Rủi ro:** Pharmacist/Sedative và status lifecycle cho kết quả không deterministic.

**Khuyến nghị:** ghi rõ policy canonical: `SILENCED` chỉ chặn nói/chat; `VOTE_DISABLED` mới chặn vote. Bổ sung test cho cả hai status.

---

### C-07 — Status catalog và status lifecycle không cùng một danh sách — **P1**

**Nguồn:** `11-status-spec.md` §Status catalog; `28-status-lifecycle.md` §4.

- File 11 có `ALIVE`, `DEAD`, `CURSED`, `REVEALED`, `EXTRA_WOLF_LIFE`, `HOMELESS`, `HYPNOTIZED`.
- File 28 có `CHARMED`, `HUNTER_MARKED`, `THIEF_LOCKED`, `TRANSFORMED` nhưng thiếu một số status của file 11.
- File 28 dùng `DISABLED` trong phần mở đầu nhưng không có status code canonical tương ứng.

**Rủi ro:** client không biết status nào hợp lệ; resolver không thống nhất expiry/stack/visibility.

**Khuyến nghị:** tạo một catalog duy nhất, mỗi status phải có `statusCode`, owner/source, duration, stack policy, removable, blocks, visibility. `ALIVE/DEAD` nên được xác định là lifecycle state hoặc status, không dùng lẫn hai mô hình.

---

### C-08 — Wolf self-kill trái ngược giữa source và action registry — **P1**

**Nguồn:** `sources/SOURCE_pack.md` §I.2; `24-action-registry.md` action `werewolf.select_victim`; `21-complete-rules-and-acceptance-tests.md` §6.1.

- Source cho phép Sói “có thể ... tự tàn sát lẫn nhau”.
- Registry đặt `allowSelf: false`.
- Complete rules không mô tả rõ self-target cho wolf attack.

**Rủi ro:** thay đổi đáng kể balance và tương tác White Wolf/Wolf Brothers.

**Khuyến nghị:** giữ `allowSelf: false` làm default an toàn; nếu pack cần self-kill, phải tạo variant riêng (`WOLF_SELF_TARGET`) và chốt target policy, win/death chain, knowledge và test.

---

### C-09 — Wolf Cub “cắn hai người” nhưng engine mô hình hóa “một extra bite” — **P1**

**Nguồn:** `sources/SOURCE_pack.md` §I.2; `04-trigger-spec.md`; `21-complete-rules-and-acceptance-tests.md` §6.1 và acceptance test; `03-action-spec.md` `EXTRA_WOLF_KILL`.

- Source nói đêm kế tiếp Sói được cắn 2 người liên tục.
- Complete rules nói tạo đúng một `extra bite`; điều này có thể nghĩa là thêm một mục tiêu ngoài attack chính, nhưng chưa ghi rõ.

**Rủi ro:** tổng số nạn nhân là 1 hay 2, ảnh hưởng protection, Witch và balance.

**Khuyến nghị:** ghi explicit `totalWolfAttacks = 2` hoặc `additionalAttacks = 1`; khuyến nghị chọn `additionalAttacks = 1` để giữ attack chính + 1 extra. Bổ sung target uniqueness và interaction tests.

---

### C-10 — Blood Moon source và canonical event dùng activation khác nhau — **P1**

**Nguồn:** `sources/SOURCE_pack.md` §V; `12-event-spec.md` bản đã cập nhật; `21-complete-rules-and-acceptance-tests.md` scenario.

- Source: event được rút vào buổi sáng, áp dụng cho đêm tiếp theo.
- `12-event-spec.md`: mặc định `activationNight: 1`, trigger `ON_WOLF_VICTIM_SELECTED`, variant infection sau protection/heal.
- Scenario mẫu bật event ngay từ đêm 1 mà không mô tả bước “rút event buổi sáng”.

**Rủi ro:** Blood Moon có thể chạy sai đêm hoặc chạy dù chưa được draw/enable.

**Khuyến nghị:** giữ variant `BLOOD_MOON_INFECTION`, nhưng thêm `activationMode: DRAWN_AT_DAY | SCENARIO_PRELOADED`; default theo source là `DRAWN_AT_DAY`, `effectiveNight = drawDay + 1`. Chỉ dùng `SCENARIO_PRELOADED` cho preset test.

---

## 3. Điểm chưa phù hợp/chưa implementation-ready

### F-01 — `README.md` chỉ liệt kê 00–20 nhưng repository có 21–36 — **P1**

`README.md` gọi đây là canonical structure và kết thúc ở `20-deployment-spec.md`, trong khi nhiều contract bắt buộc nằm ở `21–36` như acceptance tests, registry, resolution matrix, vote policy, schema, security và audit.

**Khuyến nghị:** cập nhật README thành manifest đầy đủ hoặc ghi rõ 21–36 là “implementation hardening/appendix”. Đồng bộ với `MANIFEST.json`.

### F-02 — Audit matrix tuyên bố kiểm tra 43 role nhưng chỉ có 2 entry — **P1**

**Nguồn:** `05-audit/role-detail-index.md`, `35-role-audit-matrix.md`.

Index có 43 role detail files, nhưng matrix chỉ đánh giá `witch`, `werewolf`, `wolf-dog`. Không thể kết luận 43 role đã `READY`/`BLOCKED`.

**Khuyến nghị:** sinh matrix đủ 43 role, mỗi role có đủ cột role/ability/action/rule/effect/knowledge/test và link tới file detail.

### F-03 — `01-role-spec.md` và detail files không có bằng chứng cross-reference đầy đủ — **P1**

Role contract yêu cầu `deathInteractions` và `winConditions`, nhưng index chỉ chứng minh file tồn tại; chưa chứng minh từng file có đủ trường contract.

**Khuyến nghị:** thêm schema front matter hoặc checklist tự động; reject role nếu thiếu trường bắt buộc.

### F-04 — `35-role-audit-matrix.md` ghi `READY` nhưng quality gate yêu cầu test scenario — **P1**

Matrix đánh dấu Witch/Werewolf `READY`, nhưng tài liệu không cung cấp evidence/link tới scenario test cụ thể cho từng role. File 35 tự quy định không được `READY` nếu chưa có test.

**Khuyến nghị:** chuyển trạng thái về `RULE_DEFINED`/`BLOCKED` cho tới khi có test ID và link; hoặc bổ sung `testScenarioIds` bắt buộc.

### F-05 — Error code dùng `TARGET_INVALID` và `INVALID_TARGET` không đồng nhất — **P1**

**Nguồn:** `24-action-registry.md` §5; `29-error-catalog.md` §1; event spec có thêm các error Blood Moon.

**Khuyến nghị:** dùng `INVALID_TARGET` làm code canonical; thêm `EVENT_VARIANT_REQUIRED`, `EVENT_ALREADY_CONSUMED`, `BLOOD_MOON_TARGET_INVALID`, `BLOOD_MOON_CONFLICTING_VARIANT` vào `29-error-catalog.md` hoặc quy định mapping về code tổng quát.

### F-06 — Database thiếu bảng idempotency được runtime yêu cầu — **P1**

**Nguồn:** `14-database-spec.md` §Runtime tables; `31-reconnect-and-idempotency.md` §1.

File 31 yêu cầu `game_idempotency_keys`, nhưng file 14 không liệt kê bảng này.

**Khuyến nghị:** thêm bảng với unique key `(game_id, client_request_id)`, status, response payload/result reference, created/expires timestamp và index theo game.

### F-07 — Database chưa mô hình hóa rõ event sequence/replay retention — **P1**

File 14 có `game_events.sequence unique per game`; file 31 yêu cầu replay tối thiểu 72 giờ hoặc 1 ngày game, snapshot mỗi phase. Chưa có schema/retention policy, cursor/index hoặc quan hệ snapshot–event.

**Khuyến nghị:** định nghĩa `game_events.game_id + server_sequence`, snapshot sequence, retention job và behavior khi sequence quá cũ trong DB spec.

### F-08 — `GameState`/DB persistence chưa thống nhất tên snapshot — **P2**

Monolithic `werewolf-game-spec.md` mô tả runtime `game_state`, còn `14-database-spec.md` dùng `game_state_snapshots`. Không chốt state memory, snapshot hay event-store hybrid; chính `review-report.md` cũng để đây là quyết định còn thiếu.

**Khuyến nghị:** chốt một mô hình: authoritative in-memory aggregate + periodic snapshots + append-only events; ghi rõ source of truth khi restart/replay.

### F-09 — Catalog action và registry không có owner/variant/visibility đầy đủ trên mọi action — **P1**

`03-action-spec.md` chỉ liệt kê code; `24-action-registry.md` mới có schema chi tiết nhưng chỉ có một example và một danh sách core ngắn. Chưa có registry hoàn chỉnh cho toàn bộ action được role detail sử dụng.

**Khuyến nghị:** coi registry là single source of truth; kiểm tra mọi `actionCodes` trong role detail phải tồn tại trong registry và có validator/effect/event contract.

### F-10 — `ALIVE/DEAD` được mô tả là status nhưng nhiều tài liệu dùng player state `alive` — **P2**

**Nguồn:** `11-status-spec.md`; `01-role-spec.md`; `21-complete-rules-and-acceptance-tests.md`.

**Khuyến nghị:** xem `alive` là state bất biến theo resolution, còn status catalog chỉ chứa modifier; nếu giữ status `ALIVE/DEAD`, phải định nghĩa precedence và đồng bộ hai chiều.

### F-11 — Public event mẫu làm lộ `cause` chưa theo policy reveal — **P1**

`30-websocket-json-schema.md` mẫu public `PLAYER_DIED` có `payload.cause: WOLF_ATTACK`, trong khi `21-complete-rules-and-acceptance-tests.md` §7.3 nói nguyên nhân chết chỉ công khai nếu scenario cho phép.

**Khuyến nghị:** public payload mặc định chỉ có `playerId` và public reason theo scenario; `cause` chỉ thuộc `MODERATOR`/audit hoặc khi `revealDeathCause=true`.

### F-12 — Source role vẫn chứa luật raw chưa được normalize thành variant — **P1**

Ví dụ: Hunter “mỗi đêm chọn 1 người” nhưng canonical action/acceptance model tách `HUNTER_MARK_TARGET` và `HUNTER_SHOOT`; Wolf-Dog có hai behavior; Blood Moon có official/fanmade; Fire Wolf và Wolf Brothers có trigger/giới hạn chưa được biểu diễn đầy đủ trong catalog.

**Khuyến nghị:** source chỉ là reference; mỗi role phải có `sourceRuleId`, canonical rule, variant, priority và acceptance tests. Không dùng source raw trực tiếp để code.

---

## 4. Vấn đề inventory/truy vết

### I-01 — `03-non-role/` không được xác minh đầy đủ

Lần rà soát directory trả về lỗi truy cập cho một request path; chưa có manifest đầy đủ các file trong `03-non-role/`. Vì vậy chưa thể khẳng định tất cả non-role definition đã được cross-check với catalog.

**Hành động:** bổ sung directory listing/manifest và đưa từng non-role vào audit matrix.

### I-02 — Tài liệu monolithic và V4 có nội dung trùng nhưng không có cơ chế phát hiện drift

`werewolf-game-spec.md` vẫn chứa catalog/flow/rules song song với `werewolf-spec-v4/`. Hai nguồn có thể diverge, như đã thấy ở Blood Moon, resolution order và role action naming.

**Khuyến nghị:** đánh dấu monolithic là legacy/reference hoặc tự động kiểm tra drift; chỉ cho phép V4 canonical được dùng để implement.

### I-03 — File source có asset path không đồng nhất

`SOURCE_full_role.md` dùng `src/image/...`; `SOURCE_pack.md` dùng `lib/image/...`; asset spec dùng `cards/roles/...` object storage.

**Khuyến nghị:** giữ source path như historical metadata nhưng thêm `assetKey` canonical cho từng role/event; không dùng path source trực tiếp trong client.

### I-04 — Chưa có version pin cho từng scenario và tài liệu contract

`21-complete-rules-and-acceptance-tests.md` có `rulesetVersion`, nhưng action registry, WebSocket schema và event definition chưa yêu cầu `schemaVersion`/compatibility policy.

**Khuyến nghị:** thêm `rulesetVersion`, `scenarioCode`, `protocolVersion`, `catalogVersion` vào snapshot, event audit và handshake/reconnect contract.

---

## 5. Quyết định chuẩn hóa được đề xuất

Đây là baseline để xử lý log, **chưa thay thế việc product owner xác nhận luật**:

1. `00-overview.md` là precedence cao nhất trong V4; source raw chỉ dùng để trace.
2. `24-action-registry.md` là nguồn duy nhất cho action code và action contract.
3. `30-websocket-json-schema.md` là nguồn duy nhất cho transport contract; file 16 cần sửa hoặc đánh dấu legacy.
4. `21-complete-rules-and-acceptance-tests.md` là nguồn chính cho resolution pipeline; cập nhật file 13/25 cho khớp.
5. `26-vote-policy.md` là nguồn chính cho vote; chốt rõ `SILENCED` không đồng nghĩa `VOTE_DISABLED`.
6. `11-status-spec.md` và `28-status-lifecycle.md` phải được hợp nhất thành một catalog/lifecycle.
7. Blood Moon mặc định dùng `BLOOD_MOON_INFECTION`; cần bổ sung mode draw-at-day để khớp source.
8. Wolf-Dog, Blood Moon fanmade, wolf self-kill và các action đặc biệt chỉ bật qua explicit variant.
9. Mọi role chỉ được đánh dấu `READY` khi có đủ definition, registry entries, resolution rules, visibility contract và tests.
10. Sau khi sửa, chạy consistency checks cho: role count, action codes, trigger codes, effect codes, status codes, win codes, error codes, WebSocket fields và scenario references.

---

## 6. Thứ tự xử lý đề xuất

### Phase 0 — Blocker

- C-01, C-02, C-03: chốt transport/action contract.
- C-04: chốt resolution order và death boundary.
- C-05, C-06, C-07: chốt code/policy/status canonical.

### Phase 1 — Trước khi implementation

- C-08, C-09, C-10.
- F-02, F-04, F-05, F-06, F-07, F-09, F-11.
- Tạo manifest đầy đủ cho role/non-role và cập nhật `README.md`.

### Phase 2 — Trước production

- F-08, F-10, F-12, I-02, I-03, I-04.
- Bổ sung automated consistency checks và protocol compatibility tests.

---

## 7. Tiêu chí đóng audit

Audit chỉ được xem là resolved khi mỗi finding có:

```text
findingId
owner
canonicalDocument
decision/status
implementation impact
acceptance test IDs
resolved commit/PR
```

Các mục chưa có product decision phải giữ trạng thái `OPEN`, không tự động chuyển thành `READY`.
