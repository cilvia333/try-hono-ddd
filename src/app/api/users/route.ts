import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";

import { Bindings } from "@/types/hono";
import { UserRepository } from "@/infrastructure/drizzle/user/userRepository";

const userApp = new Hono<{ Bindings: Bindings }>();

userApp.post("/", async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json<{
    displayId: string;
    name: string;
    email: string;
  }>();

  const res = await UserRepository.create(body, db);

  return c.json({});
});

export default userApp;
