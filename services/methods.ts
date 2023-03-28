import { configs } from "@slidev/client/env";

import type { Result } from "../types/Poll";
import { PollStatus } from "../types/PollStatus";
import { Resolve } from "../types/Promise";

import { pollState, userState } from "./state";
import { deviceId } from "./user";

let connect: (resolve: Resolve) => void;
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
      ({ answer, connect, login, reset, setStatus } = await import(
        "./webSocket"
      ));
    } else {
      ({ answer, connect, login, reset, setStatus } = await import(
        "./http"
      ));
    }
  } else {
    resolveConnected();
  }
})();

export async function answerPoll(id: string, result: Result | null) {
  const poll = pollState[id];
  if (poll && result !== null) {
    pollState[id].results[deviceId.value] = result;
    await promise;
    await connectedPromise;
    answer?.(id, result);
  }
}

export async function connectPoll() {
  await promise;
  connect?.(resolveConnected);
}

export async function loginPoll(user: string) {
  userState[deviceId.value] = user;
  await promise;
  await connectedPromise;
  login?.(user);
}

export async function resetPoll(id: string) {
  pollState[id].results = {};
  pollState[id].status = PollStatus.CLEAR;
  await promise;
  await connectedPromise;
  reset?.(id);
}

export async function setPollStatus(id: string, status: PollStatus) {
  pollState[id].status = status;
  await promise;
  await connectedPromise;
  setStatus?.(id, status);
}

export function initPoll(id: string) {
  pollState[id] = {
    results: {},
    status: PollStatus.CLEAR,
  };
}
