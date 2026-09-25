# Tiên tri

## 1. Identity
- **Role code:** `seer`
- **Group:** Village
- **Source name:** Tiên tri

## 2. Abilities
Mỗi đêm soi 1 người để biết có phải Sói hay không.

## 3. Actions
1 mục tiêu mỗi đêm.

## 4. Triggers / Rules
Chết nếu bị Sói cắn.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
