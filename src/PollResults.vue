<script setup lang="ts">
import { computed } from 'vue';

import { state } from "./state";
import PollResult from './PollResult.vue';

const props = defineProps<{
  id: string
}>();
const { id } = props;

const counts = computed<number[]>(() => {
  const poll = state[id];
  if (poll) {
    return poll.answers?.map(
      (_: string, i: number) => Object.values(poll.results).reduce(
        (acc: number, result) => acc + Number(result instanceof Array ? result.indexOf(i) > -1 : result === i),
        0
      )
    );
  }
  return [];
})
const total = computed<number>(() => counts.value.reduce((a, b) => a + b, 0))
const percentages = computed<number[]>(() => counts.value.map(count => total.value === 0 ? 0 : count / total.value * 100))
</script>

<template>
  <ul v-if="state[id]" class="poll-results">
    <PollResult v-for="(answer, index) in state[id].answers" :answer="answer" :count="counts[index]" :percentage="percentages[index]"/>
  </ul>
</template>
