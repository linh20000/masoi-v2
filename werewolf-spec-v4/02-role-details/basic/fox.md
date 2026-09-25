# Cáo

## 1. Identity
- **Role code:** `fox`
- **Group:** Village
- **Source name:** Cáo

## 2. Abilities
Mỗi đêm chọn 3 người; nếu có Sói thì giữ năng lực, nếu không có Sói thì mất năng lực.

## 3. Actions
3 mục tiêu.

## 4. Triggers / Rules
Ability loss trigger.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
