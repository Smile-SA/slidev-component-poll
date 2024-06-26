import { reactive } from "vue";
import { configs } from "@slidev/client";
import { createSyncState } from "@slidev/client/state/syncState.ts";
// @ts-expect-error vite-plugin-vue-server-ref
import polls from "server-reactive:polls";
// @ts-expect-error vite-plugin-vue-server-ref
import users from "server-reactive:users";

import type { PollState, UserState } from "../types/Poll.ts";

export const pollState: PollState = configs.pollSettings?.server
  ? reactive<PollState>({})
  : createSyncState<PollState>(polls, {}).state;
export const userState: UserState = configs.pollSettings?.server
  ? reactive<UserState>({})
  : createSyncState<UserState>(users, {}).state;
