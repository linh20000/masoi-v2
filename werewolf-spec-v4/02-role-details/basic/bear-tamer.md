# Người thuần phục gấu

## 1. Identity
- **Role code:** `bear-tamer`
- **Group:** Village
- **Source name:** Người thuần phục gấu

## 2. Abilities
Nếu một trong hai người ngồi cạnh là Sói, Quản trò báo hiệu.

## 3. Actions
Adjacent knowledge check.

## 4. Triggers / Rules
Passive signal.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
