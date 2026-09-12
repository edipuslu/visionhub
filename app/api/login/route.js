import { NextResponse } from "next/server";
import { findPortalUser, normalizeLoginId, verifyPassword } from "../../../lib/portalStore";

export async function POST(request) {
  const { loginId, password } = await request.json().catch(() => ({}));
  const normalizedLoginId = normalizeLoginId(loginId);

  if (!normalizedLoginId || !password) {
    return NextResponse.json({ error: "Enter your VisionHub ID and password." }, { status: 400 });
  }

  const user = await findPortalUser(normalizedLoginId);

  if (!user || !verifyPassword(user, password)) {
    return NextResponse.json({ error: "Invalid VisionHub ID or password." }, { status: 401 });
  }

  return NextResponse.json({
    profile: {
      id: user.id || null,
      loginId: normalizedLoginId,
      email: user.email || `${normalizedLoginId}@visionhub.local`,
      fullName: user.fullName || null,
      role: user.role === "admin" ? "admin" : "client",
      companyId: user.companyId || null,
      company: user.company || null,
    },
  });
}
