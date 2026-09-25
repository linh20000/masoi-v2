# Thẩm phán lắp bắp

## 1. Identity
- **Role code:** `stuttering-judge`
- **Group:** Village
- **Source name:** Thẩm phán lắp bắp

## 2. Abilities
Đêm đầu cho Quản trò tín hiệu; một lần trong game có thể kích hoạt vote treo cổ thứ hai cùng buổi sáng.

## 3. Actions
Day action.

## 4. Triggers / Rules
Limit 1/game.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
