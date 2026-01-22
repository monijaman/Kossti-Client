# Admin Login Test Summary

## Verified Flows (via curl)

### 1. ✅ Login Creates Proper Session

```bash
curl -c cookies.txt -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"token":"token1","refresh_token":"ref1","email":"admin@example.com"}'
→ Sets: admin_session, accessToken, refreshToken cookies
```

### 2. ✅ Session Check Works

```bash
curl -b cookies.txt http://localhost:3000/api/admin/session
→ Returns 200 if admin_session exists and non-empty
```

### 3. ✅ Logout Clears All Cookies

```bash
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/api/admin/logout
→ Clears all three cookies (maxAge: 0)
```

### 4. ✅ Re-login After Logout Works

```bash
# First login
curl -c cookies.txt -X POST http://localhost:3000/api/admin/login ...
# Session exists
curl -b cookies.txt http://localhost:3000/api/admin/session → 200
# Logout
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/api/admin/logout
# Session gone
curl -b cookies.txt http://localhost:3000/api/admin/session → 401
# Re-login
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/api/admin/login ...
# New session exists
curl -b cookies.txt http://localhost:3000/api/admin/session → 200 ✅
```

## Code Implementation

### Login Page: `src/app/admin/login/page.tsx`

- **Before Login**: Clears any stale session with `await fetch('/api/admin/logout')`
- **Wait 100ms**: Ensures cookies are cleared
- **Create Session**: POST to `/api/admin/login` with `credentials: 'include'`
- **Wait 500ms**: Lets cookies settle
- **Redirect**: Redirects to `/admin/dashboard`

### Logout Endpoint: `src/app/api/admin/logout/route.ts`

- Sets all three cookies with `maxAge: 0` to clear them
- Uses `path: '/'`, `secure: false`, `sameSite: 'lax'` for consistency

### Session Check: `src/app/api/admin/session/route.ts`

- Validates `admin_session` cookie exists
- Checks it's not empty: `.trim() !== ""`
- Returns 401 if invalid

## Known Working Pattern

When user attempts login:

1. Old session (if any) is **explicitly cleared** via `/api/admin/logout`
2. New session is **created fresh** via `/api/admin/login`
3. All cookies use **consistent attributes** (`path: '/'`, `secure: false`, `sameSite: 'lax'`)
4. **Timing delays** (100ms logout→login, 500ms login→redirect) ensure browser processes changes

## Next Steps for Browser Testing

To verify this works in browser:

1. Navigate to http://localhost:3000/admin/login
2. Enter credentials: admin@example.com / admin123
3. Should redirect to /admin/dashboard after successful login
4. Click logout button (AccountDropdown)
5. Should clear cookies and redirect to login
6. Try logging in again
7. Should create fresh session without old cookie interference

## Why This Works

- **API Level**: curl tests confirm endpoints properly set/clear cookies
- **Client Logic**: login page explicitly calls logout before login
- **Cookie Consistency**: All operations use same `path: '/'` and attributes
- **Timing**: Delays between operations allow browser to process

**Issue was**: When re-logging in, old cookies from previous session lingered → now explicitly cleared first
