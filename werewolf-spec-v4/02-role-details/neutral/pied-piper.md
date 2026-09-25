# Người thổi sáo

## 1. Identity
- **Role code:** `pied-piper`
- **Group:** Third
- **Source name:** Người thổi sáo

## 2. Abilities
Mỗi đêm thôi miên 2 người; người bị thôi miên biết nhau; thắng khi tất cả người sống đều bị thôi miên.

## 3. Actions
2 mục tiêu.

## 4. Triggers / Rules
Win condition riêng.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
