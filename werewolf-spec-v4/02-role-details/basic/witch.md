# Phù thủy

## 1. Identity
- **Role code:** `witch`
- **Group:** Village
- **Source name:** Phù thủy

## 2. Abilities
Có Bình Cứu và Bình Độc, mỗi bình một lần; có thể dùng cả hai cùng đêm nhưng hiệu lực của thuốc mất.

## 3. Actions
Nạn nhân Sói / 1 mục tiêu độc.

## 4. Triggers / Rules
Sau khi dùng bình mất chức năng tương ứng nhưng vẫn được gọi dậy và biết ai chết.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
