<script lang="ts" setup>
import { configs } from "@slidev/client";
import { computed, inject, ref } from "vue";

import { idContext } from "../constants";
import {
  canUseControls,
  deviceId,
  entriesIsValid,
  indexMatchResult,
  pollState,
  userState,
} from "../services";
import { CorrectAnswer, DisplayAnswersProp, PollStatus } from "../types";

import PollInput from "./PollInput.vue";

const props = withDefaults(
  defineProps<{
    controlled?: boolean;
    correctAnswer?: CorrectAnswer;
    displayAnswers: DisplayAnswersProp;
    index: number;
    multiple?: boolean;
    public?: boolean;
  }>(),
  { displayAnswers: "mcq" },
);
const id = inject(idContext, ref(""));

const result = computed(() => pollState[id.value].results[deviceId.value]);
const results = computed(() => Object.entries(pollState[id.value]?.results));
const users = computed(() =>
  results.value
    .filter(([, result]) => indexMatchResult(props.index, result))
    .map(([deviceId]) => userState[deviceId])
    .join(", "),
);
const isCorrect = computed(
  () =>
    indexMatchResult(props.index, props.correctAnswer) &&
    props.displayAnswers !== "brier",
);
const downplayed = computed(() => {
  if (
    (!props.controlled || pollState[id.value].status === PollStatus.CLOSED) &&
    props.displayAnswers !== "brier"
  ) {
    if (props.correctAnswer !== undefined) {
      return !isCorrect.value;
    }
  }
  return false;
});
const userPercentage = computed(
  () => (result.value instanceof Object && result.value[props.index]) ?? 0,
);
const correctPercentage = computed(() =>
  props.correctAnswer instanceof Array
    ? Number(props.correctAnswer.includes(props.index))
    : props.correctAnswer instanceof Object
      ? props.correctAnswer[props.index]
      : Number(Number(props.correctAnswer) === props.index),
);
const answers = computed(() =>
  results.value.filter(entriesIsValid(props.index)),
);
const averagePercentage = computed(() =>
  answers.value.length === 0
    ? 0
    : answers.value.reduce((acc, [, result]) => acc + result[props.index], 0) /
      answers.value.length,
);
const standardDeviation = computed(() =>
  answers.value.length === 0
    ? 0
    : Math.sqrt(
        answers.value.reduce(
          (acc, [, result]) =>
            acc + (result[props.index] - averagePercentage.value) ** 2,
          0,
        ) / answers.value.length,
      ),
);
</script>

<template>
  <li
    class="poll-result"
    :class="{
      '!border-green-500': isCorrect,
      'opacity-50': downplayed,
      'poll-result--bar': props.displayAnswers === 'brier',
    }"
  >
    <template v-if="props.displayAnswers === 'brier'">
      <div
        v-if="userPercentage !== false"
        :style="{ width: `${userPercentage}%` }"
        class="poll-result__bar absolute top-0 bottom-0 left-0"
      ></div>
      <div
        v-if="correctPercentage != null"
        :style="{ width: `${correctPercentage * 100}%` }"
        class="poll-result__goal absolute top-0 bottom-0 left-0 border-solid border-r-2 border-green-600"
      ></div>
      <div
        v-if="canUseControls || public"
        :style="{
          left: `${averagePercentage}%`,
          width: `${standardDeviation * 2}%`,
        }"
        class="poll-result__average absolute h-4 border-solid border-l-2 border-r-2 -translate-x-2/4"
      ></div>
    </template>
    <PollInput
      v-if="!canUseControls && displayAnswers !== 'brier'"
      :disabled="true"
      :displayAnswers="displayAnswers"
      :index="index"
      :multiple="multiple"
      :result="result"
    />
    <div class="poll-result__answer z-0">
      <slot />
    </div>
    <div
      v-if="
        (canUseControls || public) &&
        !configs.pollSettings?.anonymous &&
        props.displayAnswers !== 'brier'
      "
      class="flex-1"
    >
      {{ users }}
    </div>
    <div
      v-if="props.displayAnswers === 'brier'"
      class="poll-result__values z-0"
    >
      <span v-if="userPercentage !== false" class="poll-result__percentage"
        >{{ userPercentage }}% /
      </span>
      <span class="poll-result__estimate">{{
        correctPercentage === null ? "NA" : `${correctPercentage * 100}%`
      }}</span>
    </div>
  </li>
</template>

<style scoped>
.poll-result__average {
  border-color: black;
}

.dark .poll-result__average {
  border-color: white;
}

.poll-result__average:before {
  content: "";
  position: absolute;
  height: 2px;
  top: 50%;
  width: 100%;
  background-color: black;
  translate: 0 -1px;
}

.poll-result__average:after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  background-color: black;
  width: 0.5em;
  height: 0.5em;
  border-radius: 0.25em;
  translate: -50% -50%;
}

.dark .poll-result__average:before {
  background-color: white;
}

.dark .poll-result__average:after {
  background-color: white;
}
</style>
