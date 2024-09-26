<script lang="ts" setup>
import { computed, inject, ref, watch } from "vue";
import { useSpring } from "@vueuse/motion";

import { idContext } from "../constants";
import { indexMatchResult, pollState } from "../services";
import { PollStatus } from "../types";

const props = defineProps<{
  controlled?: boolean;
  count: number;
  correctAnswer?: string | number | number[];
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
  if (!props.controlled || pollState[id.value].status === PollStatus.CLOSED) {
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
    class="poll-result relative list-none flex justify-between items-center rounded-md overflow-hidden !mt-1 !mr-0 !mb-1 !ml-0 !p-1 !leading-6"
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
.poll-result {
  --slidev-code-margin: 0;
  --prism-block-margin-y: 0;
  transition: opacity 200ms linear;
}

.poll-result::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  @apply bg-gray-200;
}

.dark .poll-result::before {
  @apply bg-gray-800;
}

.poll-result__bar {
  @apply bg-gray-400;
}

.dark .poll-result__bar {
  @apply bg-gray-600;
}

.poll-result__count::before {
  content: "(";
}

.poll-result__count::after {
  content: ")";
}
</style>

<style>
.poll-result .poll-result__answer > p {
  margin: 0;
}
</style>
