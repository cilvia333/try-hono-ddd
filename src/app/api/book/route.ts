import { Hono } from "hono";

import { Bindings } from "@/types/hono";
import { DrizzleBookRepository } from "@/infrastructure/drizzle/Book/DrizzleBookRepository";
import { getDrizzleClient } from "@/infrastructure/drizzle/client";
import {
  RegisterBookApplicationService,
  RegisterBookCommand,
} from "@/action/Book/RegisterBookApplicationService/RegisterBookApplicationService";
import { HTTPException } from "hono/http-exception";

const bookApp = new Hono<{ Bindings: Bindings }>();

bookApp.get("/", (c) => {
  return c.text("hello book api!");
});
bookApp.post("/", async (c, next) => {
  try {
    const drizzleClient = getDrizzleClient(c.env.DB);

    const requestBody = await c.req.json<{
      isbn: string;
      title: string;
      priceAmount: number;
    }>();

    // リクエストボディをコマンドに変換。今回はたまたま一致しているため、そのまま渡している。
    const registerBookCommand: RegisterBookCommand = requestBody;
    await RegisterBookApplicationService.execute(
      DrizzleBookRepository,
      drizzleClient
    )(registerBookCommand);

    // 実際は詳細なレスポンスを返す
    c.json({ message: "success" }, 200);
  } catch (error) {
    // 実際はエラーを解析し、詳細なレスポンスを返す。また、ロギングなどを行う。
    throw new HTTPException(500, {
      message: (error as Error).message,
    });
  }
  await next();
});

export default bookApp;
