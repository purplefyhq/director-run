import * as lancedb from "@lancedb/lancedb";
import { lanceDbSchema } from "./lancedb-schema";

export async function createLanceDbTable() {
  const db = await lancedb.connect("test.db");

  const table = await db.createEmptyTable("codex", lanceDbSchema, {
    mode: "overwrite",
  });

  await table.createIndex("contents", {
    config: lancedb.Index.fts(),
  });

  return table;
}
