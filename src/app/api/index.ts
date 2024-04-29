import { Hono } from "hono";

import { Bindings } from "@/types/hono";

import userApp from "./users/route";

const apiApp = new Hono<{ Bindings: Bindings }>();
apiApp.route("/users", userApp);

export default apiApp;
