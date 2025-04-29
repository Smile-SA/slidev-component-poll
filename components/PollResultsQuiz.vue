<script lang="ts" setup>
import { computed, inject, isVNode, ref } from "vue";

import { useAnswers } from "../composables/useAnswers";
import type { CorrectAnswer, DisplayAnswersProp } from "../types";

import PollResultQuiz from "./PollResultQuiz.vue";
import { brierScore, deviceId, mcqScore, pollState } from "../services";
import { idContext } from "../constants";

const props = defineProps<{
  answers?: string[];
  controlled?: boolean;
  correctAnswer?: CorrectAnswer;
  displayAnswers: DisplayAnswersProp;
  explanations?: string[];
  multiple?: boolean;
  public?: boolean;
  showScore?: boolean;
}>();

const renderAnswers = useAnswers(props.answers);

const id = inject(idContext, ref(""));
const result = computed(() => pollState?.[id.value]?.results?.[deviceId.value]);

const score = computed(() => {
  const correctAnswer = props.correctAnswer;
  const results = result.value;
  // non multiple choice questions
  if (
    typeof results === "number" &&
    (typeof correctAnswer === "string" || typeof correctAnswer === "number")
  ) {
    return results === Number(correctAnswer) ? 100 : 0;
  }
  // multiple choice questions
  if (results instanceof Array && correctAnswer) {
    return mcqScore(correctAnswer, results, renderAnswers.value.length);
  }
  // brier score
  if (
    results instanceof Object &&
    !(results instanceof Array) &&
    correctAnswer
  ) {
    return brierScore(correctAnswer, results, renderAnswers.value.length);
  }
  return null;
});
</script>

<template>
  <ul class="poll-results-quiz">
    <PollResultQuiz
      v-for="(answer, index) in renderAnswers"
      :correctAnswer="correctAnswer"
      :displayAnswers="displayAnswers"
      :explanation="explanations?.[index]"
      :index="index"
      :multiple="multiple"
      :public="public"
    >
      <component v-if="isVNode(answer)" :is="answer" />
      <div v-else>{{ answer }}</div>
    </PollResultQuiz>
  </ul>
  <div v-if="showScore && score != null">Your score is {{ score }}%</div>
</template>

<style scoped>
.poll-results-quiz {
  --slidev-code-margin: 0;
  --prism-block-margin-y: 0;
}
</style>
