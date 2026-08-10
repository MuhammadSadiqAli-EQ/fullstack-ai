import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/protected-layout.tsx", [
    route("receipts", "routes/receipts.tsx"),
  ]),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("health", "routes/health.tsx"),
] satisfies RouteConfig;
