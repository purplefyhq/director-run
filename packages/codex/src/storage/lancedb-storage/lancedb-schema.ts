import { Field, FixedSizeList, Float32, Int64, Schema, Utf8 } from "apache-arrow";

export const lanceDbSchema = new Schema([
  // Field for the source of the data, stored as a UTF-8 string
  new Field("source", new Utf8()),

  // Field for the pathname, stored as a UTF-8 string
  new Field("pathname", new Utf8()),

  // Field for the contents of the file, stored as a UTF-8 string
  new Field("contents", new Utf8()),

  // Field for the programming language of the file, stored as a UTF-8 string
  new Field("language", new Utf8()),

  // Field for the file extension, stored as a UTF-8 string
  new Field("extension", new Utf8()),

  // Field for the last modified timestamp, stored as a 64-bit integer
  new Field("lastModified", new Int64()),

  // Field for the starting line number, stored as a 64-bit integer
  new Field("startLine", new Int64()),

  // Field for the starting character position, stored as a 64-bit integer
  new Field("startCharacter", new Int64()),

  // Field for the ending line number, stored as a 64-bit integer
  new Field("endLine", new Int64()),

  // Field for the ending character position, stored as a 64-bit integer
  new Field("endCharacter", new Int64()),

  // Field for a unique identifier, stored as a UTF-8 string
  new Field("identifier", new Utf8()),

  // Field for the parser used, stored as a UTF-8 string
  new Field("parser", new Utf8()),

  // Field for the type of the data, stored as a UTF-8 string
  new Field("type", new Utf8()),

  // Field for the subtype of the data, stored as a UTF-8 string
  new Field("subType", new Utf8()),

  // Field for the embedding ID, stored as a UTF-8 string
  new Field("embeddingId", new Utf8()),

  // Field for a vector of 3072 float32 values, representing some kind of embedding
  new Field("vector", new FixedSizeList(3072, new Field("float32", new Float32()))),
]);
