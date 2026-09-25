# Nguyệt Nữ

## 1. Identity
- **Role code:** `moon-maiden`
- **Group:** Village
- **Source name:** Nguyệt Nữ

## 2. Abilities
Mỗi đêm chọn 1 người để vô hiệu hóa kỹ năng đêm; không vô hiệu hóa Guard và kỹ năng ban ngày.

## 3. Actions
1 target.

## 4. Triggers / Rules
Night disable.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
