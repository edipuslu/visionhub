import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";

function normalizeLoginId(loginId) {
  return String(loginId || "").trim().toLowerCase();
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function sha256(value) {
  return createHash("sha256").update(String(value || ""), "utf8").digest("hex");
}

function loadUsers() {
  const raw = process.env.VISIONHUB_USERS_JSON;

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function verifyPassword(user, password) {
  if (user.passwordSha256) {
    return safeEqual(sha256(password), user.passwordSha256);
  }

  if (user.password) {
    return safeEqual(password, user.password);
  }

  return false;
}

export async function POST(request) {
  const { loginId, password } = await request.json().catch(() => ({}));
  const normalizedLoginId = normalizeLoginId(loginId);

  if (!normalizedLoginId || !password) {
    return NextResponse.json({ error: "Enter your VisionHub ID and password." }, { status: 400 });
  }

  const user = loadUsers().find((entry) => normalizeLoginId(entry.loginId) === normalizedLoginId);

  if (!user || !verifyPassword(user, password)) {
    return NextResponse.json({ error: "Invalid VisionHub ID or password." }, { status: 401 });
  }

  return NextResponse.json({
    profile: {
      loginId: normalizedLoginId,
      email: user.email || `${normalizedLoginId}@visionhub.local`,
      role: user.role === "admin" ? "admin" : "client",
      company: user.company || null,
    },
  });
}
