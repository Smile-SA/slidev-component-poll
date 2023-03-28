import { Result } from "../types/Poll";
import { PollStatus } from "../types/PollStatus";

import { pollState, userState } from "./state";
import { deviceId } from "./user";

export function init(id: string) {
  pollState[id] = {
    results: {},
    status: PollStatus.CLEAR,
  };
}

export function setStatus(id: string, status: PollStatus) {
  pollState[id].status = status;
}

export function reset(id: string) {
  pollState[id].results = {};
  pollState[id].status = PollStatus.CLEAR;
}

export function answer(id: string, answer: Result | null) {
  const poll = pollState[id];
  if (poll && answer !== null) {
    pollState[id].results[deviceId.value] = answer;
  }
}

export function login(user: string) {
  userState[deviceId.value] = user;
}
