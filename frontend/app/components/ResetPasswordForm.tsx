/**
 * ResetPasswordForm — presentational component for the Reset page.
 *
 * All mutation logic lives in the route's clientAction.
 * This component just renders the form UI and displays errors.
 */

import { Form, Link } from "react-router";
import { CenteredPageLayout } from "~/components/layout/CenteredPageLayout";
import { TextField } from "~/components/ui/TextField";
import { Button } from "./ui/Button";

interface ResetPasswordFormProps {
  error?: string;
  message?: string;
  isSubmitting: boolean;
}

export function ResetPasswordForm({ error, message, isSubmitting }: ResetPasswordFormProps) {
  return (
    <CenteredPageLayout>
      <h1 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Reset Password
      </h1>

      <Form method="post" className="space-y-4">
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
        />
        <TextField
          label="Confirm Password"
          name="confirm_password"
          type="password"
          required
          autoComplete="new-password"
        />
        {message && (
          <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Resetting" : "Reset"}
        </Button>
      </Form>
    </CenteredPageLayout>
  );
}