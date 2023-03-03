import type { SharedState } from "@slidev/client/state/shared";
import type { SlidevConfig } from "@slidev/types";

import type { PollState } from './types/Poll';

declare module "@slidev/client/state/shared" {
  interface SharedState {
    poll: PollState;
  }
}

declare module "@slidev/types" {
  export interface SlidevConfig {
    pollServer?: string;
  }
}
