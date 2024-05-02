import type { Config } from "drizzle-kit";

const { LOCAL_DB_PATH } = process.env;

export default LOCAL_DB_PATH
  ? ({
      schema: "./src/infrastructure/drizzle/schema.ts",
      out: "./migrations",
      driver: "better-sqlite",
      dbCredentials: {
        url: LOCAL_DB_PATH,
      },
    } satisfies Config)
  : ({
      schema: "./src/infrastructure/drizzle/schema.ts",
      out: "./migrations",
      driver: "d1",
      dbCredentials: {
        wranglerConfigPath: "wrangler.toml",
        dbName: "hono-ddd",
      },
    } satisfies Config);
