import { hc } from "hono/client";
import { AppType } from "@/pages/api/data/[[...route]]";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_API_URL!);
