import { NextResponse } from "next/server";
import { getAdminClient, loadEnvUsers, requireAdminSession } from "../../../../lib/portalStore";

export async function GET(request) {
  if (!requireAdminSession(request)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const supabase = getAdminClient();

  if (!supabase) {
    const envCompanies = loadEnvUsers().reduce((companies, user) => {
      if (!user.company) return companies;
      const existing = companies.find((company) => company.name === user.company);
      if (!existing) {
        companies.push({
          id: user.company,
          name: user.company,
          status: "Configured",
          description: "Loaded from server environment",
          portal_users: [{ login_id: user.loginId, role: user.role || "client" }],
        });
      } else {
        existing.portal_users.push({ login_id: user.loginId, role: user.role || "client" });
      }
      return companies;
    }, []);

    return NextResponse.json({ companies: envCompanies, mode: "env" });
  }

  const { data, error } = await supabase
    .from("companies")
    .select("id, name, status, description, created_at, portal_users(id, login_id, email, full_name, role)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ companies: data || [], mode: "database" });
}

export async function POST(request) {
  if (!requireAdminSession(request)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const supabase = getAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Database admin access is not configured." }, { status: 503 });
  }

  const { name, description, status } = await request.json().catch(() => ({}));
  const cleanName = String(name || "").trim();

  if (!cleanName) {
    return NextResponse.json({ error: "Company name is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("companies")
    .insert({
      name: cleanName,
      description: String(description || "").trim(),
      status: status === "Draft" ? "Draft" : "Active",
    })
    .select("id, name, status, description, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ company: data }, { status: 201 });
}
