import { apiFetch } from "./api";
import type { EmailMessage, ResetMessage } from "./types";

/**
 * Forgot Password, fronted will give email to backend.
 * Backend will send a reset url to your email and a message for frontend
 */
export async function forgotPassword(email: string): Promise<EmailMessage> {
    return apiFetch(`/auth/forgot-password/`, {
    method: "POST",
    body: { email }
  });
}

export async function resetPassword(
  token: string,
  password: string,
  confirmPassword: string, 
): Promise<ResetMessage> {
  return apiFetch(`/auth/reset-password/`,{
    method: "POST",
    body: {token, password, confirm_password: confirmPassword},
  });
}