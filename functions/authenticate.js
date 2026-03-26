import {
  createSessionCookie,
  normalizeNextPath,
  renderPasswordPage
} from "./_lib/auth";

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RULEBOOK_PASSWORD || !env.COOKIE_SECRET) {
    return new Response(
      "Missing Cloudflare secrets. Configure RULEBOOK_PASSWORD and COOKIE_SECRET before using the password gate.",
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const password = String(formData.get("password") || "");
  const nextPath = normalizeNextPath(String(formData.get("next") || "/"));

  if (password !== env.RULEBOOK_PASSWORD) {
    return new Response(
      renderPasswordPage({
        next: nextPath,
        errorMessage: "Incorrect password. Please try again."
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
          "Cache-Control": "private, no-store"
        }
      }
    );
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: nextPath,
      "Set-Cookie": await createSessionCookie(env.COOKIE_SECRET),
      "Cache-Control": "private, no-store"
    }
  });
}

export function onRequestGet() {
  return Response.redirect("/", 302);
}
