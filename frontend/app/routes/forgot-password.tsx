import { redirect, useActionData, useNavigation } from "react-router";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import type { Route } from "./+types/forgot-password";
import { ForgotPasswordForm } from "~/components/ForgotPasswordForm";
import { forgotPassword } from "~/lib/Password";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Forgot Password" },
    { name: "description", content: "" },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  try {
    const result = await forgotPassword(email);
    return redirect("/");
  } catch (err) {
    return {
    error: err instanceof Error ? err.message : "Something went wrong",
    };
    }
}

export default function ForgotPasswordRoute() {
  const actionData = useActionData<typeof clientAction>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <ForgotPasswordForm
      message={actionData && "message" in actionData ? actionData.message : undefined}
      error={actionData && "error" in actionData ? actionData.error : undefined}
      isSubmitting={isSubmitting}
    />
  );
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
