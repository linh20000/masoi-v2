# Sói lửa

## 1. Identity
- **Role code:** `fire-wolf`
- **Group:** Werewolf
- **Source name:** Sói lửa

## 2. Abilities
Khi ít nhất 1 Sói chết, đêm sau có thể vô hiệu hóa vĩnh viễn năng lực của 1 người; khi ít nhất 2 Sói chết, dùng thêm 1 lần.

## 3. Actions
1 target per use.

## 4. Triggers / Rules
Conditional charges.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
