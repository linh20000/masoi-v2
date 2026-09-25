# Đứa trẻ hoang dã

## 1. Identity
- **Role code:** `wild-child`
- **Group:** Village → Werewolf
- **Source name:** Đứa trẻ hoang dã

## 2. Abilities
Đầu game chọn một người; nếu người đó chết, Wild Child thành Sói.

## 3. Actions
1 idol target.

## 4. Triggers / Rules
Transformation trigger.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
