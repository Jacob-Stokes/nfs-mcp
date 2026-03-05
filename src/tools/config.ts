import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NfsConfig } from "../api-client.js";

export function registerConfigTools(server: McpServer, config: NfsConfig) {
  server.tool(
    "config_show",
    "Show current NearlyFreeSpeech configuration (username, account ID, defaults). Does not reveal the API key.",
    {},
    async () => {
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            username: config.username,
            accountId: config.accountId,
            defaultDomain: config.defaultDomain ?? null,
            defaultTtl: config.defaultTtl,
          }),
        }],
      };
    }
  );
}
