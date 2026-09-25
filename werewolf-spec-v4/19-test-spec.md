# 19 — Test Specification

## Test layers
1. Catalog/definition tests.
2. Rule/validator unit tests.
3. Effect tests.
4. Resolution integration tests.
5. Scenario tests.
6. WebSocket contract tests.
7. Reconnect tests.

## Mandatory scenarios
- Bodyguard same target consecutive nights → reject.
- Witch save + wolf attack → survive.
- Witch poison + Bodyguard → poison still resolves.
- Elder wolf bite vs hanging/poison/Hunter.
- Wolf Cub death → extra bite next night.
- Wild Child idol death → transform.
- Lovers death propagation.
- Devoted Servant execution swap.
- Father conversion.
- Arsonist house interaction.
- White Wolf wolf-kill.
- Wolf Brothers activation.
- Idiot execution survival and vote removal.
- Scapegoat tie.
- Moon Maiden disable scope.
- Raven vote modifier.

Mỗi scenario phải kiểm tra cả public event và private knowledge.
