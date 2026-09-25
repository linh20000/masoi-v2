# 03 — Action Specification

Action là command player gửi server. `24-action-registry.md` là **nguồn duy nhất** cho action code, metadata, validation và event contract.

## Canonical contract

```json
{
  "type": "ACTION_REQUEST",
  "gameId": "game-001",
  "playerId": "player-01",
  "clientRequestId": "uuid",
  "actionCode": "seer.inspect_player",
  "targets": ["player-05"],
  "payload": {},
  "submittedAt": "2026-09-25T12:00:00Z"
}
```

Action phải được xác thực theo pipeline:

```text
Command → Actor/Phase Validation → Target Validation → Rule Evaluation → Resolution → Events
```

## Canonical action codes

Action code dùng namespace lowercase, ví dụ:

- `seer.inspect_player`
- `bodyguard.protect_player`
- `witch.heal_target`
- `witch.poison_target`
- `hunter.mark_target`
- `hunter.shoot`
- `werewolf.select_victim`
- `white_wolf.kill`
- `werewolf.extra_kill`
- `father_wolf.convert_victim`
- `cupid.link_lovers`
- `wild_child.choose_idol`
- `wolf_dog.choose_alignment`
- `fox.inspect_group`
- `raven.curse_target`
- `pied_piper.bewitch_player`
- `arsonist.burn_house`
- `pharmacist.use_sedative`
- `pharmacist.use_restorative`
- `knight.check_wolf`
- `moon_maiden.disable_ability`
- `assassin.kill`
- `avenger.choose_target`
- `vote.execution`
- `title.transfer`

Tên uppercase trong source cũ chỉ là legacy aliases, không dùng để tạo action mới.

## Action vs Effect

Action là intent của player; Effect là mutation sau resolution. Client không tự quyết định action hợp lệ, death, transformation hoặc win condition.
