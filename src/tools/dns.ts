import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NfsConfig, apiCall, encodeParams } from "../api-client.js";

const DNS_ALLOWED_TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "PTR", "SRV", "TXT"] as const;
const DNS_EDITABLE_TYPES = ["A", "AAAA", "TXT"] as const;

function normalizeName(name: string): string {
  return name === "@" ? "" : name;
}

export function registerDnsTools(server: McpServer, config: NfsConfig) {
  server.tool(
    "dns_list",
    "List all DNS records for a domain. Returns name, type, data, and TTL for each record.",
    { domain: z.string().describe("The domain name to list DNS records for (e.g. example.com)") },
    async ({ domain }) => {
      const res = await apiCall(config, "POST", "dns", domain, "listRRs");
      if (res.status !== 200) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Failed to list DNS records", status: res.status, response: res.body }) }],
          isError: true,
        };
      }
      return { content: [{ type: "text" as const, text: res.body }] };
    }
  );

  server.tool(
    "dns_add",
    "Add a DNS record to a domain.",
    {
      domain: z.string().describe("The domain name"),
      name: z.string().describe("Record name (use @ or empty string for root)"),
      type: z.enum(DNS_ALLOWED_TYPES).describe("DNS record type"),
      data: z.string().describe("Record data (e.g. IP address, hostname)"),
      ttl: z.number().optional().default(3600).describe("Time to live in seconds (default: 3600)"),
    },
    async ({ domain, name, type, data, ttl }) => {
      const body = encodeParams({
        name: normalizeName(name),
        type,
        data,
        ttl: ttl.toString(),
      });
      const res = await apiCall(config, "POST", "dns", domain, "addRR", body);
      if (res.status !== 200) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Failed to add DNS record", status: res.status, response: res.body }) }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ status: "success", action: "added", record: { name, type, data, ttl } }) }],
      };
    }
  );

  server.tool(
    "dns_delete",
    "Delete a DNS record from a domain. Requires exact match on name, type, and data.",
    {
      domain: z.string().describe("The domain name"),
      name: z.string().describe("Record name (use @ or empty string for root)"),
      type: z.string().describe("DNS record type"),
      data: z.string().describe("Record data to match for deletion"),
    },
    async ({ domain, name, type, data }) => {
      const body = encodeParams({
        name: normalizeName(name),
        type,
        data,
      });
      const res = await apiCall(config, "POST", "dns", domain, "removeRR", body);
      if (res.status !== 200) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Failed to delete DNS record", status: res.status, response: res.body }) }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ status: "success", action: "deleted", record: { name, type, data } }) }],
      };
    }
  );

  server.tool(
    "dns_edit",
    "Replace a DNS record with new values. Only A, AAAA, and TXT records can be edited.",
    {
      domain: z.string().describe("The domain name"),
      name: z.string().describe("Record name (use @ or empty string for root)"),
      type: z.enum(DNS_EDITABLE_TYPES).describe("DNS record type (only A, AAAA, TXT supported)"),
      data: z.string().describe("New record data"),
      ttl: z.number().optional().default(3600).describe("New TTL in seconds (default: 3600)"),
    },
    async ({ domain, name, type, data, ttl }) => {
      const body = encodeParams({
        name: normalizeName(name),
        type,
        data,
        ttl: ttl.toString(),
      });
      const res = await apiCall(config, "POST", "dns", domain, "replaceRR", body);
      if (res.status !== 200) {
        return {
          content: [{ type: "text" as const, text: JSON.stringify({ error: "Failed to edit DNS record", status: res.status, response: res.body }) }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ status: "success", action: "replaced", record: { name, type, data, ttl } }) }],
      };
    }
  );
}
