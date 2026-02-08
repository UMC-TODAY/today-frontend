export const ACCESS_TOKEN_KEY = "accessToken";
export const AUTH_KEY = "today_auth";

function getStorage(key: string): Storage | null {
    if (localStorage.getItem(key)) return localStorage;
    if (sessionStorage.getItem(key)) return sessionStorage;
    return null;
}

export function getAccessToken(): string | null {
    const storage = getStorage(ACCESS_TOKEN_KEY);
    if (!storage) return null;
    return storage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(accessToken: string) {
    const storage = getStorage(ACCESS_TOKEN_KEY) || localStorage;
    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function clearAuth() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(AUTH_KEY);

    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_KEY);
}