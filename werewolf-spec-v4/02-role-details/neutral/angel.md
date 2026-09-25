# Thiên sứ

## 1. Identity
- **Role code:** `angel`
- **Group:** Neutral
- **Source name:** Thiên sứ

## 2. Abilities
Thắng nếu bị Sói cắn đêm đầu hoặc bị treo cổ sáng đầu; nếu không thì thành Dân thường.

## 3. Actions
Self-state.

## 4. Triggers / Rules
Transformation nếu thất bại.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
