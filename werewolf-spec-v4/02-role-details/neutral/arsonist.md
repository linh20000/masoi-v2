# Kẻ đốt nhà

## 1. Identity
- **Role code:** `arsonist`
- **Group:** Neutral
- **Source name:** Kẻ đốt nhà

## 2. Abilities
Chọn 1 căn nhà để đốt; sáng hôm sau nhà bị loại và chủ nhà thành vô gia cư. Nếu là nhà nạn nhân Sói, nạn nhân sống và Sói đầu tiên bên phải chết. Dùng một lần.

## 3. Actions
1 house.

## 4. Triggers / Rules
One use; special wolf-victim interaction.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
