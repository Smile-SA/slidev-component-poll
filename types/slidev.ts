import type { SlidevConfig } from "@slidev/types";

declare module "@slidev/types" {
  export interface SlidevConfig {
    pollSettings?: {
      anonymous?: boolean;
    };
  }
}
