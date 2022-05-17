export enum PollStatus {
  CLEAR,
  OPEN,
  CLOSED
}

export interface Poll {
  answers: string[]
  results: Record<string, number | number[]>
  status: PollStatus
}

export type PollState = Record<string, Poll>
