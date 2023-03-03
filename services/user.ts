import { useStorage } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";

export const uid = useStorage("slidev-poll-device-id", uuidv4());
