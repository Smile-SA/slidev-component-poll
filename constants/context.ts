import type { InjectionKey, Ref, VNodeArrayChildren } from 'vue'

export type Answers = string[] | VNodeArrayChildren

export interface AnswersContext {
  answers: Ref<Answers>
  setAnswers: (answers: Answers) => void
}

export const idContext: InjectionKey<Ref<string>> = Symbol('slidev-poll-id')
export const answersContext: InjectionKey<AnswersContext> = Symbol('slidev-poll-answers')
