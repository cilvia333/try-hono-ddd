import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";
import * as path from "path";

export default defineWorkersConfig({
  test: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.toml" },
      },
    },
  },
});
