import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "@/infrastructure/drizzle/schema";

export type WithDBConnectFunction<
  T,
  Params = undefined,
  Response = undefined
> = (db: T, params: Params) => Promise<Response>;

export type WithResultResponse<T> =
  | {
      result: "success";
      data: T;
    }
  | { result: "failure" };

export type DrizzleD1DatabaseWithSchema = DrizzleD1Database<typeof schema>;

export type InMemoryDB<T> = {
  [id: string]: T;
};
