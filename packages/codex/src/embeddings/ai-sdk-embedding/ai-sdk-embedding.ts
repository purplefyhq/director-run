import { Embedding, EmbeddingOptions } from "@/types/embedding";
import { ParserResult } from "@/types/parser";
import { type EmbeddingModel, embedMany as aiEmbedMany, embed } from "ai";

interface AiSdkEmbeddingOptions extends EmbeddingOptions {
  model: EmbeddingModel<string>;
}

export const aiSdkEmbedding = (options: AiSdkEmbeddingOptions): Embedding => {
  const id = options?.id ?? "ai-sdk";

  async function embedOne(file: ParserResult) {
    const { embedding } = await embed({
      model: options.model,
      value: file.contents,
    });

    return {
      ...file,
      embeddingId: id,
      vector: embedding,
    };
  }

  async function embedMany(files: ParserResult[]) {
    const { embeddings } = await aiEmbedMany({
      model: options.model,
      values: files.map((file) => file.contents),
    });

    return embeddings.map((vector, index) => ({
      ...files[index],
      embeddingId: id,
      vector,
    }));
  }

  return {
    id,
    embedOne,
    embedMany,
  };
};
