import { redirect, useLoaderData, useActionData, useNavigation } from "react-router";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import type { Route } from "./+types/reset-password";
import { ResetPasswordForm } from "~/components/ResetPasswordForm";
import { resetPassword } from "~/lib/Password";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reset Password" },
    { name: "description", content: "" },
  ];
}

export async function clientLoader({request}: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  return { token };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const formData = await request.formData();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;
  if (!token) {
    return { error: "Missing reset token" };
  }
  try {
    const result = await resetPassword(token, password, confirmPassword);
    return redirect("/");
  } catch (err) {
    return {
    error: err instanceof Error ? err.message : "Something went wrong",
    };
    }
}

export default function ResetPasswordRoute() {
  const { token } = useLoaderData<typeof clientLoader>();
  const actionData = useActionData<typeof clientAction>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <ResetPasswordForm
      error={actionData && "error" in actionData ? actionData.error : undefined}
      message={actionData && "message" in actionData ? actionData.message : undefined}
      isSubmitting={isSubmitting}
    />
  );
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
