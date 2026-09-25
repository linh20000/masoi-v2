# 15 — Java Backend Architecture

## Package structure
```text
com.werewolf.game
├── domain
│   ├── role
│   ├── ability
│   ├── action
│   ├── rule
│   ├── effect
│   ├── knowledge
│   ├── relationship
│   ├── transformation
│   ├── wincondition
│   ├── player
│   └── game
├── application
│   ├── command
│   ├── query
│   ├── game
│   ├── action
│   └── phase
├── infrastructure
│   ├── persistence
│   ├── websocket
│   ├── scheduler
│   └── storage
└── interfaces
    ├── websocket
    └── http
```

## Command pipeline
`WebSocket → Command Handler → Validator → Rule Engine → Resolution → GameState → EventStore → Publisher`

## Concurrency
Mỗi Game/Room phải serialize state mutations hoặc dùng optimistic version check.

## Design rule
Không tạo một `WerewolfRoleService` khổng lồ. Role là definition; behavior được composition từ Ability/Action/Rule/Effect.
