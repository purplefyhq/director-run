import { Embedding, EmbeddingResult } from "./embedding";
import { Parser } from "./parser";
import { Source } from "./source";

export interface CodexOptions {
  include?: string[];
  ignore?: string[];
  sources: Source[];
  parsers: Parser[];
  embeddings: Embedding[];
  storage: [];
}

export interface CodexInstance {
  (options: CodexOptions): Codex;
}

export interface Codex {
  sync(): Promise<EmbeddingResult[]>;
}
