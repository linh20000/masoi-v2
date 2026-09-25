# 27 — Win Condition Predicates

> Điều kiện thắng phải được biểu diễn dưới dạng predicate có thể evaluate bởi engine, không phải lời văn mơ hồ.

## 1. Predicate cơ bản

```yaml
winConditionCode: VILLAGE_ELIMINATE_WEREWOLVES
predicate:
  and:
    - aliveWerewolves == 0
    - aliveVillageEligiblePlayers > 0
```

## 2. Priority resolution

```yaml
winPriority:
  - ANGEL
  - LOVERS
  - PIPER
  - SECT
  - WHITE_WOLF
  - WEREWOLF
  - VILLAGE
```

## 3. Đại diện các điều kiện

### 3.1 Angel

```yaml
winConditionCode: ANGEL_FIRST_NIGHT_DEATH
predicate:
  and:
    - angelPlayer.alive == false
    - angelDeathPhase == NIGHT
    - dayNumber == 1
```

### 3.2 Lovers

```yaml
winConditionCode: LOVERS_LAST_TWO
predicate:
  and:
    - aliveLovers == 2
    - aliveNonLovers == 0
```

### 3.3 Piper

```yaml
winConditionCode: PIPER_ALL_BEWITCHED
predicate:
  and:
    - piperAlive == true
    - every aliveNonPiperPlayer hasStatus BEWITCHED
```

### 3.4 White Wolf

```yaml
winConditionCode: WHITE_WOLF_SOLE_SURVIVOR
predicate:
  and:
    - whiteWolfAlive == true
    - alivePlayersExceptWhiteWolf == 0
```

### 3.5 Werewolf

```yaml
winConditionCode: WEREWOLF_DOMINATION
predicate:
  and:
    - aliveWerewolves > 0
    - aliveWerewolves >= aliveNonWerewolves
    - no higherPriorityWinnerExists
```

### 3.6 Village

```yaml
winConditionCode: VILLAGE_ELIMINATE_WEREWOLVES
predicate:
  and:
    - aliveWerewolves == 0
    - aliveVillagePlayers > 0
```

## 4. Rule cho evaluation

- Win check luôn chạy sau transformation.
- Nếu nhiều condition cùng true -> chọn theo priority list.
- Một condition không đủ dữ liệu phải trả `NEEDS_MORE_CONTEXT`, không được tính thành true hay false.
