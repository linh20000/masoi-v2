# 30 — WebSocket JSON Schema

> Đây là transport contract canonical của V4.1.

## Client request

```json
{
  "type": "ACTION_REQUEST",
  "protocolVersion": "4.1",
  "gameId": "game-001",
  "playerId": "player-01",
  "clientRequestId": "uuid",
  "actionCode": "seer.inspect_player",
  "targets": ["player-07"],
  "payload": {},
  "submittedAt": "2026-09-25T12:00:00Z"
}
```

## Action result

```json
{
  "type": "ACTION_RESULT",
  "protocolVersion": "4.1",
  "gameId": "game-001",
  "clientRequestId": "uuid",
  "status": "ACCEPTED",
  "actionId": "action-123",
  "serverSequence": 42
}
```

## Game event

```json
{
  "type": "GAME_EVENT",
  "protocolVersion": "4.1",
  "gameId": "game-001",
  "eventCode": "PLAYER_DIED",
  "serverSequence": 43,
  "phase": "NIGHT_RESOLUTION",
  "audience": "PUBLIC",
  "targetId": "player-07",
  "payload": {}
}
```

Public `PLAYER_DIED` không chứa `cause` mặc định; cause chỉ xuất hiện khi `revealDeathCause=true` hoặc trong audience `MODERATOR`.

## Snapshot / ACK / reconnect

```json
{"type":"SNAPSHOT","protocolVersion":"4.1","gameId":"game-001","rulesetVersion":"4.1","scenarioCode":"classic-v4","catalogVersion":"4.1","serverSequence":100,"phase":"DAY","deadline":"2026-09-25T12:05:00Z","players":[]}
{"type":"EVENT_ACK","gameId":"game-001","serverSequence":43}
{"type":"RECONNECT","gameId":"game-001","playerId":"player-01","lastSequence":100}
```

`lastSequence` chỉ dùng trong reconnect; `serverSequence` dùng trong event, result, snapshot và ACK. Private event không broadcast ngoài recipient/group được khai báo.
