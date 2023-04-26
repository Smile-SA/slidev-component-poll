<script lang="ts" setup>
import { inject, isVNode, ref } from "vue";

import { useAnswers } from "../composables/useAnswers.ts";
import { idContext } from "../constants/context.ts";

import PollResultQuiz from "./PollResultQuiz.vue";

const props = defineProps<{
  answers?: string[];
  controlled?: boolean;
  correctAnswer?: string | number | number[];
  multiple?: boolean;
  public?: boolean;
}>();
const id = inject(idContext, ref(""));

const renderAnswers = useAnswers(props.answers);
</script>

<template>
  <ul class="poll-results-quiz mb-2">
    <PollResultQuiz
      v-for="(answer, index) in renderAnswers"
      :correctAnswer="correctAnswer"
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
