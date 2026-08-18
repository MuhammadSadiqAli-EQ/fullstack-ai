/**
 * Auth service — handles login, signup, and token management.
 *
 * Pattern:
 * - Access token: Saved in-memory (JS variable). Safest route to prevent XSS sniffing.
 * - Refresh token: Saved in HttpOnly cookie by backend. JS has no access to it.
 */
import Cookies from "js-cookie";
import { apiFetch } from "./api";
import type { AuthData, AuthTokens } from "./types";

// ─── Token storage (In-memory) ───────────────────────────────────

let memoryAccessToken: string | null = null;


export function getAccessToken(): string | null {
  return memoryAccessToken;
}

export function storeTokens(tokens: AuthTokens): void {
  memoryAccessToken = tokens.access;
  Cookies.set("memoryRefreshToken", tokens.refresh, {
    expires: 7,
    secure: true,
    sameSite: "strict",
  });
}

export function clearTokens(): void {
  memoryAccessToken = null;
  Cookies.remove("memoryRefreshToken");
}

// ─── Auth operations ─────────────────────────────────────────────

/**
 * Log in with email + password.
 * Backend will give you token which has both access token and refresh token
 */
export async function login(email: string, password: string): Promise<AuthTokens> {
  const data = await apiFetch<AuthData>("/auth/token/", {
    method: "POST",
    body: { email, password },
  });
  return data.token;
}

export async function signup(
  email: string,
  password: string,
  confirmPassword: string
): Promise<AuthTokens> {
  const data = await apiFetch<AuthData>("/auth/signup/", {
    method: "POST",
    body: { email, password, confirm_password: confirmPassword },
  });
  return data.token;
}

/**
 * Attempts to get a fresh access token using the stored refresh token.
 * Used after a page reload wipes the in-memory access token.
 */
export async function refreshAccessToken(): Promise<string | null> {
  const memoryRefreshToken  = Cookies.get("memoryRefreshToken");
  if (!memoryRefreshToken || isTokenExpired(memoryRefreshToken)) {
    clearTokens();
    return null;
  }
  try {
    const data = await apiFetch<AuthData>("/auth/token/refresh/", {
      method: "POST",
      body: { refresh: memoryRefreshToken },
    });
    memoryAccessToken = data.token.access;
    if (data.token.refresh) {
      Cookies.set("memoryRefreshToken", data.token.refresh);
    }
    return memoryAccessToken;
  } catch {
    clearTokens();
    return null;
  }
}

/**
 * Check if the stored token is expired or not
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/**
 * Returns a valid access token, trying memory first then refresh token.
 * Used by route loaders to check auth status.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const token = getAccessToken();
  if (token && !isTokenExpired(token)) return token;
  return await refreshAccessToken();
}