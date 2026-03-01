import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  const supabase = await createClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (token_hash && type) {
    await supabase.auth.verifyOtp({ token_hash, type: type as any });
  }

  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/reset-password`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
// ```
// 
// ---
// 
// ## STEP 2 — Go to Supabase dashboard
// 
// **Authentication → URL Configuration:**
// 
// - **Site URL:** `http://localhost:3000`
// - **Redirect URLs:** add ``
// 
// **Authentication → Email Templates → Reset Password:**
// 
// Change the email link to:
// ```
// {{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery