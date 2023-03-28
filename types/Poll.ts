import { PollStatus } from "./PollStatus";

export type Result = number | number[];

export interface Poll {
  results: Record<string, Result>;
  status: PollStatus;
}

export type PollState = Record<string, Poll>;
export type UserState = Record<string, string>;

export type DisplayResultsProp = "poll" | "quiz" | "publicQuiz";
export type ShowResultsProp = "free" | "auto" | "none";
