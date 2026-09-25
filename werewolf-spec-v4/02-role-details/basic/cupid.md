# Thần tình yêu

## 1. Identity
- **Role code:** `cupid`
- **Group:** Village
- **Source name:** Thần tình yêu

## 2. Abilities
Đêm đầu chọn 2 người để tạo cặp đôi.

## 3. Actions
2 mục tiêu.

## 4. Triggers / Rules
Relationship Lovers được tạo; năng lực dùng một lần.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
