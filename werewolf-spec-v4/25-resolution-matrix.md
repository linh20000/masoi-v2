# 25 — Resolution Matrix

> `21-complete-rules-and-acceptance-tests.md` và file này dùng cùng một pipeline canonical.

## Priority

```text
1000 PRE_ACTION
2000 ACTION_VALIDATION
3000 SPECIAL_ATTACK
4000 PROTECTION
5000 HEAL
6000 DAMAGE
7000 PENDING_DEATH
7500 NON_DEATH_CONVERSION
8000 DEATH_CONFIRMATION
9000 RELATIONSHIP
10000 DEATH_TRIGGER
11000 TRANSFORMATION
12000 KNOWLEDGE_RECALCULATION
13000 WIN_CHECK
```

Số lớn hơn được resolve sau số nhỏ hơn. Cùng priority phải có deterministic `effectId` ordering.

## Rules

- Protection chỉ hủy PendingDeath mà `protectionScope` cho phép.
- Heal chỉ hủy death cause nằm trong `healScope`.
- Poison độc lập với Bodyguard.
- Non-death conversion (`BLOOD_MOON_INFECTION`, và `FATHER_WOLF_CONVERSION` nếu scenario bật) chạy sau protection/heal nhưng trước `DEATH_CONFIRMATION`; conversion thành công phải hủy pending death theo đúng scope.
- Mỗi player chỉ có một `PLAYER_DEATH_CONFIRMED` trong một resolution; lưu mọi causes và chọn `primaryCause` theo policy.
- Relationship propagation chạy sau primary death confirmation.
- Death trigger chạy sau relationship propagation.
- Transformation chạy sau death trigger và trước win check.
- Win check chạy cuối resolution, sau khi knowledge đã được tính lại.

## Anti-loop

`maxChainDepth = 32`; cycle dừng bằng `DEATH_CYCLE_DETECTED`. Mỗi trigger có `oncePerGame` hoặc `oncePerDeath` và được dedupe bằng event ID.
