import { configs } from "@slidev/client";
import { createSyncState } from "@slidev/client/state/syncState.ts";
// @ts-expect-error vite-plugin-vue-server-ref
import poll from "server-reactive:poll";
// @ts-expect-error vite-plugin-vue-server-ref
import pollUsers from "server-reactive:pollUsers";

import type { PollState, UserState } from "../types";

const { state: pollState, init: initPollState } = createSyncState<PollState>(poll, {})
const { state: userState, init: initPollUsersState } = createSyncState<UserState>(pollUsers, {})

initPollState(`${configs.title} - poll`)
initPollUsersState(`${configs.title} - pollUsers`)

export {
  pollState,
  userState
}
