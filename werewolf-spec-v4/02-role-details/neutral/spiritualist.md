# Bà đồng

## 1. Identity
- **Role code:** `spiritualist`
- **Group:** Village/Title interaction
- **Source name:** Bà đồng

## 2. Abilities
Nguồn mô tả 5 lần; chọn một trong 4 câu hỏi Gọi hồn, truyền cho người sống hỏi người chết đầu tiên trả lời Có/Không.

## 3. Actions
Question + 1 player.

## 4. Triggers / Rules
Event card interaction.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
