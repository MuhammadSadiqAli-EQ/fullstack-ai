// routes/protected-layout.tsx
import { Navigate, Outlet } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getAccessToken } from "~/lib/auth";

export async function clientLoader({ request }: LoaderFunctionArgs) {
  const token = getAccessToken();

  if (!token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return { token };
}

export function ErrorBoundary() {
  return <Navigate to="/login" replace />;
}

export default function ProtectedLayout() {
  return <Outlet />;
}