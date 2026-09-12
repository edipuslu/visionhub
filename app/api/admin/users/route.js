import { NextResponse } from "next/server";
import { getAdminClient, normalizeLoginId, requireAdminSession, sha256 } from "../../../../lib/portalStore";

export async function POST(request) {
  if (!requireAdminSession(request)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const supabase = getAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Database admin access is not configured." }, { status: 503 });
  }

  const { loginId, password, role, companyId, email, fullName } = await request.json().catch(() => ({}));
  const cleanLoginId = normalizeLoginId(loginId);
  const cleanPassword = String(password || "");

  if (!cleanLoginId || !cleanPassword) {
    return NextResponse.json({ error: "Login ID and password are required." }, { status: 400 });
  }

  if (cleanPassword.length < 8) {
    return NextResponse.json({ error: "Use a password with at least 8 characters." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("portal_users")
    .insert({
      login_id: cleanLoginId,
      email: String(email || "").trim() || null,
      full_name: String(fullName || "").trim() || null,
      role: role === "admin" ? "admin" : "client",
      password_hash: sha256(cleanPassword),
      company_id: companyId || null,
    })
    .select("id, login_id, email, full_name, role, company_id, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data }, { status: 201 });
}
