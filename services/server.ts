import { ref } from "vue";
import { useStorage } from "@vueuse/core";

import { ConnectionStatus } from "../types/ConnectionStatus.ts";

import { getHash } from "./helper.ts";

export const groupId = useStorage("slidev-poll-group-id", getHash());
export const autoConnect = useStorage("slidev-poll-auto-connect", "");
export const connectState = ref(ConnectionStatus.IDLE);
