import { useStorage } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";

import { userState } from "./state.ts";

export const deviceId = useStorage("slidev-poll-device-id", uuidv4());
export const userId = useStorage(
  "slidev-poll-user-id",
  userState[deviceId.value] ?? ""
);

type Listener = (userId: string) => Promise<void>;
const listeners: Listener[] = [];

export const onUserLogin = (listener: Listener) => {
  listeners.push(listener);
};

setTimeout(() => {
  if (userId && !userState[deviceId.value]) {
    listeners.forEach((listener) => {
      listener(userId.value);
    });
  }
});
