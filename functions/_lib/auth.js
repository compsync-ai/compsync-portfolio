const encoder = new TextEncoder();

export const COOKIE_NAME = "rulebook_access";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function toBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function importHmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function signValue(secret, value) {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

async function verifyValue(secret, value, signature) {
  const key = await importHmacKey(secret);
  return crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64Url(signature),
    encoder.encode(value)
  );
}

export function parseCookieHeader(header) {
  if (!header) return {};

  return Object.fromEntries(
    header
      .split(";")
      .map((segment) => segment.trim())
      .filter(Boolean)
      .map((segment) => {
        const separatorIndex = segment.indexOf("=");
        if (separatorIndex === -1) return [segment, ""];
        return [segment.slice(0, separatorIndex), segment.slice(separatorIndex + 1)];
      })
  );
}

export function normalizeNextPath(candidate) {
  if (!candidate || typeof candidate !== "string") return "/";
  if (!candidate.startsWith("/")) return "/";
  if (candidate.startsWith("//")) return "/";
  return candidate;
}

export async function createSessionCookie(secret) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = JSON.stringify({ exp: expiresAt });
  const encodedPayload = toBase64Url(encoder.encode(payload));
  const signature = await signValue(secret, encodedPayload);
  const token = `${encodedPayload}.${signature}`;

  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function hasValidSession(request, secret) {
  if (!secret) return false;

  const cookies = parseCookieHeader(request.headers.get("Cookie"));
  const token = cookies[COOKIE_NAME];
  if (!token) return false;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const validSignature = await verifyValue(secret, encodedPayload, signature);
  if (!validSignature) return false;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload)));
    return typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function wantsHtml(request) {
  const accept = request.headers.get("Accept") || "";
  return accept.includes("text/html");
}

export function renderPasswordPage({ next = "/", errorMessage = "" } = {}) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rulebook Access</title>
    <style>
      :root {
        color-scheme: light;
        font-family: "Instrument Sans", "Segoe UI", sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(circle at top left, rgba(15, 118, 110, 0.08), transparent 24%),
          radial-gradient(circle at top right, rgba(180, 83, 9, 0.08), transparent 22%),
          linear-gradient(180deg, #fcfaf5 0%, #f6f2ea 100%);
        color: #1f2937;
      }

      .card {
        width: min(460px, 100%);
        padding: 32px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.78);
        border: 1px solid rgba(31, 41, 55, 0.1);
        box-shadow: 0 24px 60px rgba(33, 40, 52, 0.1);
      }

      .eyebrow {
        margin: 0;
        color: #0f766e;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      h1 {
        margin: 12px 0 0;
        font-size: clamp(32px, 5vw, 42px);
        line-height: 1.02;
        letter-spacing: -0.03em;
      }

      p {
        margin: 16px 0 0;
        color: #5d6a79;
        line-height: 1.75;
      }

      form {
        display: grid;
        gap: 14px;
        margin-top: 24px;
      }

      label {
        display: grid;
        gap: 8px;
        font-size: 14px;
        font-weight: 700;
        color: #334155;
      }

      input {
        width: 100%;
        min-height: 48px;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid rgba(31, 41, 55, 0.14);
        background: rgba(255, 255, 255, 0.78);
        font: inherit;
      }

      input:focus {
        outline: 2px solid rgba(15, 118, 110, 0.24);
        outline-offset: 2px;
      }

      button {
        min-height: 46px;
        border: 0;
        border-radius: 999px;
        background: #0f766e;
        color: white;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }

      .error {
        color: #b42318;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <p class="eyebrow">Protected Access</p>
      <h1>Enter password to open the rulebook</h1>
      <p>
        This documentation is shared privately. Use the password provided by CompSync to continue.
      </p>
      <form method="post" action="/authenticate">
        <input type="hidden" name="next" value="${next}" />
        <label>
          Password
          <input type="password" name="password" autocomplete="current-password" required />
        </label>
        ${errorMessage ? `<p class="error">${errorMessage}</p>` : ""}
        <button type="submit">Continue</button>
      </form>
    </main>
  </body>
</html>`;
}
