# Werewolf Game Specification V4

## Canonical structure
```text
00-overview.md
01-role-spec.md
02-ability-spec.md
03-action-spec.md
04-trigger-spec.md
05-rule-spec.md
06-effect-spec.md
07-knowledge-spec.md
08-relationship-spec.md
09-transformation-spec.md
10-win-condition-spec.md
11-status-spec.md
12-event-spec.md
13-phase-flow-spec.md
14-database-spec.md
15-java-backend-architecture.md
16-websocket-protocol.md
17-flutter-client-architecture.md
18-asset-management.md
19-test-spec.md
20-deployment-spec.md
37-role-lifecycle-catalog.md

02-role-details/
03-non-role/
05-audit/
sources/
```

## Source of Truth order
`Role/Domain Spec → Runtime Specs → Backend/UI/Transport → Implementation`

## What was normalized
- 43 canonical Character Roles.
- Titles separated from roles.
- Lovers separated into Relationship.
- Blood Moon separated into Event.
- Raven Plus treated as variant.
- Wolf-Dog keeps conflicting source variants explicit.
- Asset, Test, Deployment are separate numbered specs.
- Generic UI selection is not treated as a domain Action.
- Role activation, call slots and first/normal night order are canonicalized in `37-role-lifecycle-catalog.md`.

## Implementation principle
`Role → Ability → Action → Validator → Rule → Effect → GameState → GameEvent`
