# Con quạ

## 1. Identity
- **Role code:** `raven`
- **Group:** Village
- **Source name:** Con quạ

## 2. Abilities
Cuối mỗi đêm chọn 1 người; người đó nhận 2 phiếu chống vào sáng hôm sau.

## 3. Actions
1 mục tiêu.

## 4. Triggers / Rules
Vote modifier.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
