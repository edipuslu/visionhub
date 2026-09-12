import { createClient } from "@supabase/supabase-js";
import { createHash, createHmac, timingSafeEqual } from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sessionSecret = process.env.VISIONHUB_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export function normalizeLoginId(loginId) {
  return String(loginId || "").trim().toLowerCase();
}

export function sha256(value) {
  return createHash("sha256").update(String(value || ""), "utf8").digest("hex");
}

export function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function unbase64url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function signSession(profile) {
  if (!sessionSecret) {
    return null;
  }

  const payload = base64url(JSON.stringify({
    loginId: normalizeLoginId(profile.loginId),
    role: profile.role === "admin" ? "admin" : "client",
    companyId: profile.companyId || null,
    exp: Date.now() + 1000 * 60 * 60 * 12,
  }));
  const signature = createHmac("sha256", sessionSecret).update(payload).digest("base64url");

  return `${payload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!sessionSecret || !token || !token.includes(".")) {
    return null;
  }

  const [payload, signature] = token.split(".");
  const expected = createHmac("sha256", sessionSecret).update(payload).digest("base64url");

  if (!safeEqual(signature, expected)) {
    return null;
  }

  try {
    const session = JSON.parse(unbase64url(payload));
    if (!session.loginId || !session.role || Date.now() > Number(session.exp || 0)) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function requireAdminSession(request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const session = verifySessionToken(token);

  return session?.role === "admin" ? session : null;
}

export function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function loadEnvUsers() {
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

export function verifyPassword(user, password) {
  if (user?.password_hash) {
    return safeEqual(sha256(password), user.password_hash);
  }

  if (user?.passwordSha256) {
    return safeEqual(sha256(password), user.passwordSha256);
  }

  if (user?.password) {
    return safeEqual(password, user.password);
  }

  return false;
}

export async function findPortalUser(loginId) {
  const normalizedLoginId = normalizeLoginId(loginId);
  const supabase = getAdminClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("portal_users")
      .select("id, login_id, email, full_name, role, password_hash, company_id, companies(name)")
      .eq("login_id", normalizedLoginId)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        loginId: data.login_id,
        email: data.email,
        fullName: data.full_name,
        role: data.role,
        password_hash: data.password_hash,
        companyId: data.company_id,
        company: data.companies?.name || null,
      };
    }
  }

  const envUser = loadEnvUsers().find((entry) => normalizeLoginId(entry.loginId) === normalizedLoginId);

  if (!envUser) {
    return null;
  }

  return {
    ...envUser,
    loginId: normalizedLoginId,
    email: envUser.email || `${normalizedLoginId}@visionhub.local`,
    role: envUser.role === "admin" ? "admin" : "client",
  };
}
