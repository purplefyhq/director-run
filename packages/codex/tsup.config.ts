import { Options, defineConfig } from "tsup";

export const options: Options[] = [
  {
    entry: ["src/index.ts", "src/parsers/index.ts", "src/sources/index.ts"],
    format: ["cjs", "esm"],
    minify: true,
    dts: true,
    sourcemap: true,
  },
];

export default defineConfig(options);
