# Người đầy tớ tận tụy

## 1. Identity
- **Role code:** `devoted-servant`
- **Group:** Village/Variable
- **Source name:** Người đầy tớ tận tụy

## 2. Abilities
Khi có người bị làng vote treo cổ, có thể đổi card với nạn nhân và đóng vai role đó đến cuối game.

## 3. Actions
Vote victim.

## 4. Triggers / Rules
Role transformation.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
