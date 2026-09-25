# 13 — Phase & Resolution Specification

## State machine
`WAITING → STARTING → ROLE_REVEAL → NIGHT → NIGHT_RESOLUTION → DAY → DISCUSSION → VOTING → VOTE_RESOLUTION → WIN_CHECK → GAME_OVER / NIGHT`

## Night
Night có ordered role turns. Mandatory actions phải resolve trước khi chuyển phase.

## Night resolution order
```text
collect
→ validate
→ resolve priority
→ protection
→ healing
→ poison/damage
→ survival/death rules
→ scheduled deaths
→ relationship propagation
→ transformations
→ final deaths
→ win check
```

## Timer
Java server là authority; client chỉ render server deadline.

## Reconnect
`lastSequence → replay` nếu còn retention; nếu không `snapshot + currentSequence`.
