# Già làng

## 1. Identity
- **Role code:** `elder`
- **Group:** Village
- **Source name:** Già làng

## 2. Abilities
Có hai mạng trước Sói cắn; treo cổ, Hunter bắn hoặc Witch giết thì chết ngay.

## 3. Actions
Không có action.

## 4. Triggers / Rules
Khi chết, các role đặc biệt của dân mất chức năng, trừ Hunter.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
