import { Parser, ParserOptions, ParserResult } from "@/types/parser";
import { SourceFile } from "@/types/source";
import { minimatch } from "minimatch";
import { getLanguageParser } from "./get-language-parser";
import { getSymbols } from "./get-symbols";

export const treeSitterParser = (options?: ParserOptions): Parser => {
  const id = options?.id ?? "tree-sitter";
  const include = options?.include ?? [];
  const ignore = options?.ignore ?? [];

  async function parseOne(file: SourceFile, globalOptions?: ParserOptions) {
    const globalInclude = globalOptions?.include ?? [];
    const globalIgnore = globalOptions?.ignore ?? [];

    const shouldInclude = globalInclude.concat(include).some((pattern) => minimatch(file.pathname, pattern));

    const shouldIgnore = globalIgnore.concat(ignore).some((pattern) => minimatch(file.pathname, pattern));

    if (!shouldInclude || shouldIgnore) {
      return [];
    }

    const results: ParserResult[] = [
      {
        ...file,
        identifier: file.pathname,
        parser: id,
        type: "file",
        subType: "file",
      },
    ];

    const parser = await getLanguageParser(file.language);

    if (!parser) {
      return results;
    }

    const tree = parser.parse(file.contents);

    if (!tree) {
      throw new Error("Failed to parse");
    }

    const symbols = getSymbols(tree.rootNode, file.pathname, id);

    for (const symbol of symbols) {
      results.push({
        source: file.source,
        identifier: symbol.parentContext ? `${symbol.parentContext}.${symbol.name}` : symbol.name,
        parser: id,
        type: "symbol",
        subType: symbol.type,
        pathname: file.pathname,
        extension: file.extension,
        language: file.language,
        lastModified: file.lastModified,
        contents: symbol.contents,
        range: symbol.range,
      });
    }

    return results;
  }

  async function parseMany(files: SourceFile[], globalOptions?: ParserOptions) {
    const results: ParserResult[] = [];

    for (const file of files) {
      const parsedFiles = await parseOne(file, globalOptions);
      results.push(...parsedFiles);
    }

    return results;
  }

  return { id, parseOne, parseMany };
};
