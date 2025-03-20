import { ParserResult } from "./parser";

export interface EmbeddingOptions {
  id?: string;
  /**
   * A list of file paths or glob patterns that specify which files should be parsed.
   * For example: ['src/*.ts', 'lib/utils.js']
   */
  include?: string[];

  /**
   * A list of file paths or glob patterns that specify which files should not be parsed.
   * For example: ['node_modules/**', 'dist/**']
   */
  ignore?: string[];
}

export interface Embedding {
  id: string;
  embedOne: (file: ParserResult) => Promise<EmbeddingResult>;
  embedMany: (files: ParserResult[]) => Promise<EmbeddingResult[]>;
}

export interface EmbeddingInstance {
  (options?: EmbeddingOptions): Embedding;
}

export interface EmbeddingResult extends ParserResult {
  embeddingId: string;
  vector: number[];
}
