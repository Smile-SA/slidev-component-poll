import { reactive } from "vue";
import { configs } from "@slidev/client/env";
import { createSyncState } from "@slidev/client/state/syncState";
// @ts-expect-error vite-plugin-vue-server-ref
import pollState from "server-reactive:poll";

import type { PollState } from "../types/Poll";

export const state: PollState = configs.pollServer ? reactive<PollState>({}) : createSyncState<PollState>(pollState, {}).state;
