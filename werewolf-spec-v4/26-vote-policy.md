# 26 — Vote Policy

Vote là domain action `vote.execution`, nhưng kết quả được xử lý bởi Vote Policy.

## Canonical rules

- Chỉ player sống và `canVote=true` mới vote.
- `SILENCED` chỉ chặn nói/chat; không chặn vote.
- `VOTE_DISABLED` chặn vote.
- Vote đổi được nếu scenario đặt `allowVoteChange=true`; vote cuối hợp lệ được tính.
- Abstain không tạo hòa.
- Raven modifier cộng vào target; không cộng vào voter.
- Title weight áp dụng sau modifier và trước xác nhận target.

## Tie policy

```yaml
voteTiePolicy: SCAPEGOAT_IF_PRESENT_ELSE_NO_EXECUTION
```

Nếu nhiều target cùng cao nhất, Scapegoat còn sống thì Scapegoat bị loại; nếu không thì không execution.

## Canonical pipeline

```text
valid votes
→ apply target modifiers
→ apply title weights
→ remove invalid targets
→ find highest count
→ apply tie policy
→ determine execution target
```
