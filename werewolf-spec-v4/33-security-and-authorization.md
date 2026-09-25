# 33 — Security and Authorization

> Không tin dữ liệu do client gửi; server phải xác thực quyền và ownership.

## 1. Roles trong security

```text
PLAYER
HOST
MODERATOR
ADMIN
SYSTEM
```

## 2. Quyền cơ bản

- PLAYER: chỉ thao tác với chính mình và game mà mình đang ở.
- HOST: bắt đầu ván, đổi phase nếu được config, quản lý room.
- MODERATOR: xem audit, cấm người chơi, tạm dừng phase nếu loại sự kiện.
- ADMIN: phòng, cấu hình, luật variant, deploy.
- SYSTEM: backend service, event processor.

## 3. Rules

- `actorId` phải trùng với session user của request.
- Không chấp nhận `playerId` do client tự đưa nếu không khớp session.
- Không cho phép gửi action nếu user không thuộc game.
- Không cho phép player xem role người khác nếu không có `knowledge` hợp lệ.
- Server phải filter knowledge trước khi broadcast.

## 4. API guard

```yaml
securityPolicy:
  requireAuthenticatedSession: true
  verifyPlayerBelongsToGame: true
  verifyRolePermission: true
  verifyIdempotency: true
  enforceRateLimit: true
```
