import { createHash, randomBytes } from "node:crypto";

export function createAuthHeader(
  username: string,
  apiKey: string,
  uri: string,
  body: string
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const salt = randomBytes(16).toString("hex");
  const bodyHash = createHash("sha1").update(body).digest("hex");
  const hashString = `${username};${timestamp};${salt};${apiKey};${uri};${bodyHash}`;
  const hash = createHash("sha1").update(hashString).digest("hex");
  return `${username};${timestamp};${salt};${hash}`;
}
