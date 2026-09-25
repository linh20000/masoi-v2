# 18 — Asset Management

## Rule
PostgreSQL chỉ lưu `assetKey`; binary không nằm trong DB.

Example:
`cards/roles/seer.webp`

## Storage
- Dev/self-host: MinIO.
- Production: S3-compatible / Cloudflare R2 / S3.

## Namespaces
- `cards/roles/*`
- `cards/events/*`
- `ui/*`
- `avatars/*`

Game assets và user avatars tách namespace/bucket.

## Cache
Dùng `assetVersion` hoặc content hash để cache busting.
