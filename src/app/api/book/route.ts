import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { Bindings } from "@/types/hono";
import { DrizzleBookRepository } from "@/infrastructure/drizzle/Book/DrizzleBookRepository";
import { getDrizzleClient } from "@/infrastructure/drizzle/client";
import {
  RegisterBookApplicationService,
  RegisterBookCommand,
} from "@/action/Book/RegisterBookApplicationService/RegisterBookApplicationService";

const bookApp = new Hono<{ Bindings: Bindings }>();

bookApp.get("/", (c, next) => {
  return c.text("hello book api!");
});
bookApp.post(
  "/",
  zValidator(
    "json",
    z.object({
      isbn: z.string(),
      title: z.string(),
      priceAmount: z.number().int(),
    })
  ),
  async (c) => {
    try {
      const drizzleClient = getDrizzleClient(c.env.DB);
      const requestBody = c.req.valid("json");

      // リクエストボディをコマンドに変換。今回はたまたま一致しているため、そのまま渡している。
      const registerBookCommand: RegisterBookCommand = requestBody;
      await RegisterBookApplicationService.execute(
        DrizzleBookRepository,
        drizzleClient
      )(registerBookCommand);

      // 実際は詳細なレスポンスを返す
      return c.json({ message: "success" });
    } catch (error) {
      // 実際はエラーを解析し、詳細なレスポンスを返す。また、ロギングなどを行う。
      return c.json(
        {
          message: (error as Error).message,
        },
        400
      );
    }
  }
);

export default bookApp;
