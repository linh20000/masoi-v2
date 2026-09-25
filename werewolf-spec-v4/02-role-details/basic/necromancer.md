# Người gọi hồn

## 1. Identity
- **Role code:** `necromancer`
- **Group:** Neutral
- **Source name:** Người gọi hồn

## 2. Abilities
Mỗi đêm hỏi người chết gần nhất chỉ vào người họ nghi ngờ; người chết không được nói.

## 3. Actions
Latest dead.

## 4. Triggers / Rules
Knowledge from dead.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
