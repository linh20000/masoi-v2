# Bảo vệ / Cảnh vệ

## 1. Identity
- **Role code:** `bodyguard`
- **Group:** Village
- **Source name:** Bảo vệ / Cảnh vệ

## 2. Abilities
Mỗi đêm bảo vệ 1 người, có thể tự bảo vệ; không bảo vệ cùng một người liên tiếp 2 đêm.

## 3. Actions
1 mục tiêu mỗi đêm.

## 4. Triggers / Rules
Không cứu được người bị Phù thủy đầu độc.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
