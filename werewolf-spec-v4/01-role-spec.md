# 01 — Role Specification

## 1. Canonical role inventory
Có **43 Character Role** sau khi canonicalize duplicate/variant:
- Duplicate Guard không tạo role mới.
- Raven Plus là variant của Raven.
- Sheriff/Town Mayor và Police là Title.
- Lovers là Relationship/runtime state.
- Blood Moon là Event Card.
- Wolf-Dog giữ các luật nguồn dưới dạng variant.

## 2. Role contract
Mỗi role phải có:
`code, displayName, group, alignment, assetKey, abilities, actions, triggers, rules, knowledge, relationships, transformations, deathInteractions, winConditions`

## 3. Runtime separation
```text
Player
 ├── RoleState
 ├── TitleState[]
 ├── Status[]
 ├── Knowledge[]
 └── Relationships[]
```

## 4. Role details
Chi tiết từng role nằm tại `02-role-details/`.
