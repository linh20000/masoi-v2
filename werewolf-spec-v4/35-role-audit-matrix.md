# 35 — Role Audit Matrix

> File này kiểm tra 43 role có đủ điều kiện implementation hay chưa.

## 1. Trạng thái role

```text
DRAFT
SOURCE_MAPPED
RULE_DEFINED
READY
BLOCKED
```

## 2. Matrix mẫu

```yaml
witch:
  status: READY
  hasRoleDefinition: true
  hasAbilityDefinitions: true
  hasActionDefinitions: true
  hasRuleDefinitions: true
  hasEffectDefinitions: true
  hasPrivateKnowledge: true
  hasTests: true

werewolf:
  status: READY
  hasRoleDefinition: true
  hasAbilityDefinitions: true
  hasActionDefinitions: true
  hasRuleDefinitions: true
  hasEffectDefinitions: true
  hasPrivateKnowledge: true
  hasTests: true

wolf-dog:
  status: BLOCKED
  reason: requires explicit variant selection
```

## 3. Scope

- `status` phải được cập nhật khi role được thêm hoặc sửa.
- Role `BLOCKED` phải có `reason` rõ ràng.
- Không được giữ role `READY` nếu chưa có test scenario.
