# Thằng ngốc

## 1. Identity
- **Role code:** `idiot`
- **Group:** Village
- **Source name:** Thằng ngốc

## 2. Abilities
Nếu bị vote treo cổ, lật bài và sống; mất quyền bỏ phiếu. Nếu là Sheriff thì chuyển chức vụ.

## 3. Actions
Không có action đêm.

## 4. Triggers / Rules
Vẫn chết nếu bị Hunter bắn hoặc Sói cắn.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
