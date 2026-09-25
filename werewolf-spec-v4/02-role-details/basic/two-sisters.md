# Hai chị em

## 1. Identity
- **Role code:** `two-sisters`
- **Group:** Village
- **Source name:** Hai chị em

## 2. Abilities
Đêm đầu nhận biết nhau.

## 3. Actions
Knowledge.

## 4. Triggers / Rules
Không có ability khác.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
