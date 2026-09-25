# Kẻ báo thù

## 1. Identity
- **Role code:** `avenger`
- **Group:** Variable
- **Source name:** Kẻ báo thù

## 2. Abilities
Đêm đầu chọn phe Sói hoặc Dân. Khi chết ban đêm, chọn 1 người; nếu chọn phe Sói thì giết Dân, nếu chọn phe Dân thì giết Sói.

## 3. Actions
1 faction + 1 target.

## 4. Triggers / Rules
Death trigger.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
