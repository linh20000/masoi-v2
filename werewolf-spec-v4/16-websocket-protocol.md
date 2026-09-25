# 16 — WebSocket Protocol

## Client → Server
```json
{
  "type": "ACTION",
  "requestId": "uuid",
  "action": "INSPECT_PLAYER",
  "targets": ["player-07"],
  "payload": {}
}
```

## Server → Client
```json
{
  "type": "GAME_EVENT",
  "sequence": 105,
  "event": "PLAYER_DIED",
  "visibility": "PUBLIC",
  "data": {"playerId": "player-07"}
}
```

## Private event
Recipient-scoped; không broadcast.

## Message types
Client: JOIN_GAME, READY, ACTION, VOTE, RECONNECT, ACK.
Server: SNAPSHOT, ACTION_AVAILABLE, GAME_EVENT, ERROR, TIMER, GAME_OVER.

## Reliability
- `requestId` dùng idempotency.
- `sequence` dùng ordering/replay.
- reconnect gửi `lastSequence`.
