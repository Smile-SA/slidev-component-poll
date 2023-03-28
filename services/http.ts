import type { PollState, Result, UserState } from "../types/Poll";
import { PollStatus } from "../types/PollStatus";
import { ConnectionStatus } from "../types/ConnectionStatus";

import { getPollServer } from "./helper";
import { autoConnect, connectState, groupId } from "./server";
import { pollState, userState } from "./state";
import { deviceId } from "./user";
import { Resolve } from "../types/Promise";

let eventSource: EventSource;
let resolveConnected: Resolve;
const url = getPollServer();

function onPollMessage(event) {
  const data = JSON.parse(event.data) as PollState;
  Object.entries(data).forEach(([key, value]) => (pollState[key] = value));
}

function onUserMessage(event) {
  const data = JSON.parse(event.data) as UserState;
  Object.entries(data).forEach(([key, value]) => (userState[key] = value));
}

function onOpen() {
  if (groupId.value) {
    fetch(`${url}/connect?uid=${deviceId.value}`, {
      body: JSON.stringify({
        id: groupId.value,
        state: pollState,
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });
    connectState.value = ConnectionStatus.CONNECTED;
    resolveConnected()
  }
}

function onClose() {
  if (connectState.value === ConnectionStatus.IDLE) {
    connectState.value = ConnectionStatus.ERROR;
  } else {
    connectState.value = ConnectionStatus.DISCONNECTED;
  }
}

function initWebSocket() {
  if (!eventSource) {
    eventSource = new EventSource(`${url}/event?uid=${deviceId.value}`);
    eventSource.addEventListener("poll", onPollMessage);
    eventSource.addEventListener("user", onUserMessage);
    eventSource.addEventListener("open", onOpen);
    eventSource.addEventListener("error", onClose);
  } else {
    onOpen();
  }
}

export function connect(resolve: Resolve) {
  autoConnect.value = new Date().toISOString();
  initWebSocket();
  resolveConnected = resolve
}

export function setStatus(id: string, status: PollStatus) {
  if (connectState.value === ConnectionStatus.CONNECTED) {
    fetch(`${url}/status?uid=${deviceId.value}`, {
      body: JSON.stringify({
        id: groupId.value,
        pollId: id,
        status,
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });
  }
}

export function reset(id: string) {
  if (connectState.value === ConnectionStatus.CONNECTED) {
    fetch(`${url}/reset?uid=${deviceId.value}`, {
      body: JSON.stringify({
        id: groupId.value,
        pollId: id,
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });
  }
}

export function answer(id: string, result: Result | null) {
  if (connectState.value === ConnectionStatus.CONNECTED) {
    fetch(`${url}/answer?uid=${deviceId.value}`, {
      body: JSON.stringify({
        id: groupId.value,
        pollId: id,
        result,
        userId: deviceId.value,
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });
  }
}

export function login(user: string) {
  if (connectState.value === ConnectionStatus.CONNECTED) {
    fetch(`${url}/login?uid=${deviceId.value}`, {
      body: JSON.stringify({
        id: groupId.value,
        userId: deviceId.value,
        userName: user,
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
