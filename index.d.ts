import type { SharedState } from "@slidev/client/state/shared";

import type { PollState } from './interfaces/Poll';

declare module "@slidev/client/state/shared" {
  interface SharedState {
    poll: PollState;
  }
}
