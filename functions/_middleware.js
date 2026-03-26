import {
  clearSessionCookie,
  hasValidSession,
  normalizeNextPath,
  renderPasswordPage,
  wantsHtml
} from "./_lib/auth";

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (!env.RULEBOOK_PASSWORD || !env.COOKIE_SECRET) {
    return new Response(
      "Missing Cloudflare secrets. Configure RULEBOOK_PASSWORD and COOKIE_SECRET before using the password gate.",
      { status: 500 }
    );
  }

  if (url.pathname === "/authenticate") {
    return next();
  }

  if (url.pathname === "/logout") {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
        "Set-Cookie": clearSessionCookie()
      }
    });
  }

  if (await hasValidSession(request, env.COOKIE_SECRET)) {
    return next();
  }

  if (request.method === "GET" && wantsHtml(request)) {
    const nextPath = normalizeNextPath(`${url.pathname}${url.search}`);
    return new Response(renderPasswordPage({ next: nextPath }), {
      status: 401,
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
        "Cache-Control": "private, no-store"
      }
    });
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "Cache-Control": "private, no-store"
    }
  });
}
