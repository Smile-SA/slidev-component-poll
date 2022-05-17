import type { SharedState } from "@slidev/client/state/shared";

import { PollState } from './types';

declare module "@slidev/client/state/shared" {
  interface SharedState {
    poll: PollState;
  }
}
