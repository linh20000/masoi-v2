# Thợ săn

## 1. Identity
- **Role code:** `hunter`
- **Group:** Village
- **Source name:** Thợ săn

## 2. Abilities
Chọn 1 người mỗi đêm; nếu Thợ săn chết bởi Sói, mục tiêu đã chọn chết theo. Nếu mục tiêu chết trước trong đêm, Thợ săn không chết theo. Nếu bị treo cổ có thể kéo 1 người chết cùng.

## 3. Actions
1 mục tiêu.

## 4. Triggers / Rules
Trigger khi chết.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
