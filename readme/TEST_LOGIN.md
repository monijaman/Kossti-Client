# Admin Login Test Summary

## Verified Flows (via curl)

### 1. ✅ Login Creates Proper Session

```bash
curl -c cookies.txt -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"token":"token1","refresh_token":"ref1","email":"admin@example.com"}'
→ Sets: admin_session, accessToken, refreshToken cookies
```
