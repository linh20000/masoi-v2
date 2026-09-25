# Người cha của sói

## 1. Identity
- **Role code:** `father-of-werewolves`
- **Group:** Werewolf
- **Source name:** Người cha của sói

## 2. Abilities
Một lần trong game biến nạn nhân vừa bị Sói cắn thành Sói thay vì chết.

## 3. Actions
Wolf victim.

## 4. Triggers / Rules
Transformation.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
