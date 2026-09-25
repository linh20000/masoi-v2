# 20 — Deployment Specification

## VPS topology
```text
VPS 1 — Java Game Server
VPS 2 — Node/supporting service
VPS 3 — PostgreSQL
```

Mỗi service deploy độc lập bằng Docker Compose. Không bắt buộc Gateway.

## Java
`Dockerfile + compose.yml + env/secrets + healthcheck`

## Node
Node không được quyết định game state. Nếu chưa có nghiệp vụ bắt buộc, service có thể chưa triển khai.

## PostgreSQL
Backup, migration, monitoring và connection pooling phải độc lập.

## Voice
WebRTC/Voice Server có thể đặt VPS riêng nếu cần.

## Operations
- structured logs
- metrics
- health checks
- DB migrations
- snapshot/replay backup
- secret management
