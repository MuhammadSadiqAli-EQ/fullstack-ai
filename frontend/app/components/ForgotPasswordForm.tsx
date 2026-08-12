/**
 * ForgotPasswordForm — presentational component for the Forgot page.
 *
 * All mutation logic lives in the route's clientAction.
 * This component just renders the form UI and displays errors.
 */

import { Form, Link } from "react-router";
import { CenteredPageLayout } from "~/components/layout/CenteredPageLayout";
import { TextField } from "~/components/ui/TextField";
import { Button } from "./ui/Button";

interface ForgotPasswordFormProps {
  error?: string;
  message?: string;
  isSubmitting: boolean;
}

export function ForgotPasswordForm({ error, message, isSubmitting }: ForgotPasswordFormProps) {
  return (
    <CenteredPageLayout>
      <h1 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Forgot Password
      </h1>

      <Form method="post" className="space-y-4">
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        {message && (
          <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting" : "Submit"}
        </Button>
      </Form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-gray-900 hover:underline dark:text-gray-100"
        >
          Sign up
        </Link>
      </p>
    </CenteredPageLayout>
  );
}