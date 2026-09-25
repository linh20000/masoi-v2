# Hiệp sĩ kiếm gỉ

## 1. Identity
- **Role code:** `rusty-sword-knight`
- **Group:** Village
- **Source name:** Hiệp sĩ kiếm gỉ

## 2. Abilities
Nếu bị Sói cắn, Hiệp sĩ chết và Sói cắn bị thương, sống thêm 1 ngày đêm rồi chết.

## 3. Actions
Death trigger.

## 4. Triggers / Rules
Delayed death.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
