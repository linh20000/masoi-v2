# 16 — WebSocket Protocol (Legacy Alias)

> **Canonical contract:** `30-websocket-json-schema.md`. File này chỉ giữ danh sách message và không định nghĩa field thay thế.

## Client → Server

- `JOIN_GAME`
- `READY`
- `ACTION_REQUEST`
- `RECONNECT`
- `EVENT_ACK`

Vote được gửi bằng `ACTION_REQUEST` với `actionCode: vote.execution`; không có message `VOTE` riêng.

## Server → Client

- `SNAPSHOT`
- `ACTION_AVAILABLE`
- `ACTION_RESULT`
- `GAME_EVENT`
- `ERROR`
- `TIMER`
- `GAME_OVER`

## Canonical naming

- Request id: `clientRequestId`
- Action id: `actionId`
- Action field: `actionCode`
- Event field: `eventCode`
- Event cursor: `serverSequence`
- Reconnect cursor: `lastSequence`
- Visibility field: `audience`

Không dùng các alias cũ `requestId`, `action`, `event`, `sequence`, `visibility` trong protocol V4.1.

## Reliability

- `clientRequestId` dùng idempotency trong phạm vi `(gameId, playerId)`.
- `serverSequence` tăng đơn điệu theo game.
- Client gửi `lastSequence`; server replay event sau cursor hoặc gửi snapshot nếu cursor hết retention.
- Private event chỉ gửi tới recipient/group đúng audience.

Chi tiết schema đầy đủ nằm ở `30-websocket-json-schema.md`.
