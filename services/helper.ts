import type { RouteRecordRaw } from "vue-router";
import Hashids from "hashids";
import { presenterPassword } from "@slidev/client/logic/nav";
import { configs } from "@slidev/client/env";
// @ts-expect-error missing types
import rawRoutes from "/@slidev/routes";

const hashids = new Hashids();

export function hasControlAccess(): boolean {
  return !configs.remote || configs.remote === presenterPassword.value;
}

export function isPrivateRemoteEnabled(): boolean {
  return Boolean(configs.remote);
}

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
function cyrb53(str: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function getHash() {
  const slides = rawRoutes
    .map((route) => route?.meta?.slide?.raw ?? "")
    .join("\n");
  return hashids.encode(cyrb53(slides));
}

export function getPollServer() {
  if (configs.pollServer) {
    return configs.pollServer.endsWith("/")
      ? configs.pollServer.slice(0, -1)
      : configs.pollServer;
  }
  return "";
}
