# Người thế thân

## 1. Identity
- **Role code:** `scapegoat`
- **Group:** Village
- **Source name:** Người thế thân

## 2. Abilities
Nếu vote hòa thì bị loại; khi bị loại được chọn người được tham gia vote sáng hôm sau.

## 3. Actions
Danh sách người được vote.

## 4. Triggers / Rules
Trigger vote tie.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
