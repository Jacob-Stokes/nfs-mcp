#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./api-client.js";
import { registerAccountTools } from "./tools/account.js";
import { registerSitesTools } from "./tools/sites.js";
import { registerDnsTools } from "./tools/dns.js";
import { registerConfigTools } from "./tools/config.js";

const server = new McpServer({
  name: "nfs-mcp",
  version: "1.0.0",
});

const config = loadConfig();

registerAccountTools(server, config);
registerSitesTools(server, config);
registerDnsTools(server, config);
registerConfigTools(server, config);

const transport = new StdioServerTransport();
await server.connect(transport);
