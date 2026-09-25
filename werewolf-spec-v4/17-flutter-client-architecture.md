# 17 — Flutter Client Architecture

Flutter là renderer + input client, không phải authority.

## Layers
```text
presentation/
application/
domain/
data/
```

## Features
- lobby
- room
- game
- result

## Game components
`GameTable, PlayerSeat, RoleCard, ActionPanel, GameTimer, VotePanel, EventLog`

## UI contract
Server gửi `ActionDefinition` gồm action, phase, target constraints và allowed targets. Flutter render control từ definition.

## Layout
- Lobby/selection: portrait-first.
- Gameplay: landscape-first.
- Table: ellipse/circle positioning, tối đa 20 seats, không dùng grid.

## Security
Không tin client state để quyết định death, vote validity, role, win condition hoặc timer.
