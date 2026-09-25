# Người múa rối

## 1. Identity
- **Role code:** `puppeteer`
- **Group:** Neutral
- **Source name:** Người múa rối

## 2. Abilities
Một lần ép phe Sói cắn mục tiêu do mình chỉ định, kể cả ép Sói cắn Sói.

## 3. Actions
1 target.

## 4. Triggers / Rules
Override wolf decision.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
