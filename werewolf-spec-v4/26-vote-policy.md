# 26 — Vote Policy

> Ticket bỏ phiếu phải được hiểu như một system riêng biệt, không gộp vào action event.

## 1. Cấu trúc vote

```json
{
  "voteId": "vote-001",
  "voterId": "player-01",
  "targetId": "player-07",
  "weight": 1,
  "modifierSources": ["raven"],
  "status": "VALID",
  "submittedAt": "2026-09-25T08:00:00Z"
}
```

## 2. Quy tắc mặc định

- Chỉ người sống mới vote.
- Người chết và bị SILENCED không được vote nếu `voteDisabled`.
- Vote của người đã bị mất quyền vote bị hủy.
- Vote được đổi nhiều lần nếu `allowVoteChange=true`; vote hợp lệ cuối cùng là vote tính.
- Abstain không tạo hòa.
- Hòa phiếu theo `voteTiePolicy`.

## 3. Tie policy mặc định

```yaml
voteTiePolicy: SCAPEGOAT_IF_PRESENT_ELSE_NO_EXECUTION
```

Nếu đồ thị vote có nhiều target cùng số phiếu cao nhất:

- Nếu có Scapegoat và còn sống -> Scapegoat chết.
- Nếu không có Scapegoat -> không execution.

## 4. Modifier policy

- Raven modifier được cộng vào target.
- Vote modifier không được cộng vào người bỏ phiếu.
- Title multiplier được áp dụng trước khi xác nhận execution target.

## 5. Sheriff / Mayor policy

- Nếu title có weight > 1, weight được tính trên `voteCount` cuối cùng.
- Nếu title mất quyền vote, weight bị loại.
- Title không được truyền sang người khác nếu không có `allowTitleTransfer`.

## 6. Vote result

```text
valid votes
→ apply modifiers
→ apply title weights
→ remove invalid targets
→ find highest count
→ apply tie policy
→ determine execution target
```
