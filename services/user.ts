import { useStorage } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";

import { userState } from "./state.ts";

export const deviceId = useStorage("slidev-poll-device-id", uuidv4());
export const userId = useStorage(
  "slidev-poll-user-id",
  userState[deviceId.value] ?? ""
);

export async function loginPoll(user: string) {
  userState[deviceId.value] = user;
}

//  auto-connect if user exist
setTimeout(() => {
  if (userId && !userState[deviceId.value]) {
    loginPoll(userId.value);
  }
})
