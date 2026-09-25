# Con Quạ (Bản Plus)

## 1. Identity
- **Role code:** `raven-plus`
- **Group:** Variant
- **Source name:** Con Quạ (Bản Plus)

## 2. Abilities
Đặt lời nguyền lên 1 người; sáng hôm sau người đó tự động nhận 2 phiếu vote.

## 3. Actions
1 target.

## 4. Triggers / Rules
Variant of Raven.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
