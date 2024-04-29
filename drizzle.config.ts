import type { Config } from "drizzle-kit";

export default {
  schema: "./src/infrastructure/drizzle/schema.ts",
  out: "./migrations",
  driver: "d1",
  dbCredentials: {
    wranglerConfigPath: "wrangler.toml",
    dbName: "hono-ddd",
  },
} satisfies Config;
