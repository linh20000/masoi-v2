# Cô Bé

## 1. Identity
- **Role code:** `little-girl`
- **Group:** Village
- **Source name:** Cô Bé

## 2. Abilities
Từ đêm thứ hai, có thể hé mắt để nhận biết Sói; nếu bị Sói phát hiện sẽ bị giết.

## 3. Actions
Knowledge action.

## 4. Triggers / Rules
Death interaction đặc biệt.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
