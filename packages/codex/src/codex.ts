import { Codex, CodexOptions } from "./types/codex";
import { EmbeddingResult } from "./types/embedding";
import { ParserResult } from "./types/parser";
import { SourceFile } from "./types/source";

export const codex = (options: CodexOptions): Codex => {
  const include = options.include ?? [];
  const ignore = options.ignore ?? [];

  async function getSourceFiles() {
    if (options.sources.length === 0) {
      throw new Error("No sources provided");
    }

    const files: SourceFile[] = [];

    for (const source of options.sources) {
      const sourceFiles = await source.findMany({ include, ignore });
      files.push(...sourceFiles);
    }

    return files;
  }

  async function parseSourceFiles(files: SourceFile[]) {
    if (options.parsers.length === 0) {
      throw new Error("No parsers provided");
    }

    if (files.length === 0) {
      return [];
    }

    const results: ParserResult[] = [];

    for (const parser of options.parsers) {
      const parserResults = await parser.parseMany(files, { include, ignore });
      results.push(...parserResults);
    }

    return results;
  }

  async function addEmbeddings(results: ParserResult[]) {
    if (options.embeddings.length === 0) {
      throw new Error("No embeddings provided");
    }

    if (results.length === 0) {
      return [];
    }

    const embeddingResults: EmbeddingResult[] = [];

    for (const embedding of options.embeddings) {
      const embeddings = await embedding.embedMany(results);
      embeddingResults.push(...embeddings);
    }

    return embeddingResults;
  }

  async function addToStorage(results: ParserResult[]) {
    if (options.storage.length === 0) {
      throw new Error("No storage provided");
    }

    if (results.length === 0) {
      return [];
    }

    return [];
  }

  return {
    sync: async () => {
      const sourceFiles = await getSourceFiles();
      const parsedResults = await parseSourceFiles(sourceFiles);
      const embeddings = await addEmbeddings(parsedResults);
      // const storageResults = await addToStorage(embeddings);

      return embeddings;
    },
  };
};
