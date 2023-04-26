import type { PollState, Result, UserState } from "../types/Poll.ts";
import { PollStatus } from "../types/PollStatus.ts";
import { ConnectionStatus } from "../types/ConnectionStatus.ts";
import { Resolve } from "../types/Promise.ts";

import { getPollServer } from "./helper.ts";
import { autoConnect, connectState, groupId } from "./server.ts";
import { pollState, userState } from "./state.ts";
import { deviceId } from "./user.ts";

enum SendType {
  POLL = "poll",
  USER = "user",
}

interface SendPollState {
  type: SendType.POLL
  data: PollState
}

interface SendUserState {
  type: SendType.USER
  data: UserState
}

type SendState = SendPollState | SendUserState;

let resolveConnected: Resolve;
let webSocket: WebSocket;

function onMessage(event) {
  const { data, type } = JSON.parse(event.data) as SendState;
  if (type === SendType.POLL) {
    Object.entries(data).forEach(([key, value]) => (pollState[key] = value));
  } else {
    Object.entries(data).forEach(([key, value]) => (userState[key] = value));
  }
}

function onOpen() {
  if (groupId.value) {
    webSocket.send(
      JSON.stringify({
        id: groupId.value,
        state: pollState,
        type: "connect",
      })
    );
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
  if (!webSocket) {
    webSocket = new WebSocket(getPollServer());
    webSocket.addEventListener("message", onMessage);
    webSocket.addEventListener("open", onOpen);
    webSocket.addEventListener("close", onClose);
  } else {
    onOpen();
  }
}

export function connect(resolve: Resolve) {
  autoConnect.value = new Date().toISOString();
  initWebSocket();
  resolveConnected = resolve;
}

export function setStatus(id: string, status: PollStatus) {
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
}

export function reset(id: string) {
  if (connectState.value === ConnectionStatus.CONNECTED) {
    webSocket.send(
      JSON.stringify({
        id: groupId.value,
        pollId: id,
        type: "reset",
      })
    );
  }
}

export function answer(id: string, result: Result | null) {
  if (connectState.value === ConnectionStatus.CONNECTED) {
    webSocket.send(
      JSON.stringify({
        id: groupId.value,
        pollId: id,
        result,
        type: "answer",
        userId: deviceId.value,
      })
    );
  }
}

export function login(user: string) {
  if (connectState.value === ConnectionStatus.CONNECTED) {
    webSocket.send(
      JSON.stringify({
        id: groupId.value,
        userId: deviceId.value,
        userName: user,
        type: "login",
      })
    );
  }
}
