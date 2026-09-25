# Ăn trộm

## 1. Identity
- **Role code:** `thief`
- **Group:** Variable
- **Source name:** Ăn trộm

## 2. Abilities
Đêm đầu chọn 1 trong 2 lá chức năng bên ngoài; nếu ít nhất một là Sói thì bắt buộc chọn Sói.

## 3. Actions
1 trong 2 role cards.

## 4. Triggers / Rules
Transformation/role selection.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
