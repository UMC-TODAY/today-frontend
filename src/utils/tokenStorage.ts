export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const AUTH_KEY = "today_auth";

type Tokens = { accessToken: string; refreshToken: string };

function getStorage(key: string): Storage | null {
    if (localStorage.getItem(key)) return localStorage;
    if (sessionStorage.getItem(key)) return sessionStorage;
    return null;
}

export function getTokens(): Tokens | null {
    const storage = getStorage(ACCESS_TOKEN_KEY) || getStorage(REFRESH_TOKEN_KEY);
    if (!storage) return null;

    const accessToken = storage.getItem(ACCESS_TOKEN_KEY) || "";
    const refreshToken = storage.getItem(REFRESH_TOKEN_KEY) || "";
    if (!accessToken && !refreshToken) return null;

    return { accessToken, refreshToken };
}

export function setTokens(tokens: Tokens) {
    const storage = getStorage(REFRESH_TOKEN_KEY) || getStorage(ACCESS_TOKEN_KEY) || localStorage;

    storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearAuth() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_KEY);

    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_KEY);
}