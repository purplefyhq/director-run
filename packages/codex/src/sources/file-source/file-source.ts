import { join } from "path";
import { Source, SourceFile, SourceOptions } from "@/types/source";
import chok, { FSWatcher } from "chokidar";
import { glob } from "fast-glob";
import { readFile, stat } from "fs/promises";
import { minimatch } from "minimatch";
import { getFileExtension, getLanguageFromPath } from "../utils/get-language";

/**
 * Creates a file source object that provides methods to find and read files.
 *
 * @param options - Configuration options for the file source.
 * @returns A Source object with methods to find files.
 */
export const fileSource = (options?: SourceOptions): Source => {
  const id = options?.id ?? "file";
  const include = options?.include ?? [];
  const ignore = options?.ignore ?? [];

  /**
   * Finds a single file by its identifier and returns its details.
   *
   * @param identifier - The path or identifier of the file to find.
   * @returns A promise that resolves to a SourceFile object or null if the file is empty or not found.
   */
  async function findOne(identifier: string, globalOptions?: SourceOptions): Promise<SourceFile | null> {
    const globalInclude = globalOptions?.include ?? [];
    const globalIgnore = globalOptions?.ignore ?? [];

    const shouldInclude = globalInclude.concat(include).some((pattern) => minimatch(identifier, pattern));

    const shouldIgnore = globalIgnore.concat(ignore).some((pattern) => minimatch(identifier, pattern));

    if (!shouldInclude || shouldIgnore) {
      return null;
    }

    const resolvedPath = join(process.cwd(), identifier);
    const fileContents = await readFile(resolvedPath, { encoding: "utf-8" });

    if (!fileContents || fileContents.trim().length === 0) {
      return null;
    }

    const extension = getFileExtension(resolvedPath);
    const fStat = await stat(identifier);
    const lines = fileContents.split("\n");
    const numLines = lines.length;
    const lastLineLength = lines[lines.length - 1].length;

    return {
      source: id,
      pathname: resolvedPath,
      contents: fileContents,
      language: getLanguageFromPath(resolvedPath) as string,
      extension,
      lastModified: fStat.mtime.getTime(),
      range: {
        start: {
          line: 0,
          character: 0,
        },
        end: {
          line: numLines,
          character: lastLineLength,
        },
      },
    };
  }

  /**
   * Finds multiple files based on the include and ignore patterns in options.
   *
   * @returns A promise that resolves to an array of SourceFile objects.
   */
  async function findMany(globalOptions?: SourceOptions): Promise<SourceFile[]> {
    const globalInclude = globalOptions?.include ?? [];
    const globalIgnore = globalOptions?.ignore ?? [];

    const pathnames = await glob([...globalInclude, ...include], {
      cwd: process.cwd(),
      ignore: [...globalIgnore, ...ignore],
    });

    const files = await Promise.all(pathnames.map(async (pathname) => findOne(pathname, globalOptions)));

    return files.filter((file) => file !== null);
  }

  async function watch(
    callbacks: {
      onAdd: (path: string) => void;
      onChange: (path: string) => void;
      onUnlink: (path: string) => void;
    },
    globalOptions?: SourceOptions,
  ): Promise<FSWatcher> {
    const globalInclude = globalOptions?.include ?? [];
    const globalIgnore = globalOptions?.ignore ?? [];

    const ignoredFiles = await glob([...globalIgnore, ...ignore], {
      cwd: process.cwd(),
    });

    const files = await glob([...globalInclude, ...include], {
      cwd: process.cwd(),
      ignore: [...globalIgnore, ...ignore],
    });

    const watcher = chok
      .watch(files, {
        ignored: ignoredFiles,
      })
      .on("add", (path) => callbacks.onAdd(path))
      .on("change", (path) => callbacks.onChange(path))
      .on("unlink", (path) => callbacks.onUnlink(path));

    return watcher;
  }

  return {
    id: "file",
    findMany,
    findOne,
  };
};
