# @workingdev/codex

Codex is a configurable tool for creating context for LLMs. It can be used to create a context for a specific project or a specific use case. It's heavily inspired by [Cursor](https://github.com/onlook-dev/onlook).

## Config Idea

```ts
import { FileSystemSource } from '@workingdev/codex/sources';
import { TreeSitterParser } from '@workingdev/codex/parsers';

const CodexConfig = {
    /* Adapters define where Codex will store its data. Multiple adapters can be used
     * simultaneously for redundancy or different use cases.
     */
    adapters: [],

    /* Parsers define how Codex will parse the code. Multiple parsers can be used
     * simultaneously for different languages.
     */
    parsers: [
        new TreeSitterParser()
    ],

    /* Sources define where Codex will look for code to analyze. Multiple sources can be
     * configured to analyze code from different locations.
     */
    sources: [
        new FileSystemSource({ include: ['./src'], ignore: ['./node_modules'] })
    ],

    /* Files define which files to analyze. This can be used to ignore certain files or
     * directories.
     */
    files: {
        ignore: [/* files to be ignored */],
    },
    
    /* Embeddings define the provider and model to use for embeddings. */
    embeddings: {
        provider: 'openai',
        model: 'text-embedding-3-small',
        apiKey: 'sk-...'
    },
};

export default CodexConfig;
```

## CLI Idea

```sh
# Interactive setup for first time users
$ npx codex@latest setup

# Start a background server to watch and reindex files
$ npx codex@latest dev

# Build context for production or whatever usecase
$ npx codex@latest build
```
