# Dân làng / Dân thường

## 1. Identity
- **Role code:** `villager`
- **Group:** Village
- **Source name:** Dân làng / Dân thường

## 2. Abilities
Không có chức năng đêm đặc biệt; thảo luận, suy luận và bỏ phiếu.

## 3. Actions
Không có.

## 4. Triggers / Rules
Chết nếu bị Sói cắn.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
