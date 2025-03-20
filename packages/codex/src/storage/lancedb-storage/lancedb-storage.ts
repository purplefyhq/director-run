import { Field, Float32, List, Schema, Utf8 } from "apache-arrow";

const schema = new Schema([new Field("embeddingId", new Utf8()), new Field("vector", new List(new Field("float32", new Float32())))]);
