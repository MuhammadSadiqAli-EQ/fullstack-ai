// components/error-boundary.tsx
import { useRouteError, Navigate, isRouteErrorResponse } from "react-router";
import { ApiError } from "~/lib/api";

export function GeneralErrorBoundary() {
  const error = useRouteError();

  if (error instanceof ApiError) {
    if (error.status === 401) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div>
        <h2>Error {error.status}</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h2>Error {error.status}</h2>
        <p>{error.statusText}</p>
      </div>
    );
  }

  return <div>Something went wrong. Please try again.</div>;
}