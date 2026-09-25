# Dược sĩ

## 1. Identity
- **Role code:** `pharmacist`
- **Group:** Village
- **Source name:** Dược sĩ

## 2. Abilities
Hai bình: Thuốc mê làm mất nói và vote 1 ngày; Hồi phục cứu người bị Witch giết. Mỗi chức năng một lần.

## 3. Actions
1 target per potion.

## 4. Triggers / Rules
Limited consumables.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
