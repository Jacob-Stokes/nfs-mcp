# nfs-mcp

MCP server for managing NearlyFreeSpeech.NET accounts via the [Model Context Protocol](https://modelcontextprotocol.io). Exposes account, site, domain, and DNS operations as tools for AI agents.

See also: [nfs-cli](https://github.com/Jacob-Stokes/nfs-cli) – the bash CLI counterpart.

## Tools

| Tool | Description |
|------|-------------|
| `account_info` | Get account balance (current, cash, credit, high) |
| `sites_list` | List all sites |
| `domains_list` | List all domains |
| `dns_list` | List DNS records for a domain |
| `dns_add` | Add a DNS record (A, AAAA, CNAME, MX, NS, PTR, SRV, TXT) |
| `dns_delete` | Delete a DNS record |
| `dns_edit` | Replace a DNS record (A, AAAA, TXT only) |
| `config_show` | Show current configuration (no secrets) |

## Setup

### Build

```bash
npm install
npm run build
```

### Configure

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "nfs": {
      "command": "node",
      "args": ["/path/to/nfs-mcp/dist/index.js"],
      "env": {
        "NFS_USERNAME": "your_username",
        "NFS_API_KEY": "your_api_key",
        "NFS_ACCOUNT_ID": "your_account_id"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NFS_USERNAME` | Yes | NearlyFreeSpeech API username |
| `NFS_API_KEY` | Yes | NearlyFreeSpeech API key |
| `NFS_ACCOUNT_ID` | Yes | NearlyFreeSpeech account ID |
| `DEFAULT_DOMAIN` | No | Default domain for DNS operations |
| `DEFAULT_TTL` | No | Default TTL in seconds (default: 3600) |

## Requirements

- Node.js 18+
