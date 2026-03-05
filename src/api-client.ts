import { createAuthHeader } from "./auth.js";

const BASE_URL = "https://api.nearlyfreespeech.net";

export interface NfsConfig {
  username: string;
  apiKey: string;
  accountId: string;
  defaultDomain?: string;
  defaultTtl: number;
}

export function loadConfig(): NfsConfig {
  const username = process.env.NFS_USERNAME;
  const apiKey = process.env.NFS_API_KEY;
  const accountId = process.env.NFS_ACCOUNT_ID;

  if (!username || !apiKey || !accountId) {
    throw new Error(
      "Missing required environment variables: NFS_USERNAME, NFS_API_KEY, NFS_ACCOUNT_ID"
    );
  }

  return {
    username,
    apiKey,
    accountId,
    defaultDomain: process.env.DEFAULT_DOMAIN,
    defaultTtl: parseInt(process.env.DEFAULT_TTL || "3600", 10),
  };
}

export interface ApiResponse {
  status: number;
  body: string;
}

export async function apiCall(
  config: NfsConfig,
  method: "GET" | "POST",
  objectType: "member" | "account" | "dns",
  objectId: string,
  endpoint: string,
  body?: string
): Promise<ApiResponse> {
  const uri = `/${objectType}/${objectId}/${endpoint}`;
  const requestBody = body ?? "";
  const authHeader = createAuthHeader(
    config.username,
    config.apiKey,
    uri,
    requestBody
  );

  const headers: Record<string, string> = {
    "X-NFSN-Authentication": authHeader,
  };

  const fetchOptions: RequestInit = { method, headers };

  if (requestBody) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    fetchOptions.body = requestBody;
  }

  const response = await fetch(`${BASE_URL}${uri}`, fetchOptions);
  const responseBody = await response.text();

  return { status: response.status, body: responseBody };
}

export function encodeParams(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}
