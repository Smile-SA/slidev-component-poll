<script setup lang="ts">
import { computed, inject, isVNode, ref } from "vue";

import { answersContext } from "../constants/context";
import { idContext } from "../constants/context";
import { state } from "../services/state";

import PollResult from "./PollResult.vue";

const id = inject(idContext, ref(''));

const context = inject(answersContext);
const renderAnswers = computed(() => {
  if (context?.answers) {
    return context.answers.value;
  }
  return [];
});

const counts = computed<number[]>(() => {
  const poll = state[id.value];
  if (poll) {
    return renderAnswers.value?.map((_: unknown, i: number) =>
      Object.values(poll.results).reduce(
        (acc: number, result) =>
          acc +
          Number(
            result instanceof Array ? result.indexOf(i) > -1 : result === i
          ),
        0
      )
    );
  }
  return [];
});
const total = computed<number>(() => counts.value.reduce((a, b) => a + b, 0));
const percentages = computed<number[]>(() =>
  counts.value.map((count) =>
    total.value === 0 ? 0 : (count / total.value) * 100
  )
);
const max = computed(() => Math.max(...counts.value));
</script>

<template>
  <ul v-if="state[id]" class="poll-results">
    <PollResult
      v-for="(answer, index) in renderAnswers"
      :count="counts[index]"
      :leading="counts[index] === max"
      :percentage="percentages[index]"
    >
      <component v-if="isVNode(answer)" :is="answer" />
      <div v-else>{{ answer }}</div>
    </PollResult>
  </ul>
</template>
