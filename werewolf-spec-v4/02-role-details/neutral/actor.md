# Diễn viên

## 1. Identity
- **Role code:** `actor`
- **Group:** Village/Variant
- **Source name:** Diễn viên

## 2. Abilities
Thêm 3 role cards bên ngoài; trong 3 đêm đầu có thể đổi card; sau đêm 3 trở thành Dân thường.

## 3. Actions
1 card swap.

## 4. Triggers / Rules
Transformation after night 3.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
