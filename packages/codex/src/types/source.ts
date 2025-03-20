import { Range } from "@/types/common";

export interface SourceOptions {
  id?: string;
  /**
   * A list of file paths or glob patterns that specify which files should be included.
   * For example: ['src/*.ts', 'lib/utils.js']
   */
  include?: string[];

  /**
   * A list of file paths or glob patterns that specify which files should not be ignored.
   * For example: ['node_modules/**', 'dist/**']
   */
  ignore?: string[];
}

export interface Source {
  id: string;
  findMany: (globalOptions?: SourceOptions) => Promise<SourceFile[]>;
  findOne: (identifier: string, globalOptions?: SourceOptions) => Promise<SourceFile | null>;
}

export interface SourceInstance {
  (options?: SourceOptions): Source;
}

export interface SourceFile {
  source: string;
  pathname: string;
  extension: string;
  language: string;
  contents: string;
  lastModified: number;
  range: Range;
}
