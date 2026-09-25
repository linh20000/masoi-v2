# 31 — Reconnect and Idempotency

> Reconnect và duplicate request phải được xử lý đúng để tránh double action.

## 1. Idempotency

- Mỗi `clientRequestId` được lưu trong `game_idempotency_keys`.
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

- sequence không được giảm.
- request không hợp lệ vì `lastSequence` quá cũ -> reject với `SEQUENCE_TOO_OLD`.
- reconnect không được cấp quyền quyết định game state bất hợp pháp.
