# Sói thường

## 1. Identity
- **Role code:** `werewolf`
- **Group:** Werewolf
- **Source name:** Sói thường

## 2. Abilities
Mỗi đêm cùng phe Sói chọn người để cắn; có thể không cắn hoặc tự cắn lẫn nhau.

## 3. Actions
1 mục tiêu.

## 4. Triggers / Rules
Phe Sói.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
