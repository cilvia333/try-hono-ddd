import { Hono } from "hono";

import { Bindings } from "@/types/hono";

import userApp from "./users/route";
import bookApp from "./book/route";

const apiApp = new Hono<{ Bindings: Bindings }>();
apiApp.get("/", (c) => {
  return c.text("Hello API!");
});
apiApp.route("/users", userApp);
apiApp.route("/book", bookApp);

export default apiApp;
