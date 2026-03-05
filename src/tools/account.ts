import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NfsConfig, apiCall } from "../api-client.js";

export function registerAccountTools(server: McpServer, config: NfsConfig) {
  server.tool(
    "account_info",
    "Get NearlyFreeSpeech.NET account balance information including current balance, cash, credit, and highest balance.",
    {
      account_id: z.string().optional().describe("Account ID to query. Defaults to NFS_ACCOUNT_ID from environment."),
    },
    async ({ account_id }) => {
      const acctId = account_id || config.accountId;
      const endpoints = ["balance", "balanceCash", "balanceCredit", "balanceHigh"] as const;
      const results: Record<string, string> = {};

      for (const endpoint of endpoints) {
        const res = await apiCall(config, "GET", "account", acctId, endpoint);
        if (res.status !== 200) {
          return {
            content: [{ type: "text" as const, text: JSON.stringify({ error: `Failed to fetch ${endpoint}`, status: res.status, response: res.body }) }],
            isError: true,
          };
        }
        results[endpoint] = res.body;
      }

      const balance = parseFloat(results.balance);
      const high = parseFloat(results.balanceHigh);
      const percentOfHigh = high > 0 ? ((balance / high) * 100).toFixed(1) : null;

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            balance: results.balance,
            balanceCash: results.balanceCash,
            balanceCredit: results.balanceCredit,
            balanceHigh: results.balanceHigh,
            percentOfHigh,
          }),
        }],
      };
    }
  );
}
