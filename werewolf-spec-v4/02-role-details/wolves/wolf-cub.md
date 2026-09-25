# Sói con

## 1. Identity
- **Role code:** `wolf-cub`
- **Group:** Werewolf
- **Source name:** Sói con

## 2. Abilities
Như Sói thường; khi Sói con chết, đêm sau phe Sói được cắn 2 người.

## 3. Actions
Theo action của phe Sói.

## 4. Triggers / Rules
Trigger sau cái chết của Sói con.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
