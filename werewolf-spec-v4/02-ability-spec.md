# 02 — Ability Specification

## 1. Definition
Ability là capability của Role. Ability không trực tiếp mutate GameState.

## 2. Types
- ACTIVE_NIGHT
- ACTIVE_DAY
- PASSIVE
- REACTIVE
- KNOWLEDGE
- TRANSFORMATION
- LIMITED_USE
- CONDITIONAL

## 3. Contract
`abilityCode, ownerRole, activationType, uses, cooldown, conditions, actionCodes, triggerCodes`

## 4. Examples
| Role | Ability |
|---|---|
| Seer | INSPECT |
| Bodyguard | PROTECT |
| Witch | HEAL, POISON |
| Hunter | HUNTER_TARGET |
| Cupid | LINK_LOVERS |
| Werewolf | WOLF_KILL |
| Elder | EXTRA_WOLF_LIFE |
| Wild Child | CHOOSE_IDOL |
| Idiot | SURVIVE_EXECUTION |
| Piper | HYPNOTIZE |

Ability lifecycle:
`available → activated → consumed/remaining → disabled/expired`.
