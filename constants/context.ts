import type { InjectionKey, Ref, RendererNode, VNodeArrayChildren } from "vue";

export type Answers = string[] | RendererNode[] // VNodeArrayChildren;

export interface AnswersContext {
  answers: Ref<Answers>;
  setAnswers: (answers: Answers) => void;
}

export const idContext: InjectionKey<Ref<string>> = Symbol("slidev-poll-id");
export const answersContext: InjectionKey<AnswersContext> = Symbol(
  "slidev-poll-answers"
);
