import {
  type ConfiguratorTarget,
  getConfigurator,
} from "@director.run/client-configurator/index";
import { proxyHTTPToStdio } from "@director.run/mcp/transport";
import {
  DirectorCommand,
  makeOption,
} from "@director.run/utilities/cli/director-command";
import { makeTable } from "@director.run/utilities/cli/index";
import { actionWithErrorHandler } from "@director.run/utilities/cli/index";
import { joinURL } from "@director.run/utilities/url";
import { gatewayClient } from "../client";
import { env } from "../env";
import { registerAddCommand } from "./core/add";
import { registerAuthCommand } from "./core/authenticate";
import { registerConnectCommand } from "./core/connect";
import { registerDebugCommands } from "./core/debug";
import { registerEnvCommand } from "./core/env";
import { registerGetCommand } from "./core/get";
import { registerQuickstartCommand } from "./core/quickstart";
import { registerRemoveCommand } from "./core/remove";
import { registerServeCommand } from "./core/serve";
import { registerStatusCommand } from "./core/status";
import { registerStudioCommand } from "./core/studio";
import { registerUpdateCommand } from "./core/update";

export function registerCoreCommands(program: DirectorCommand): void {
  registerQuickstartCommand(program);
  registerServeCommand(program);
  registerStudioCommand(program);

  program
    .command("ls")
    .alias("list")
    .description("List proxies")
    .action(
      actionWithErrorHandler(async () => {
        const proxies = await gatewayClient.store.getAll.query();

        if (proxies.length === 0) {
          console.log("no proxies configured yet.");
        } else {
          const table = makeTable(["id", "name", "path"]);

          table.push(
            ...proxies.map((proxy) => [
              proxy.id,
              proxy.name,
              joinURL(env.GATEWAY_URL, proxy.paths.streamable),
            ]),
          );

          console.log(table.toString());
        }
      }),
    );

  registerGetCommand(program);
  registerAuthCommand(program);

  program
    .command("create <name>")
    .description("Create a new proxy")
    .action(
      actionWithErrorHandler(async (name: string) => {
        const proxy = await gatewayClient.store.create.mutate({
          name,
          servers: [],
        });

        console.log(`proxy ${proxy.id} created`);
      }),
    );

  program
    .command("destroy <proxyId>")
    .description("Delete a proxy")
    .action(
      actionWithErrorHandler(async (proxyId: string) => {
        await gatewayClient.store.delete.mutate({
          proxyId,
        });

        console.log(`proxy ${proxyId} deleted`);
      }),
    );

  registerConnectCommand(program);

  program
    .command("disconnect <proxyId>")
    .description("Disconnect a proxy from an MCP client")
    .addOption(
      makeOption({
        flags: "-t,--target <target>",
        description: "target client",
        choices: ["claude", "cursor", "vscode"],
      }).makeOptionMandatory(),
    )
    .action(
      actionWithErrorHandler(
        async (proxyId: string, options: { target: ConfiguratorTarget }) => {
          const proxy = await gatewayClient.store.get.query({ proxyId });
          const installer = await getConfigurator(options.target);
          const result = await installer.uninstall(proxy.id);
          console.log(result);
        },
      ),
    );

  registerAddCommand(program);
  registerRemoveCommand(program);
  registerUpdateCommand(program);

  program
    .command("http2stdio <url>")
    .description(
      "Proxy an HTTP connection (sse or streamable) to a stdio stream",
    )
    .action(async (url) => {
      await proxyHTTPToStdio(url);
    });

  registerEnvCommand(program);
  registerStatusCommand(program);

  registerDebugCommands(program);
}
