import { PollStatus } from "../enums/PollStatus"

export type Result = number | number[]

export interface Poll {
  answers: string[]
  results: Record<string, Result>
  status: PollStatus
}

export type PollState = Record<string, Poll>
