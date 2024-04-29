import { Hono } from "hono";

import apiApp from "@/app/api";
import { Bindings } from "@/types/hono";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api", apiApp);

export default app;
