import { PollStatus } from "./PollStatus"

export type Result = number | number[]

export interface Poll {
  results: Record<string, Result>
  status: PollStatus
}

export type PollState = Record<string, Poll>

export type PollResultsProp = 'free' | 'auto' | 'none'
