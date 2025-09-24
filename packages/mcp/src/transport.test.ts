import type { Server } from "http";
import path from "path";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { HTTPClient } from "./client/http-client";
import { StdioClient } from "./client/stdio-client";

import { SimpleServer } from "./simple-server";
import { makeEchoServer, makeEchoServerStdioClient } from "./test/fixtures";
import { serveOverSSE, serveOverStreamable } from "./transport";

describe("transport", () => {
  describe("serveOverStreamable", () => {
    let httpServer: Server;
    let mcpServer: SimpleServer;

    beforeAll(async () => {
      mcpServer = makeEchoServer();
      httpServer = await serveOverStreamable(mcpServer, 2345);
    });

    afterAll(async () => {
      await httpServer.close();
      await mcpServer.close();
    });

    test("should create a server with a tool", async () => {
      const client = await HTTPClient.createAndConnectToHTTP(
        "http://localhost:2345/mcp",
      );

      const tools = await client.listTools();
      expect(tools.tools).toHaveLength(1);
      expect(tools.tools[0].name).toBe("echo");
    });
  });

  describe("serveOverStdio", () => {
    test("should expose a server over stdio", async () => {
      const client = makeEchoServerStdioClient();
      await client.connectToTarget({ throwOnError: true });
      const tools = await client.listTools();
      expect(tools.tools).toHaveLength(1);
      expect(tools.tools[0].name).toBe("echo");
      await client.close();
    });
  });

  describe("serveOverSSE", () => {
    test("should expose a server over stdio", async () => {
      const server = makeEchoServer();
      const _app = serveOverSSE(server, 3000);
      const client = await HTTPClient.createAndConnectToHTTP(
        `http://localhost:3000/sse`,
      );
      const tools = await client.listTools();
      expect(tools.tools).toHaveLength(1);
      expect(tools.tools[0].name).toBe("echo");
      await client.close();
    });
  });

  describe("proxyHTTPToStdio", () => {
    describe("SSE", () => {
      let client: Client;
      let proxyTargetServerInstance: Server;

      beforeAll(async () => {
        proxyTargetServerInstance = await serveOverSSE(makeEchoServer(), 4522);
        const basePath = __dirname;
        client = await StdioClient.createAndConnectToStdio("bun", [
          "-e",
          `
            import { proxyHTTPToStdio } from '${path.join(basePath, "transport.ts")}'; 
            proxyHTTPToStdio("http://localhost:4522/sse");
        `,
        ]);
      }, 30000);

      afterAll(async () => {
        await client?.close();
        await proxyTargetServerInstance?.close();
      });

      test("should proxy an SSE server to stdio", async () => {
        const toolsResult = await client.listTools();

        const expectedToolNames = ["echo"];

        for (const toolName of expectedToolNames) {
          const tool = toolsResult.tools.find((t) => t.name === toolName);
          expect(tool).toBeDefined();
          expect(tool?.name).toBe(toolName);
        }
      });
    });
    describe("Streamable", () => {
      let client: Client;
      let proxyTargetServerInstance: Server;

      beforeAll(async () => {
        proxyTargetServerInstance = await serveOverStreamable(
          makeEchoServer(),
          4522,
        );
        const basePath = __dirname;
        client = await StdioClient.createAndConnectToStdio("bun", [
          "-e",
          `
            import { proxyHTTPToStdio } from '${path.join(basePath, "transport.ts")}'; 
            proxyHTTPToStdio("http://localhost:4522/mcp");
        `,
        ]);
      }, 30000);

      afterAll(async () => {
        await client?.close();
        await proxyTargetServerInstance?.close();
      });

      test("should proxy an Streamable server to stdio", async () => {
        const toolsResult = await client.listTools();

        const expectedToolNames = ["echo"];

        for (const toolName of expectedToolNames) {
          const tool = toolsResult.tools.find((t) => t.name === toolName);
          expect(tool).toBeDefined();
          expect(tool?.name).toBe(toolName);
        }
      });
    });
  });
});
