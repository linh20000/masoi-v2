# Sói trắng

## 1. Identity
- **Role code:** `white-werewolf`
- **Group:** Werewolf
- **Source name:** Sói trắng

## 2. Abilities
Thức cùng Sói để cắn 1 người; sau đó có thể thức riêng để giết 1 Sói.

## 3. Actions
1 mục tiêu sau pha Sói.

## 4. Triggers / Rules
Mục tiêu thắng: người duy nhất còn sống.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
