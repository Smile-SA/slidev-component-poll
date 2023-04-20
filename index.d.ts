import type { SharedState } from "@slidev/client/state/shared.ts";
import type { SlidevConfig } from "@slidev/types.ts";

import type { State } from './types/Poll';

declare module "@slidev/client/state/shared" {
  interface SharedState {
    poll: State;
  }
}

declare module "@slidev/types" {
  export interface SlidevConfig {
    pollSettings?: {
      autoConnect?: boolean;
      anonymous?: boolean;
      server?: string;
    }
  }
}
