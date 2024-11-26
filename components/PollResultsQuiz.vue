<script lang="ts" setup>
import { computed, isVNode } from "vue";

import { useAnswers } from "../composables/useAnswers";
import type { CorrectAnswer, DisplayAnswersProp } from "../types";

import PollResultQuiz from "./PollResultQuiz.vue";

const props = defineProps<{
  answers?: string[];
  controlled?: boolean;
  correctAnswer?: CorrectAnswer;
  displayAnswers: DisplayAnswersProp;
  multiple?: boolean;
  public?: boolean;
}>();

const renderAnswers = useAnswers(props.answers);
</script>

<template>
  <ul class="poll-results-quiz ">
    <PollResultQuiz
      v-for="(answer, index) in renderAnswers"
      :correctAnswer="correctAnswer"
      :displayAnswers="displayAnswers"
      :index="index"
      :multiple="multiple"
      :public="public"
    >
      <component v-if="isVNode(answer)" :is="answer" />
      <div v-else>{{ answer }}</div>
    </PollResultQuiz>
  </ul>
</template>

<style scoped>
.poll-results-quiz {
  --slidev-code-margin: 0;
  --prism-block-margin-y: 0;
}
</style>
