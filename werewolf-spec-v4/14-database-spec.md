# 14 — Database Specification

## Catalog tables

`packs, cards, roles, abilities, actions, triggers, rules, effects, knowledge_rules, relationship_types, transformation_rules, win_conditions, events, event_variants`

## Mapping tables

`role_abilities, ability_actions, role_rules, role_knowledge_rules, role_relationship_rules, role_transformations, role_win_conditions`

## Runtime tables

`games, game_players, game_state_snapshots, game_actions, game_events, game_votes, game_relationships, game_statuses, game_knowledge, game_idempotency_keys`

## Canonical persistence model

- Game aggregate authoritative trong memory của Java game server.
- `game_events` là append-only audit/replay log.
- `game_state_snapshots` lưu snapshot định kỳ và bắt buộc tại mỗi phase change.
- Khi restart: nạp snapshot gần nhất rồi replay event sau snapshot.
- `game_events` có unique `(game_id, server_sequence)` và index phục vụ replay/retention. DB dùng snake_case; transport/domain map field này thành `serverSequence`.
- Retention mặc định tối thiểu 72 giờ hoặc trọn một ván, tùy thời điểm nào lâu hơn.
- Khi cursor hết retention, server gửi snapshot mới nhất, không trả `SEQUENCE_TOO_OLD` cho flow reconnect thông thường.

## Idempotency

`game_idempotency_keys` bắt buộc có unique `(game_id, player_id, client_request_id)`, `action_id`, request hash, result status/payload reference, `created_at`, `expires_at`.

## Rules

- Catalog `code` immutable.
- Runtime entity dùng UUID.
- JSONB chỉ dùng cho metadata/payload biến đổi thật sự.
- Binary assets ở Object Storage.
