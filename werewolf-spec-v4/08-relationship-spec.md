# 08 — Relationship Specification

Relationship là runtime state giữa nhiều Player.

## Types
- LOVERS
- SIBLINGS
- WOLF_PACK
- WOLF_BROTHERS
- HYPNOTIZED_GROUP
- CULT_GROUP
- IDOL

## Contract
`relationshipId, type, participants, createdAt, active, metadata`

Relationship có thể tạo:
- death propagation
- knowledge propagation
- transformation trigger
- win condition

Lovers là relationship, không phải Character Role.
