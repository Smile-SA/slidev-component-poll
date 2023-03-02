import { PollStatus } from "../enums/PollStatus"

export type Result = number | number[]

export interface Poll {
  results: Record<string, Result>
  status: PollStatus
}

export type PollState = Record<string, Poll>
