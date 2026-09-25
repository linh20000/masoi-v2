# Sát thủ

## 1. Identity
- **Role code:** `assassin`
- **Group:** Neutral
- **Source name:** Sát thủ

## 2. Abilities
Mỗi 2 đêm, nếu đạt 4 phiếu hướng vào Assassin thì được chỉ định giết 1 người.

## 3. Actions
1 target.

## 4. Triggers / Rules
Vote threshold + cadence.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
