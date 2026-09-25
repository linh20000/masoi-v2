# 31 — Reconnect and Idempotency

> Reconnect và duplicate request phải được xử lý đúng để tránh double action.

## 1. Idempotency

- Mỗi `(gameId, playerId, clientRequestId)` được lưu trong `game_idempotency_keys`.
- Nếu request với cùng `clientRequestId` gửi lại, server trả kết quả cũ, không xử lý lần hai.
- Nếu request có cùng `actionCode` nhưng khác `clientRequestId`, xử lý như action mới.

## 2. Reconnect flow

```text
Client sends RECONNECT
→ server validates session token
→ fetch last_sequence
→ if retention available -> replay events after last_sequence
→ else -> send snapshot
→ continue game loop
```

## 3. Retention policy

- Mặc định: giữ event log tối thiểu 72 giờ hoặc 1 ngày game.
- Snapshot phải chèn bản cuối cùng mỗi phase change.
- Nếu client quá cũ, server gửi snapshot và sau đó stream mới từ `serverSequence`.

## 4. Duplicate handling

```yaml
duplicateRequestPolicy: RETURN_PREVIOUS_RESULT
```

## 5. Server rules

- `serverSequence` không được giảm.
- Với reconnect thông thường, `lastSequence` quá cũ không phải lỗi: server gửi snapshot mới nhất rồi stream tiếp từ `serverSequence`. `SEQUENCE_TOO_OLD` chỉ dùng cho API replay bắt buộc lịch sử đầy đủ hoặc request không thuộc flow reconnect.
- reconnect không được cấp quyền quyết định game state bất hợp pháp.
