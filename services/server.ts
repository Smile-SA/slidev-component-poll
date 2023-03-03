import { ref } from "vue";
import { useStorage } from "@vueuse/core";

import { ConnectionStatus } from "../types/ConnectionStatus";

import { getHash } from "./helper";

export const groupId = useStorage("slidev-poll-group-id", getHash());
export const autoConnect = useStorage("slidev-poll-auto-connect", "");
export const connectState = ref(ConnectionStatus.IDLE);
