# 36 — Balance and Scenario Presets

> Mỗi preset phải có tỷ lệ cân bằng và scenario tương ứng.

## 1. Preset mặc định

```yaml
preset_5:
  playerCount: 5
  werewolfCount: 1
  seerCount: 1
  bodyguardCount: 1
  villagerCount: 2

preset_7:
  playerCount: 7
  werewolfCount: 2
  seerCount: 1
  witchCount: 1
  cupidCount: 1
  villagerCount: 2

preset_9:
  playerCount: 9
  werewolfCount: 2
  seerCount: 1
  witchCount: 1
  bodyguardCount: 1
  hunterCount: 1
  villagerCount: 3

preset_12:
  playerCount: 12
  werewolfCount: 3
  seerCount: 1
  bodyguardCount: 1
  witchCount: 1
  cupidCount: 1
  hunterCount: 1
  villagerCount: 4
```

## 2. Rule balance

- Không cho số role hỗ trợ quá nhiều so với số người chơi.
- Không cho role tạo bắt buộc quá nhiều private knowledge khi số player nhỏ.
- Nếu có phe thứ ba, phải có variant rõ ràng.
- Nếu có event card như Blood Moon, phải bật explicit variant.

## 3. Scenario governance

- Mỗi pack phải có `balanceProfile`.
- Scenario có thể override preset bằng `overrides`.
- Có thể có `classic`, `chaos`, `night-heavy`, `vote-heavy`.
