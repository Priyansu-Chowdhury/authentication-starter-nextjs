import { Hono } from "hono";
import { handle } from "hono/vercel";

import userRoutes from "@/features/api/user";

export const runtime = "edge";

const app = new Hono().basePath("/api/data").route("/users", userRoutes);

export default handle(app);

export type AppType = typeof app;
