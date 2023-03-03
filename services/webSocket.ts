import { reactive } from "vue";

import type { PollState, Result } from "../types/Poll";
import { PollStatus } from "../types/PollStatus";
import { ConnectionStatus } from "../types/ConnectionStatus";

import { getPollServer } from "./helper";
import { autoConnect, connectState, groupId } from "./server";
import { state } from "./state";
import { uid } from "./user";

let webSocket;

function onMessage(event) {
  const data = JSON.parse(event.data) as PollState;
  Object.entries(data).forEach(([key, value]) => (state[key] = value));
}

function onOpen() {
  if (groupId.value) {
    webSocket.send(
      JSON.stringify({
        id: groupId.value,
        state,
        type: "connect",
      })
    );
    connectState.value = ConnectionStatus.CONNECTED;
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
  if (!webSocket) {
    webSocket = new WebSocket(getPollServer());
    webSocket.addEventListener("message", onMessage);
    webSocket.addEventListener("open", onOpen);
    webSocket.addEventListener("close", onClose);
  } else {
    onOpen();
  }
}

export function connect() {
  autoConnect.value = new Date().toISOString();
  initWebSocket();
};

export function init(id: string) {
  state[id] = {
    results: {},
    status: PollStatus.CLEAR,
  };
};

export function setStatus(id: string, status: PollStatus) {
  state[id].status = status;
  if (connectState.value === ConnectionStatus.CONNECTED) {
    webSocket.send(
      JSON.stringify({
        id: groupId.value,
        pollId: id,
        status,
        type: "status",
      })
    );
  }
};

export function reset(id: string) {
  state[id].results = {};
  state[id].status = PollStatus.CLEAR;
  if (connectState.value === ConnectionStatus.CONNECTED) {
    webSocket.send(
      JSON.stringify({
        id: groupId.value,
        pollId: id,
        type: "reset",
      })
    );
  }
};

export function answer(id: string, result: Result | null) {
  const poll = state[id];
  if (poll && result !== null) {
    state[id].results[uid.value] = result;
    if (connectState.value === ConnectionStatus.CONNECTED) {
      webSocket.send(
        JSON.stringify({
          id: groupId.value,
          pollId: id,
          result,
          type: "answer",
          userId: uid.value,
        })
      );
    }
  }
};
