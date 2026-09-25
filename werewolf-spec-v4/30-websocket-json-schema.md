# 30 — WebSocket JSON Schema

> File này chuẩn hóa message contract cho client-server.

## 1. Client request

```json
{
  "type": "ACTION_REQUEST",
  "gameId": "game-001",
  "playerId": "player-01",
  "clientRequestId": "uuid",
  "actionCode": "seer.inspect_player",
  "targets": ["player-07"],
  "payload": {},
  "submittedAt": "2026-09-25T12:00:00Z"
}
```

## 2. Server accept result

```json
{
  "type": "ACTION_RESULT",
  "gameId": "game-001",
  "clientRequestId": "uuid",
  "status": "ACCEPTED",
  "actionId": "action-123",
  "serverSequence": 42
}
```

## 3. Game event

```json
{
  "type": "GAME_EVENT",
  "gameId": "game-001",
  "eventCode": "PLAYER_DIED",
  "serverSequence": 43,
  "phase": "NIGHT_RESOLUTION",
  "audience": "PUBLIC",
  "targetId": "player-07",
  "payload": {
    "cause": "WOLF_ATTACK"
  }
}
```

## 4. Snapshot

```json
{
  "type": "SNAPSHOT",
  "gameId": "game-001",
  "serverSequence": 100,
  "phase": "DAY",
  "deadline": "2026-09-25T12:05:00Z",
  "players": []
}
```

## 5. Event ACK

```json
{
  "type": "EVENT_ACK",
  "gameId": "game-001",
  "serverSequence": 43
}
```

## 6. Reconnect request

```json
{
  "type": "RECONNECT",
  "gameId": "game-001",
  "playerId": "player-01",
  "lastSequence": 100
}
```
