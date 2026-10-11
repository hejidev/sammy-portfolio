# Security & operations checklist

## Before first production deploy

1. **Rotate MongoDB password** — credentials were shared in chat; issue a new Atlas DB user password and update `MONGODB_URI`.
2. **Atlas Network Access** — add your current IP for local dev, or `0.0.0.0/0` only if you accept the risk; prefer allowlisting Render/Railway egress IPs.
3. **Gmail App Password** — enable 2FA on the admin Gmail, create an App Password, set `SMTP_USER` / `SMTP_PASS` / `MAIL_FROM`.
4. **Cloudinary** — create a cloud, copy cloud name + API key + secret into API env. Uploads fail gracefully until set.
5. **SESSION_SECRET** — generate a long random string (32+ chars).
6. **ADMIN_EMAILS** — only the designer’s email(s).

## Rate limits (already in API)

| Route | Window | Max |
|-------|--------|-----|
| Global | 15 min | 300 |
| `/auth/*` | 15 min | 20 |
| `/contact` | 15 min | 10 |

## Cross-origin cookies

Production admin login (Vercel web + separate API host) uses `sameSite: 'none'` and `secure: true`. Ensure `WEB_URL` matches the exact frontend origin.
