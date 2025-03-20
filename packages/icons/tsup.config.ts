import { Options, defineConfig } from "tsup";

export const options: Options[] = [
  {
    entry: ["src/**/*.{ts,tsx}"],
    format: ["cjs", "esm"],
    minify: true,
    dts: true,
    treeshake: "recommended",
    sourcemap: true,
    clean: false,
    external: ["react", "react-dom"],
  },
];

export default defineConfig(options);
