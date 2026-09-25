# Thầy thôi miên

## 1. Identity
- **Role code:** `hypnotist`
- **Group:** Village/Neutral
- **Source name:** Thầy thôi miên

## 2. Abilities
Mỗi đêm chọn 1 người; nếu Hypnotist chết đêm đó, người bị mê hoặc chết thay; không chọn cùng người 2 đêm liên tiếp.

## 3. Actions
1 target.

## 4. Triggers / Rules
Death substitution.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
