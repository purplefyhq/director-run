import { join } from "path";
import { Language, Parser } from "web-tree-sitter";

const LANGUAGE_WASM_PATHS: Record<string, string> = {
  javascript: "../../node_modules/tree-sitter-wasms/out/tree-sitter-javascript.wasm",
  json: "../../node_modules/tree-sitter-wasms/out/tree-sitter-json.wasm",
  typescript: "../../node_modules/tree-sitter-wasms/out/tree-sitter-typescript.wasm",
  "typescript-tsx": "../../node_modules/tree-sitter-wasms/out/tree-sitter-tsx.wasm",
};

export async function getLanguageParser(language: string) {
  let lang = LANGUAGE_WASM_PATHS[language];

  if (!lang) {
    return null;
  }

  await Parser.init();
  const parser = new Parser();
  const parserLanguage = await Language.load(join(process.cwd(), lang));
  parser.setLanguage(parserLanguage);

  return parser;
}
