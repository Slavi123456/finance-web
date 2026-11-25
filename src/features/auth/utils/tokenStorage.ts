const KEY = "finance.refreshToken";

export function loadRefreshToken(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    //storage can be blocked (private mode, policies)
    return null;
  }
}

export function saveRefreshToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(KEY, token);
    else localStorage.removeItem(KEY);
  } catch {
    //ignore: the session just won't survive a reload
  }
}
