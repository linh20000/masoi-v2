# Werewolf Game Specification V4

## 1. Purpose
Bộ này là Source of Truth cho game Ma Sói online. Tài liệu tách rõ:
- Character Role
- Ability
- Action
- Trigger
- Rule
- Effect
- Knowledge
- Relationship
- Transformation
- Win Condition
- Status
- Event
- Phase
- Role activation and call order
- Runtime State
- Transport/UI/Infrastructure

## 2. Authoritative model
`Role → Ability → Action → Validator → Rule → Effect → GameState → GameEvent`

Role activation/call scheduling is governed by `37-role-lifecycle-catalog.md`;
`firstNightOrder`/`normalNightOrder` are never inferred from role existence
alone.

Java Game Server là authoritative. Flutter chỉ gửi command và render state/event được server cấp.

## 3. Stack
- Flutter
- Java / Spring Boot
- WebSocket
- PostgreSQL
- S3-compatible Object Storage
- WebRTC / Voice Service
- Docker Compose
- Các service deploy độc lập, không bắt buộc Gateway

## 4. Canonical terminology
- Role = nhân vật chính.
- Title = chức danh phụ.
- Relationship = quan hệ runtime giữa player.
- Event Card = sự kiện làm thay đổi ruleset.
- Variant = biến thể luật, không tự động gộp thành một rule.
- Runtime UUID = định danh instance; catalog `code` là immutable.

## 5. Source precedence
1. Rule đã được chốt trong game design.
2. Role Spec V3/V4.
3. Source role documents.
4. Implementation.

Nếu source có mâu thuẫn, ghi vào `05-audit/review-report.md`, không tự ý phát minh luật.
