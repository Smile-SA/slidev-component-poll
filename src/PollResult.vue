<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSpring } from '@vueuse/motion';

const props = defineProps<{
  answer: string
  count: number
  percentage: number
}>();
const { percentage } = props;

const percentageRef = ref<number>(percentage);
const { set } = useSpring(percentageRef as any, {
  damping: 50,
  stiffness: 220,
});

watch(
  () => props.percentage,
  () => set({ value: props.percentage } as any)
);
</script>

<template>
  <li class="poll-result relative list-none flex justify-between items-center h-8 rounded-md overflow-hidden !mt-1 !mr-0 !mb-1 !ml-0 !p-1">
    <div :style="{ width: `${percentageRef}%` }" class="poll-result__bar absolute top-0 bottom-0 left-0 -z-1"></div>
    <div class="poll-result__answer">{{answer}}</div>
    <div class="poll-result__values">
      <span class="poll-result__percentage">{{percentageRef.toFixed(0)}}%</span>
      <span class="poll-result__count">{{count}}</span>
    </div>
  </li>
</template>

<style scoped>
  .poll-result::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    @apply bg-gray-200;
  }

  .poll-result__bar {
    @apply bg-gray-400;
  }

  .poll-result__count::before {
    content: '('
  }

  .poll-result__count::after {
    content: ')'
  }
</style>
