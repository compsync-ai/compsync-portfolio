# Cloudflare Password Gate Setup

This branch protects the rulebook using Cloudflare Pages Functions, Cloudflare Secrets, and a signed cookie.

## What is included

- `functions/_middleware.js`
  - Blocks unauthenticated access to the rulebook site
  - Returns a password page for HTML requests
  - Returns `401 Unauthorized` for other unauthenticated requests
- `functions/authenticate.js`
  - Accepts the password form POST
  - Verifies the submitted password
  - Sets the signed auth cookie on success
- `functions/_lib/auth.js`
  - Shared helpers for cookie parsing, signing, verification, and rendering the password page

## Required Cloudflare secrets

In the Cloudflare Pages project for the rulebook, add these secrets:

- `RULEBOOK_PASSWORD`
  - The shared password you will provide to clients
- `COOKIE_SECRET`
  - A long random secret used to sign the access cookie

## Where to add secrets

Cloudflare dashboard:

1. Open the Pages project
2. Go to `Settings`
3. Go to `Variables and Secrets`
4. Add both values as encrypted secrets

## How the flow works

1. User opens the rulebook site
2. Middleware checks for a valid auth cookie
3. If missing, Cloudflare returns a password page
4. User submits the password to `/authenticate`
5. If correct, Cloudflare sets a signed cookie and redirects back to the requested page
6. If wrong, the password page is shown again with an error message

## Logout

The password gate supports:

- `/logout`

Visiting that path clears the auth cookie and redirects back to `/`

## Session behavior

- The auth cookie is HTTP-only
- The auth cookie is marked `Secure`
- The auth cookie uses `SameSite=Lax`
- Session lifetime is currently 12 hours

If you want a shorter or longer session, update `SESSION_MAX_AGE_SECONDS` in:

- `functions/_lib/auth.js`

## Local development note

This auth layer runs on Cloudflare Pages Functions. It will not behave exactly the same in a plain local Vite dev server unless you use Cloudflare local tooling.

For basic local UI work, keep using the Vite dev server.
For auth testing, use a Cloudflare Pages preview or local Cloudflare tooling.

## Security notes

- Do not store the password in frontend code
- Do not store the password in `VITE_*` environment variables
- Use a strong random value for `COOKIE_SECRET`
- Rotate `RULEBOOK_PASSWORD` and `COOKIE_SECRET` if needed

## If you need to change the password

1. Update `RULEBOOK_PASSWORD` in Cloudflare secrets
2. Redeploy if needed
3. Optionally rotate `COOKIE_SECRET` to invalidate all active sessions immediately
