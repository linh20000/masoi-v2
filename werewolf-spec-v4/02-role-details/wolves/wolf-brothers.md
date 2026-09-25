# Anh Em Sói

## 1. Identity
- **Role code:** `wolf-brothers`
- **Group:** Werewolf
- **Source name:** Anh Em Sói

## 2. Abilities
Đêm đầu nhận biết nhau; Sói Anh hoạt động cùng Sói, Sói Em chưa thức cùng Sói. Khi Sói Anh chết, Sói Em giết 1 người và gia nhập phe Sói.

## 3. Actions
1 target on transformation.

## 4. Triggers / Rules
Transformation trigger.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
