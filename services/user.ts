import { useStorage } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";

import { loginPoll } from "./methods";
import { userState } from "./state";

export const deviceId = useStorage("slidev-poll-device-id", uuidv4());
export const userId = useStorage(
  "slidev-poll-user-id",
  userState[deviceId.value] ?? ""
);

if (userId && !userState[deviceId.value]) {
  loginPoll(userId.value);
}
