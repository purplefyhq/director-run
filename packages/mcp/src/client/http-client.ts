import {
  AppError,
  ErrorCode,
  isAppErrorWithCode,
} from "@director.run/utilities/error";
import { getLogger } from "@director.run/utilities/logger";
import { requiredStringSchema } from "@director.run/utilities/schema";
import { UnauthorizedError } from "@modelcontextprotocol/sdk/client/auth.js";
import {
  SSEClientTransport,
  SseError,
} from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { OAuthHandler } from "../oauth/oauth-provider-factory";
import { AbsractClientSchema, AbstractClient } from "./abstract-client";
import type { ClientStatus } from "./abstract-client";

const logger = getLogger("client/http");

export const HTTPClientSchema = AbsractClientSchema.extend({
  url: requiredStringSchema,
  headers: z.record(requiredStringSchema, z.string()).optional(),
});

export type HTTPClientParams = z.infer<typeof HTTPClientSchema>;
export type HTTPClientPlainObject = HTTPClientParams & {
  type: "http";
  tools?: Tool[];
  connectionInfo?: {
    status: ClientStatus;
    lastConnectedAt?: Date;
    lastErrorMessage?: string;
  };
};

export type HTTPClientOptions = {
  oAuthHandler?: OAuthHandler;
};

export class HTTPClient extends AbstractClient<HTTPClientParams> {
  private _url: string;
  private headers?: Record<string, string>;
  private oAuthHandler?: OAuthHandler;

  constructor(params: HTTPClientParams, options?: HTTPClientOptions) {
    super(params);
    this._url = params.url;
    this.oAuthHandler = options?.oAuthHandler;
    this.headers = params.headers;
  }

  get url(): string {
    return this._url;
  }

  private async connectToTransport({
    throwOnError,
    transport,
  }: {
    throwOnError: boolean;
    transport: StreamableHTTPClientTransport | SSEClientTransport;
  }): Promise<boolean> {
    if (this._disabled) {
      this.status = "disconnected";
      return false;
    }

    try {
      await this.connect(transport);
      logger.info(
        `[${this.name}] connected successfully to ${this._url} via Streamable`,
      );
      this.status = "connected";
      this.lastErrorMessage = undefined;
      this.lastConnectedAt = new Date();
      return true;
    } catch (error) {
      const { appError, lastErrorMessage, status } = transportErrorToAppError(
        error,
        this._url,
        this.name,
      );
      this.status = status;
      this.lastErrorMessage = lastErrorMessage;
      if (throwOnError) {
        throw appError;
      } else {
        return false;
      }
    }
  }

  async connectToSSE({
    throwOnError,
  }: {
    throwOnError: boolean;
  }): Promise<boolean> {
    return await this.connectToTransport({
      throwOnError,
      transport: new SSEClientTransport(new URL(this._url), {
        requestInit: { headers: this.headers },
        authProvider: this.oAuthHandler?.getProvider({ serverUrl: this._url }),
      }),
    });
  }

  async connectToStreamable({
    throwOnError,
  }: {
    throwOnError: boolean;
  }): Promise<boolean> {
    return await this.connectToTransport({
      throwOnError,
      transport: new StreamableHTTPClientTransport(new URL(this._url), {
        requestInit: { headers: this.headers },
        authProvider: this.oAuthHandler?.getProvider({ serverUrl: this._url }),
      }),
    });
  }

  async startAuthFlow(): Promise<
    | {
        result: "AUTHORIZED";
      }
    | {
        result: "REDIRECT";
        redirectUrl: string;
      }
  > {
    if (this._disabled) {
      throw new AppError(
        ErrorCode.BAD_REQUEST,
        "client is disabled, re-enable it to start auth flow",
      );
    }

    if (!this.oAuthHandler) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        "OAuth authentication required but no authorization handler provided",
      );
    }

    let redirectUrl: string | undefined;

    try {
      await this.connectToTransport({
        throwOnError: true,
        transport: new StreamableHTTPClientTransport(new URL(this._url), {
          requestInit: { headers: this.headers },
          authProvider: this.oAuthHandler.getProvider({
            serverUrl: this._url,
            onRedirect: (url: URL) => {
              redirectUrl = url.toString();
            },
          }),
        }),
      });

      return {
        result: "AUTHORIZED",
      };
    } catch (error) {
      if (isAppErrorWithCode(error, ErrorCode.UNAUTHORIZED)) {
        logger.info(
          `[${this.name}] OAuth authentication required for ${this._url}`,
        );

        if (redirectUrl) {
          return {
            result: "REDIRECT",
            redirectUrl,
          };
        } else {
          throw new AppError(
            ErrorCode.UNEXPECTED_ERROR,
            "OAuth authentication required but no redirect URL provided",
          );
        }
      } else {
        throw error;
      }
    }
  }

  async completeAuthFlow(authCode: string): Promise<void> {
    if (this._disabled) {
      throw new AppError(
        ErrorCode.BAD_REQUEST,
        "client is disabled, re-enable it to complete auth flow",
      );
    }

    if (!this.oAuthHandler) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        "OAuth authentication required but no authorization handler provided",
      );
    }

    // Create a temporary transport just for OAuth flow
    const oauthTransport = new StreamableHTTPClientTransport(
      new URL(this._url),
      {
        requestInit: { headers: this.headers },
        authProvider: this.oAuthHandler.getProvider({ serverUrl: this._url }),
      },
    );

    // Complete OAuth flow
    await oauthTransport.finishAuth(authCode);

    logger.info(`[${this.name}] oAuth token exchange completed`);
    await this.connectToTransport({
      throwOnError: true,
      transport: new StreamableHTTPClientTransport(new URL(this._url), {
        requestInit: { headers: this.headers },
        authProvider: this.oAuthHandler.getProvider({ serverUrl: this._url }),
      }),
    });
  }

  // TODO: returns true if connected, false if not
  public async connectToTarget(
    {
      throwOnError,
    }: {
      throwOnError: boolean;
    } = { throwOnError: true },
  ) {
    if (this._disabled) {
      this.status = "disconnected";
      return false;
    }

    try {
      return await this.connectToStreamable({ throwOnError: true });
    } catch (error) {
      if (isAppErrorWithCode(error, ErrorCode.UNAUTHORIZED)) {
        // OAuth required - user need to authorize
        if (throwOnError) {
          throw error;
        } else {
          return false;
        }
      } else {
        return await this.connectToSSE({ throwOnError });
      }
    }
  }

  public static async createAndConnectToHTTP(
    url: string,
    headers?: Record<string, string>,
    oAuthHandler?: OAuthHandler,
  ) {
    const client = new HTTPClient(
      {
        name: "test streamable client",
        url,
        headers,
      },
      { oAuthHandler },
    );
    await client.connectToTarget();
    return client;
  }

  public async toPlainObject(include?: {
    tools?: boolean;
    connectionInfo?: boolean;
  }): Promise<HTTPClientPlainObject> {
    return {
      type: "http",
      name: this.name,
      source: this.source,
      toolPrefix: this.toolPrefix,
      disabledTools: this.disabledTools,
      disabled: this.disabled,
      url: this.url,
      headers: this.headers,
      tools: include?.tools
        ? (await this.originalListTools()).tools
        : undefined,
      connectionInfo: include?.connectionInfo
        ? {
            status: this.status,
            lastConnectedAt: this.lastConnectedAt,
            lastErrorMessage: this.lastErrorMessage,
          }
        : undefined,
    };
  }
}

function transportErrorToAppError(
  error: unknown,
  serverUrl: string,
  serverName: string,
): {
  appError: AppError;
  lastErrorMessage: string;
  status: "connected" | "unauthorized" | "error";
} {
  let status: "connected" | "unauthorized" | "error";
  let lastErrorMessage: string;
  let appError: AppError;

  if (error instanceof UnauthorizedError) {
    status = "unauthorized";
    lastErrorMessage = "unauthorized, please re-authenticate";
    appError = new AppError(
      ErrorCode.UNAUTHORIZED,
      `authorization required, [${serverName}] failed to connect to ${serverUrl}`,
      { targetName: serverName, url: serverUrl, message: error.message },
    );
  } else if (
    error instanceof SseError &&
    error.message.includes("ECONNREFUSED")
  ) {
    status = "error";
    lastErrorMessage = "connection refused";

    appError = new AppError(
      ErrorCode.CONNECTION_REFUSED,
      `connection refused, [${serverName}] failed to connect to ${serverUrl}`,
      { targetName: serverName, url: serverUrl },
    );
  } else {
    status = "error";
    lastErrorMessage = error instanceof Error ? error.message : "unknown error";
    appError = new AppError(
      ErrorCode.CONNECTION_REFUSED,
      `connection refused, [${serverName}] failed to connect to ${serverUrl}`,
      { targetName: serverName, url: serverUrl },
    );
  }
  return { appError, lastErrorMessage, status };
}
