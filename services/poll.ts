import type { Result } from "../types";
import { PollStatus } from "../types";

import { pollState } from "./state";
import { deviceId } from "./user";

export function initPoll(id: string) {
  pollState[id] = {
    results: {},
    status: PollStatus.CLEAR,
  };
}

export async function setPollStatus(id: string, status: PollStatus) {
  pollState[id].status = status;
}

export async function resetPoll(id: string) {
  pollState[id].results = {};
  pollState[id].status = PollStatus.CLEAR;
}

export async function answerPoll(id: string, result: Result | null) {
  const poll = pollState[id];
  if (poll && result !== null) {
    pollState[id].results[deviceId.value] = result;
  }
}