# 10 — Win Condition Specification

Win condition được evaluate sau các resolution có thể thay đổi alive/alignment/relationship.

## Core
- VILLAGE_ELIMINATE_WEREWOLVES
- WEREWOLF_DOMINATION
- WHITE_WOLF_SOLE_SURVIVOR
- PIPER_ALL_BEWITCHED
- ANGEL_FIRST_OBJECTIVE
- LOVERS_LAST_TWO
- SECT_ELIMINATE_OPPOSING_GROUP
- SHADOW_TARGET_SURVIVAL

## Contract
```java
interface WinCondition {
    Optional<WinResult> evaluate(GameState state);
}
```

Engine phải hỗ trợ nhiều winner groups và instant win.
