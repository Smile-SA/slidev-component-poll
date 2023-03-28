import { configs } from "@slidev/client/env";

import type { Result } from "../types/Poll";
import { PollStatus } from "../types/PollStatus";
import { Resolve } from "../types/Promise";

let connect: (resolve: Resolve) => void;
let init: (id: string) => void;
let setStatus: (id: string, status: PollStatus) => void;
let reset: (id: string) => void;
let answer: (id: string, result: Result | null) => void;
let login: (user: string) => void;

let resolveConnected: Resolve = () => {};
const connectedPromise = new Promise<void>((resolve) => {
  resolveConnected = resolve
})

const promise = (async () => {
  if (configs.pollSettings?.server) {
    if (configs.pollSettings.server.startsWith("ws")) {
      ({ answer, connect, init, login, reset, setStatus } = await import(
        "./webSocket"
      ));
    } else {
      ({ answer, connect, init, login, reset, setStatus } = await import(
        "./http"
      ));
    }
  } else {
    ({ answer, init, login, reset, setStatus } = await import("./serverRef"));
    resolveConnected();
  }
})();

export async function answerPoll(id: string, result: Result | null) {
  await promise;
  await connectedPromise;
  answer?.(id, result);
}

export async function connectPoll() {
  await promise;
  connect?.(resolveConnected);
}

export async function loginPoll(user: string) {
  await promise;
  await connectedPromise;
  login?.(user);
}

export async function initPoll(id: string) {
  await promise;
  await connectedPromise;
  init?.(id);
}

export async function resetPoll(id: string) {
  await promise;
  await connectedPromise;
  reset?.(id);
}

export async function setPollStatus(id: string, status: PollStatus) {
  await promise;
  await connectedPromise;
  setStatus?.(id, status);
}
