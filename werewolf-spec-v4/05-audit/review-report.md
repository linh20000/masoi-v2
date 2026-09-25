# Review Report — V4

## 1. Review scope
Reviewed the supplied package containing:
- original monolithic spec
- 00–20 catalog/spec documents
- Role Spec V3
- 43 role detail files
- non-role definitions
- source files
- the previously generated 02–18 package

## 2. Findings fixed

### F-01 — Duplicate/inconsistent role count
Previous catalog mixed normalization with raw source entries and could report 44 roles.
V4 uses **43 canonical Character Roles**. Raven Plus is a variant; Guard is canonicalized.

### F-02 — Numbering drift
The earlier package merged test/deployment into item 18 and omitted the original dedicated asset position.
V4 restores canonical `00–20`:
- 18 Asset Management
- 19 Test Specification
- 20 Deployment Specification

### F-03 — Domain Action pollution
Generic `CHOOSE_TARGET` / `CHOOSE_FACTION` were mixed with real game actions.
V4 treats generic selection as UI/input mechanics and keeps domain actions explicit.

### F-04 — Role/Title/Relationship/Event boundary
Sheriff/Town Mayor and Police are Title.
Lovers are Relationship.
Blood Moon is Event Card.

### F-05 — Variant ambiguity
Wolf-Dog has two source descriptions. V4 preserves both as variants instead of inventing a merged rule.
Blood Moon also has multiple rulesets and therefore requires `variantCode`.

### F-06 — Action/Effect separation
Action is player intent. Effect is state mutation. Validation and Rule evaluation occur before Effect execution.

### F-07 — Private knowledge
Knowledge is recipient-scoped and must never leak through public snapshot/event payloads.

### F-08 — Runtime authority
Java owns timers, phase transitions, validation, resolution, death, transformation and win checks. Flutter never decides these outcomes.

### F-09 — Deployment topology
Deployment is kept compatible with three independent VPSs and no mandatory Gateway.

## 3. Remaining design decisions that must be explicitly chosen before coding
These are source/design ambiguities, not silently resolved by V4:
1. Exact Wolf-Dog variant used by the game.
2. Exact Blood Moon variant used by each pack/scenario.
3. Exact action priority when multiple death/save/transform effects conflict.
4. Whether runtime state is memory-only, Redis-backed, or snapshot/event-store hybrid.
5. Exact voice topology and whether Node is required from day one.

## 4. Quality gate before implementation
A scenario is implementation-ready only when it has:
`Actor + Phase + Action + Preconditions + Target rules + Resolution priority + Effects + Private knowledge + Public events + Win check + Tests`.
