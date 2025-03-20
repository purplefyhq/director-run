import { createOpenAI } from "@ai-sdk/openai";
import { embed } from "ai";
import { codex } from "./codex";
import { aiSdkEmbedding } from "./embeddings/ai-sdk-embedding";
import { treeSitterParser } from "./parsers";
import { fileSource } from "./sources";
import { createLanceDbTable } from "./storage/lancedb-storage/create-lancedb-table";

const model = createOpenAI({
  apiKey: "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",
});

async function run() {
  const instance = codex({
    include: ["**/*"],
    ignore: ["node_modules/**", "dist/**", "test.db/**/*"],
    sources: [fileSource()],
    parsers: [treeSitterParser()],
    embeddings: [
      aiSdkEmbedding({
        id: "openai",
        model: model.embedding("text-embedding-3-large"),
      }),
    ],
    storage: [],
  });

  const results = await instance.sync();

  console.log(`Indexed ${results.length} files`);

  const table = await createLanceDbTable();

  await table.add(
    results.map((it) => {
      const { range: _range, ...rest } = it;

      return {
        ...rest,
        startLine: it.range.start.line,
        startCharacter: it.range.start.character,
        endLine: it.range.end.line,
        endCharacter: it.range.end.character,
      };
    }),
  );

  const { embedding } = await embed({
    model: model.embedding("text-embedding-3-large"),
    value: "Where is the lancedb schema defined?",
  });

  const res = await table.query().nearestTo(embedding).fullTextSearch("new Schema(").select(["pathname", "type", "subType"]).toArray();

  return res;
}

run();
