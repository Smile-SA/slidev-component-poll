<script lang="ts" setup>
import { computed, inject, isVNode, ref } from "vue";

import { answersContext, idContext } from "../constants";
import { pollState } from "../services";

import PollResultPoll from "./PollResultPoll.vue";

const props = defineProps<{
  controlled?: boolean;
  correctAnswer?: string | number | number[];
  multiple?: boolean;
}>();

const id = inject(idContext, ref(""));

const context = inject(answersContext);
const renderAnswers = computed(() => {
  if (context?.answers) {
    return context.answers.value;
  }
  return [];
});

const poll = computed(() => pollState[id.value]);

const counts = computed<number[]>(() => {
  if (!poll.value) return [];

  return renderAnswers.value?.map((_: unknown, i: number) =>
    Object.values(poll.value.results).reduce(
      (acc: number, result) =>
        acc +
        Number(
          result instanceof Array ? result.indexOf(i) > -1 : result === i
        ),
      0
    )
  );
});

const total = computed<number>(() => {
  if (props.multiple) return Object.keys(poll.value.results).length;
  return counts.value.reduce((a, b) => a + b, 0);
});

const percentages = computed<number[]>(() =>
  counts.value.map((count) =>
    total.value === 0 ? 0 : (count / total.value) * 100
  )
);
const max = computed(() => Math.max(...counts.value));
</script>

<template>
  <ul v-if="poll" class="poll-results">
    <PollResultPoll
      v-for="(answer, index) in renderAnswers"
      :controlled="controlled"
      :count="counts[index]"
      :correctAnswer="correctAnswer"
      :index="index"
      :leading="counts[index] === max"
      :percentage="percentages[index]"
    >
      <component v-if="isVNode(answer)" :is="answer" />
      <div v-else>{{ answer }}</div>
    </PollResultPoll>
  </ul>
</template>
