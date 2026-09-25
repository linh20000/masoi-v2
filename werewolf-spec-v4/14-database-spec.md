# 14 — Database Specification

## Catalog tables
`packs, cards, roles, abilities, actions, triggers, rules, effects, knowledge_rules, relationship_types, transformation_rules, win_conditions, events, event_variants`

## Mapping tables
`role_abilities, ability_actions, role_rules, role_knowledge_rules, role_relationship_rules, role_transformations, role_win_conditions`

## Runtime tables
`games, game_players, game_state_snapshots, game_actions, game_events, game_votes, game_relationships, game_statuses, game_knowledge`

## Rules
- Catalog `code` immutable.
- Runtime entity uses UUID.
- JSONB only for genuinely variable metadata/payload.
- `game_events.sequence` unique per game.
- Binary assets stay in Object Storage.
