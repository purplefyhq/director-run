import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { useEffect, useState } from "react";
import { GATEWAY_URL } from "../config";

export function useInspectMcp(proxyId: string, serverId?: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    const client = new Client({
      name: "director",
      version: "0.0.1",
    });

    const transport = new SSEClientTransport(
      new URL(`${GATEWAY_URL}/${proxyId}/sse`),
    );

    client.connect(transport).then(() => {
      Promise.all([
        client.listTools().then(({ tools }) => {
          setTools(
            tools.filter((tool) => {
              if (serverId) {
                return tool.description?.startsWith(`[${serverId}]`);
              }
              return true;
            }),
          );
        }),
      ]).then(() => {
        setIsLoading(false);
        client.close();
      });
    });

    return () => {
      client.close();
    };
  }, [proxyId, serverId]);

  return {
    isLoading,
    tools,
  };
}
