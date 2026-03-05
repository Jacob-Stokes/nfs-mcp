import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NfsConfig, apiCall } from "../api-client.js";

export function registerSitesTools(server: McpServer, config: NfsConfig) {
  server.tool(
    "sites_list",
    "List all sites on the NearlyFreeSpeech.NET account.",
    {},
    async () => {
      const res = await apiCall(config, "GET", "member", config.username, "sites");
      if (res.status !== 200) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Failed to fetch sites", status: res.status, response: res.body }) }],
          isError: true,
        };
      }
      return { content: [{ type: "text" as const, text: res.body }] };
    }
  );
}
