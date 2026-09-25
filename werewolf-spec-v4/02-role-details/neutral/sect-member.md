# Thành viên giáo phái

## 1. Identity
- **Role code:** `sect-member`
- **Group:** Third
- **Source name:** Thành viên giáo phái

## 2. Abilities
Làng chia thành 2 nhóm theo đặc điểm; nhân vật thuộc một nhóm và thắng khi loại hết nhóm đối địch.

## 3. Actions
Không có ability đặc biệt.

## 4. Triggers / Rules
Win condition riêng.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
