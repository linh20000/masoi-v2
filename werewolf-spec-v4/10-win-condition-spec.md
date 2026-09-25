# 10 — Win Condition Specification

Win condition evaluate sau toàn bộ resolution có thể thay đổi alive/alignment/relationship.

## Canonical codes

- `VILLAGE_ELIMINATE_WEREWOLVES`
- `WEREWOLF_DOMINATION`
- `WHITE_WOLF_SOLE_SURVIVOR`
- `PIPER_ALL_BEWITCHED`
- `ANGEL_FIRST_OBJECTIVE`
- `LOVERS_LAST_TWO`
- `SECT_ELIMINATE_OPPOSING_GROUP`
- `SHADOW_TARGET_SURVIVAL`

`ANGEL_FIRST_OBJECTIVE` bao phủ cả `FIRST_NIGHT_WOLF_ATTACK` và `FIRST_DAY_EXECUTION`; không dùng `ANGEL_FIRST_NIGHT_DEATH` làm code mới.

## Default priority

```yaml
winPriority: [ANGEL, LOVERS, PIPER, SECT, WHITE_WOLF, WEREWOLF, VILLAGE]
```

## Contract

```java
interface WinCondition {
    Optional<WinResult> evaluate(GameState state);
}
```

Engine phải ghi toàn bộ `qualifiedWinners`, sau đó chọn kết quả theo `winPriority`. Condition thiếu context trả `NEEDS_MORE_CONTEXT`, không được coi là đạt.
