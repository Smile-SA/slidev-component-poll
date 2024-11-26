<script lang="ts" setup>
import { computed, inject, ref, watch } from "vue";
import { useSpring } from "@vueuse/motion";

import { idContext } from "../constants";
import { indexMatchResult, pollState } from "../services";
import { CorrectAnswer, DisplayAnswersProp, PollStatus } from "../types";

const props = defineProps<{
  controlled?: boolean;
  count: number;
  correctAnswer?: CorrectAnswer;
  displayAnswers: DisplayAnswersProp;
  index: number;
  leading?: boolean;
  percentage: number;
}>();

const id = inject(idContext, ref(""));

const percentageRef = ref<number>(props.percentage);
const { set } = useSpring(percentageRef as any, {
  damping: 50,
  stiffness: 220,
});

const downplayed = computed(() => {
  if ((!props.controlled || pollState[id.value].status === PollStatus.CLOSED) && props.displayAnswers !== 'brier') {
    if (props.correctAnswer !== undefined) {
      return !indexMatchResult(props.index, props.correctAnswer);
    }
    return !props.leading;
  }
  return false;
});

watch(
  () => props.percentage,
  () => set({ value: props.percentage } as any)
);
</script>

<template>
  <li
    class="poll-result poll-result--bar"
    :class="{ 'opacity-50': downplayed }"
  >
    <div
      :style="{ width: `${percentageRef}%` }"
      class="poll-result__bar absolute top-0 bottom-0 left-0"
    ></div>
    <div class="poll-result__answer z-0">
      <slot />
    </div>
    <div class="poll-result__values z-0">
      <span class="poll-result__percentage"
        >{{ percentageRef.toFixed(0) }}%</span
      >
      <span class="poll-result__count">{{ count }}</span>
    </div>
  </li>
</template>

<style scoped>
.poll-result__count::before {
  content: "(";
}

.poll-result__count::after {
  content: ")";
}
</style>
