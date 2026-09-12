const SESSION_KEY = "visionhub_private_session";

export function savePrivateSession(profile, sessionToken = null) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ profile, sessionToken }));
}

export function readPrivateSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    const profile = session?.profile || session;
    if (!profile?.email || !profile?.role) return null;
    return { profile, sessionToken: session?.sessionToken || null };
  } catch {
    return null;
  }
}

export function readPrivateProfile() {
  return readPrivateSession()?.profile || null;
}

export function readSessionToken() {
  return readPrivateSession()?.sessionToken || null;
}

export function clearPrivateSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
