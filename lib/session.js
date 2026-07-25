const SESSION_KEY = "visionhub_private_session";

export function savePrivateSession(profile) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
}

export function readPrivateSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const profile = JSON.parse(raw);
    if (!profile?.email || !profile?.role) return null;
    return profile;
  } catch {
    return null;
  }
}

export function clearPrivateSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
