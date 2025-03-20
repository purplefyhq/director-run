import { Range } from "@/types/common";
import { SourceFile } from "@/types/source";

export interface ParserOptions {
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

export interface Parser {
  id: string;
  parseOne: (file: SourceFile, options?: ParserOptions) => Promise<ParserResult[]>;
  parseMany: (files: SourceFile[], options?: ParserOptions) => Promise<ParserResult[]>;
}

export interface ParserInstance {
  (options?: ParserOptions): Parser;
}

export interface Symbol {
  parserName: string;
  pathname: string;
  name: string;
  type: string;
  contents: string;
  range: Range;
  accessModifier: string | null;
  isStatic: boolean;
  annotations: string[];
  parentContext: string | null;
  relationships: string[];
}

export type ParserResultType = "file" | "symbol";

export interface ParserResult {
  identifier: string;
  parser: string;
  source: string;
  type: ParserResultType;
  subType: string;
  pathname: string;
  extension: string;
  language: string;
  lastModified: number;
  contents: string;
  range: Range;
}
