<script lang="ts" setup>
import { inject, ref } from "vue";

import { idContext } from "../constants";
import { canUseControls, pollState } from "../services";
import type { CorrectAnswer, DisplayAnswersProp } from "../types";
import { PollStatus } from "../types";

import PollResultsPoll from "./PollResultsPoll.vue";
import PollResultsQuiz from "./PollResultsQuiz.vue";

defineProps<{
  answers?: string[];
  controlled?: boolean;
  correctAnswer?: CorrectAnswer;
  displayAnswers: DisplayAnswersProp;
  explanations?: string[];
  multiple?: boolean;
  public?: boolean;
  showScore?: boolean;
}>();
const id = inject(idContext, ref(""));
</script>

<template>
  <template v-if="pollState && pollState[id]">
    <template
      v-if="
        !controlled ||
        pollState[id].status === PollStatus.CLOSED ||
        canUseControls
      "
    >
      <PollResultsPoll
        v-if="!correctAnswer"
        :controlled="controlled"
        :correctAnswer="correctAnswer"
        :displayAnswers="displayAnswers"
        :explanations="explanations"
        :multiple="multiple"
      />
      <PollResultsQuiz
        v-else
        :answers="answers"
        :controlled="controlled"
        :correctAnswer="correctAnswer"
        :displayAnswers="displayAnswers"
        :explanations="explanations"
        :multiple="multiple"
        :public="public"
        :showScore="showScore"
      />
    </template>
    <template v-else>
      <p>Your answer has been submitted.</p>
      <p>Waiting for the poll to be closed...</p>
    </template>
  </template>
</template>

<style>
.poll-result__item {
  @apply list-none !ml-0;
}

.poll-result {
  @apply relative border-1 border-transparent flex justify-between items-center gap-2 rounded-md overflow-hidden !mt-1 !mr-0 !mb-1 !p-1 !leading-6;
}

.poll-result--bar {
  --slidev-code-margin: 0;
  --prism-block-margin-y: 0;
  transition: opacity 200ms linear;
}

.poll-result--bar::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  @apply bg-gray-200;
}

.dark .poll-result--bar::before {
  @apply bg-gray-800;
}

.poll-result__bar {
  @apply bg-gray-400;
}

.dark .poll-result__bar {
  @apply bg-gray-600;
}

.poll-result .poll-result__answer > p {
  margin: 0;
}

.poll-result__explanation {
  font-size: 0.8rem;
  text-align: right;
  line-height: 1em;
  margin-bottom: 0.5em;
}

.poll-result__answer,
.poll-result__percentage,
.poll-result__count,
.poll-result__estimate {
  text-shadow:
    0 0 1px white,
    0 0 2px white,
    0 0 3px white;
}

.dark .poll-result__answer,
.dark .poll-result__percentage,
.dark .poll-result__count,
.dark .poll-result__estimate {
  text-shadow:
    0 0 1px black,
    0 0 2px black,
    0 0 3px black;
}
</style>
