// This stores the frontend demo session only. Production authentication must be
// verified by a server; a browser-stored username is not an authentication token.
export const SESSION_KEY = "lms_user_session";

type SessionStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function createSessionStore(getStorage: () => SessionStorage, key = SESSION_KEY) {
  let current: string | null | undefined;
  const listeners = new Set<() => void>();

  function readStorage() {
    try {
      return getStorage().getItem(key);
    } catch {
      return current ?? null;
    }
  }

  return {
    getSnapshot() {
      if (current === undefined) current = readStorage();
      return current;
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    refresh() {
      current = readStorage();
      listeners.forEach((listener) => listener());
    },
    setSession(username: string | null) {
      // Keep login/logout usable when private browsing or browser policy blocks
      // storage. In that case this session lasts until the page is reloaded.
      current = username;
      try {
        if (username === null) getStorage().removeItem(key);
        else getStorage().setItem(key, username);
      } catch {
        // The in-memory session is still valid for this tab.
      }
      listeners.forEach((listener) => listener());
    },
  };
}
