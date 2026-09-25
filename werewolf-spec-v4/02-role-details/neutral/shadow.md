# Ảnh tử

## 1. Identity
- **Role code:** `shadow`
- **Group:** Neutral
- **Source name:** Ảnh tử

## 2. Abilities
Đêm đầu chọn 1 người. Nếu mục tiêu sống, Shadow có điều kiện thắng như Dân; nếu mục tiêu chết, Shadow lấy card và trở thành nhân vật đó.

## 3. Actions
1 target.

## 4. Triggers / Rules
Conditional transformation.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
