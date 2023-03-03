import { configs } from "@slidev/client/env";

import type { Result } from "../types/Poll";
import { PollStatus } from "../types/PollStatus";

let connect: () => void;
let init: (id: string) => void;
let setStatus: (id: string, status: PollStatus) => void;
let reset: (id: string) => void;
let answer: (id: string, result: Result | null) => void;

const promise = (async () => {
  if (configs.pollServer) {
    if (configs.pollServer.startsWith("ws")) {
      ({ answer, connect, init, reset, setStatus } = await import(
        "./webSocket"
      ));
    } else {
      ({ answer, connect, init, reset, setStatus } = await import(
        "./http"
      ));
    }
  } else {
    ({ answer, init, reset, setStatus } = await import(
      "./serverRef"
    ));
  }
})();

export async function answerPoll(id: string, result: Result | null) {
  await promise;
  answer?.(id, result)
}

export async function connectPoll() {
  await promise;
  connect?.()
}

export async function initPoll(id: string) {
  await promise;
  init?.(id)
}

export async function resetPoll(id: string) {
  await promise;
  reset?.(id)
}

export async function setPollStatus(id: string, status: PollStatus) {
  await promise;
  setStatus?.(id, status)
}
