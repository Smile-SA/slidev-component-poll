import { Result } from "../types/Poll";
import { PollStatus } from "../types/PollStatus";

import { state } from "./state";
import { uid } from "./user";

export function init(id: string) {
  state[id] = {
    results: {},
    status: PollStatus.CLEAR,
  };
};

export function setStatus(id: string, status: PollStatus) {
  state[id].status = status;
};

export function reset(id: string) {
  state[id].results = {};
  state[id].status = PollStatus.CLEAR;
};

export function answer(id: string, answer: Result | null) {
  const poll = state[id];
  if (poll && answer !== null) {
    state[id].results[uid.value] = answer;
  }
};
