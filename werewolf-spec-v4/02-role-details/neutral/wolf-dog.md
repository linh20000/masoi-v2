# Nửa người Nửa sói / Chó sói / Bán Sói

## 1. Identity
- **Role code:** `wolf-dog`
- **Group:** Variant
- **Source name:** Nửa người Nửa sói / Chó sói / Bán Sói

## 2. Abilities
Nguồn có hai biến thể: chọn Dân hoặc Sói khi bắt đầu; hoặc bị Sói cắn không chết mà hóa Sói.

## 3. Actions
Phụ thuộc variant.

## 4. Triggers / Rules
Transformation theo variant.

## 5. Engine Contract
Role không trực tiếp mutate `GameState`. Server resolve theo:
`Action → Validator → Rule → Effect → GameEvent`.

## 6. UI Contract
Flutter nhận `ActionDefinition` từ server và render control tương ứng; không hardcode logic thắng/thua hoặc resolution ở client.

## 7. Source Note
Chi tiết role phải được đối chiếu với `SOURCE_full_role.md` và `SOURCE_pack.md` trước khi biến thành rule executable.
