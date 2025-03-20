import { existsSync } from "fs";
import { resolve } from "path";

export async function getConfig() {
  const configPath = resolve(process.cwd(), "codex.config.ts");

  if (!existsSync(configPath)) {
    throw new Error("Could not find codex.config.ts in the current directory");
  }

  // Dynamic import for TypeScript config file
  const config = await import(configPath);
  return config.default;
}
