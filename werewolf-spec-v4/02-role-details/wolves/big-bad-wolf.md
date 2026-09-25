# Sói lớn xấu xa

## 1. Identity
- **Role code:** `big-bad-wolf`
- **Group:** Werewolf
- **Source name:** Sói lớn xấu xa

## 2. Abilities
Khi chưa có Sói/Sói con/Wild Child/Wolf-Dog chết theo điều kiện nguồn, có thể thức thêm để cắn người thứ hai.

## 3. Actions
1 additional target.

## 4. Triggers / Rules
Conditional extra kill.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
