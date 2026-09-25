# 34 — Moderator and Disconnect Rules

> Quản trò và disconnect cần được quy định rõ để tránh game bị treo.

## 1. Disconnect policy

```yaml
disconnectPolicy:
  gracePeriodSeconds: 60
  autoPassAction: true
  allowReconnect: true
  maxReconnectMinutes: 15
```

## 2. AFK policy

- Nếu player không reply trong timeout, server auto-pass action nếu action optional.
- Nếu player là actor bắt buộc, server dùng `defaultAction` nếu scenario có, nếu không thì `PASS`.

## 3. Host leave

- Nếu host disconnect, chuyển quyền host cho player còn sống/đủ quyền đầu tiên trong room.
- Nếu không còn host hợp lệ, host hệ thống giữ quyền quản trị.

## 4. Pause / resume

- Chỉ host hoặc moderator mới được pause.
- Phase không được chuyển khi đang pause.
- Replay và snapshot phải lưu trạng thái trước khi pause.

## 5. Game end

- Khi game kết thúc, tất cả action sau đó reject với `WIN_ALREADY_DECLARED`.
