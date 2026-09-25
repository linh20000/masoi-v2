# 32 — Database DDL

> Đây là outline schema cơ bản cho database runtime. Không dùng DB như engine, chỉ lưu state và event.

## 1. Core tables

```sql
CREATE TABLE games (
  id UUID PRIMARY KEY,
  scenario_code TEXT NOT NULL,
  version TEXT NOT NULL,
  state TEXT NOT NULL,
  current_phase TEXT NOT NULL,
  current_sequence BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE game_players (
  id UUID PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES games(id),
  user_id UUID NULL,
  player_code TEXT NOT NULL,
  role_code TEXT,
  alignment TEXT,
  alive BOOLEAN NOT NULL,
  can_vote BOOLEAN NOT NULL DEFAULT TRUE,
  can_speak BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL,
  UNIQUE (game_id, player_code)
);

CREATE TABLE game_events (
  id UUID PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES games(id),
  sequence BIGINT NOT NULL,
  event_code TEXT NOT NULL,
  phase TEXT NOT NULL,
  audience TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL,
  UNIQUE (game_id, sequence)
);

CREATE TABLE game_actions (
  id UUID PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES games(id),
  action_code TEXT NOT NULL,
  actor_id UUID NOT NULL,
  client_request_id TEXT NOT NULL,
  status TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL,
  UNIQUE (game_id, client_request_id)
);

CREATE TABLE game_pending_deaths (
  id UUID PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES games(id),
  victim_id UUID NOT NULL,
  cause TEXT NOT NULL,
  source_id UUID,
  priority INT NOT NULL,
  preventable BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE game_statuses (
  id UUID PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES games(id),
  player_id UUID NOT NULL,
  status_code TEXT NOT NULL,
  source_id UUID,
  expires_at_phase TEXT,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE game_relationships (
  id UUID PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES games(id),
  type TEXT NOT NULL,
  player_a UUID NOT NULL,
  player_b UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE game_knowledge (
  id UUID PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES games(id),
  player_id UUID NOT NULL,
  knowledge_code TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL
);
```

## 2. Index

```sql
CREATE INDEX idx_game_events_sequence ON game_events(game_id, sequence);
CREATE INDEX idx_game_actions_client_request ON game_actions(game_id, client_request_id);
CREATE INDEX idx_game_pending_deaths_player ON game_pending_deaths(game_id, victim_id);
CREATE INDEX idx_game_statuses_player ON game_statuses(game_id, player_id);
```

## 3. Rule

- `game_events.sequence` unique per game.
- `game_actions.client_request_id` unique per game.
- `game_pending_deaths` one active death per victim per resolution.
