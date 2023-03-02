import { reactive, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useStorage } from "@vueuse/core";
import { createSyncState } from "@slidev/client/state/syncState";
import { configs } from "@slidev/client/env";
// @ts-expect-error vite-plugin-vue-server-ref
import pollState from "server-reactive:poll";

import type { PollState, Result } from "../interfaces/Poll";
import { PollStatus } from "../enums/PollStatus";
import { ConnectionStatus } from "../enums/ConnectionStatus";
import { getHash } from "./helper";

export const uid = useStorage("slidev-poll-device-id", uuidv4());
export const groupId = useStorage("slidev-poll-group-id", getHash());
export const autoConnect = useStorage("slidev-poll-auto-connect", '');
export const connectState = ref(ConnectionStatus.IDLE);

let state: PollState;
let connect: () => void;
let initPoll: (id: string, answers: string[]) => void;
let setPollStatus: (id: string, status: PollStatus) => void;
let resetPoll: (id: string) => void;
let answerPoll: (id: string, answer: Result | null) => void

if (configs.pollServer) {
  let ws;
  state = reactive<PollState>({});

  function onMessage(event) {
    const data = JSON.parse(event.data) as PollState;
    Object.entries(data).forEach(([key, value]) => state[key] = value);
  }

  function onOpen() {
    console.log('onOpen', groupId.value)
    if (groupId.value) {
      ws.send(
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
    if (!ws) {
      ws = new WebSocket(configs.pollServer as string);
      ws.addEventListener("message", onMessage);
      ws.addEventListener("open", onOpen)
      ws.addEventListener("close", onClose);
    } else {
      onOpen();
    }
  }

  connect = () => {
    autoConnect.value = new Date().toISOString()
    initWebSocket()
  }

  initPoll = (id: string, answers: string[]) => {
    state[id] = {
      answers,
      results: {},
      status: PollStatus.CLEAR,
    };
  };

  setPollStatus = (id: string, status: PollStatus) => {
    state[id].status = status;
    if (connectState.value === ConnectionStatus.CONNECTED) {
      ws.send(
        JSON.stringify({
          id: groupId.value,
          pollId: id,
          status,
          type: "status",
        })
      );
    }
  };

  resetPoll = (id: string) => {
    state[id].results = {};
    state[id].status = PollStatus.CLEAR;
    if (connectState.value === ConnectionStatus.CONNECTED) {
      ws.send(
        JSON.stringify({
          id: groupId.value,
          pollId: id,
          type: "reset",
        })
      );
    }
  };

  answerPoll = (id: string, result: Result | null) => {
    const poll = state[id];
    if (poll && result !== null) {
      state[id].results[uid.value] = result;
      if (connectState.value === ConnectionStatus.CONNECTED) {
        ws.send(
          JSON.stringify({
            id: groupId.value,
            pollId: id,
            result,
            type: "answer",
            userId: uid.value,
          })
        )
      }
    }
  };
} else {
  ({ state } = createSyncState<PollState>(pollState, {}));

  initPoll = (id: string, answers: string[]) => {
    state[id] = {
      answers,
      results: {},
      status: PollStatus.CLEAR,
    };
  };

  setPollStatus = (id: string, status: PollStatus) => {
    state[id].status = status;
  };

  resetPoll = (id: string) => {
    state[id].results = {};
    state[id].status = PollStatus.CLEAR;
  };

  answerPoll = (id: string, answer: Result | null) => {
    const poll = state[id];
    if (poll && answer !== null) {
      state[id].results[uid.value] = answer;
    }
  };
}

export { answerPoll, connect, initPoll, resetPoll, setPollStatus, state };
