export const LANGUAGE_EXTENSIONS = {
  json: "json",
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript-tsx",
  txt: "plaintext",
  md: "markdown",
} as const;

const SUPPORTED_LANGUAGE_EXTENSIONS = Object.keys(LANGUAGE_EXTENSIONS);

export type SupportedLanguageExtension = keyof typeof LANGUAGE_EXTENSIONS;
export type SupportedLanguage = (typeof LANGUAGE_EXTENSIONS)[SupportedLanguageExtension];

export function getFileExtension(path: string) {
  const ext = path.split(".").pop();

  if (!ext || !SUPPORTED_LANGUAGE_EXTENSIONS.includes(ext)) {
    return "txt";
  }

  return ext as SupportedLanguageExtension;
}

export function getLanguageFromPath(path: string) {
  const extension = getFileExtension(path);
  return LANGUAGE_EXTENSIONS[extension];
}
