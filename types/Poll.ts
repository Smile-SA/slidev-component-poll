import { PollStatus } from "./PollStatus.ts";

export type Result = number | number[] | Record<number, number>;

export interface Poll {
  results: Record<string, Result>;
  status: PollStatus;
}

export type PollState = Record<string, Poll>;
export type UserState = Record<string, string>;

export type CorrectAnswer = string | number | number[] | Record<number, number | null>;
export type DisplayAnswersProp = "mcq" | "brier";
export type ShowResultsProp = "free" | "auto" | "none";
