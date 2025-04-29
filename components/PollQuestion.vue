<script lang="ts" setup>
import { configs } from "@slidev/client";
import { computed, inject, isVNode, ref } from "vue";

import { useAnswers } from "../composables/useAnswers";
import { idContext } from "../constants";
import {
  answerPoll,
  deviceId,
  getBrierMaxPoints,
  getDefaultValue,
  pollState,
  userId,
} from "../services";
import type { CorrectAnswer, DisplayAnswersProp, Result } from "../types";
import { PollStatus } from "../types";

import PollUser from "./PollUser.vue";
import PollInput from "./PollInput.vue";

const props = withDefaults(
  defineProps<{
    answers?: string[];
    controlled?: boolean;
    correctAnswer?: CorrectAnswer;
    displayAnswers: DisplayAnswersProp;
    editable?: boolean;
    multiple?: boolean;
  }>(),
  { displayAnswers: "mcq", editable: false, multiple: false }
);
const id = inject(idContext, ref(""));

const renderAnswers = useAnswers(props.answers);
const hasResult = computed(
  () => pollState[id.value]?.results[deviceId.value] !== undefined
);
const result = ref<null | Result>(
  getDefaultValue(
    id.value,
    hasResult.value,
    props.multiple,
    props.displayAnswers
  )
);

const pointsToAttribute = computed(() => getBrierMaxPoints(props.correctAnswer));
const allocatedPoints = computed(() => {
  if (result.value instanceof Array) {
    return result.value.length * 100;
  }
  if (result.value instanceof Object) {
    return Object.values(result.value)
      .filter((value) => value != null)
      .reduce((a, b) => a + b, 0);
  }
  return Number(result.value) * 100;
});
const remainingPointsToAttribute = computed(() => {
  return pointsToAttribute.value - allocatedPoints.value;
});

function handleSubmit() {
  answerPoll(id.value, result.value);
}

function handleChange(value: Result) {
  result.value = value;
}
</script>

<template>
  <template v-if="configs.pollSettings?.anonymous || userId">
    <div v-if="pollState && pollState[id]" class="poll-question">
      <form
        v-if="
          (!controlled || pollState[id].status === PollStatus.OPEN) &&
          (editable || !hasResult)
        "
        @submit.prevent="handleSubmit"
        class="poll-question__form"
      >
        <div v-if="displayAnswers === 'brier'">
          {{ remainingPointsToAttribute }} points to attribute
        </div>
        <ul class="poll-question__list mb-2">
          <li
            v-for="(answer, index) in renderAnswers"
            class="poll-question__item list-none flex items-center !m-0 !p-1 !leading-6 border-1 border-transparent"
          >
            <label class="poll-question__item-label flex w-full">
              <PollInput
                :displayAnswers="displayAnswers"
                :index="index"
                :multiple="multiple"
                :result="result"
                @change="handleChange"
              />
              <div class="poll-question__item-text flex-1">
                <component v-if="isVNode(answer)" :is="answer" />
                <div v-else>{{ answer }}</div>
              </div>
            </label>
          </li>
        </ul>
        <input
          :disabled="
            displayAnswers === 'brier' && remainingPointsToAttribute !== 0
          "
          type="submit"
          class="poll-question__input p-1"
        />
      </form>
      <div
        v-else-if="controlled && pollState[id].status === PollStatus.CLEAR"
        class="poll-question__clear"
      >
        The poll is not open
      </div>
      <div
        v-else-if="controlled && pollState[id].status === PollStatus.CLOSED"
        class="poll-question__closed"
      >
        The poll is closed
      </div>
      <div
        v-else-if="!editable && pollState[id]?.results[deviceId] !== undefined"
        class="poll-question__voted"
      >
        Voted!
      </div>
    </div>
  </template>
  <PollUser v-else />
</template>

<style scoped>
.poll-question {
  --slidev-code-margin: 0;
  --prism-block-margin-y: 0;
}

.poll-question__input {
  @apply bg-gray-200;
}

.dark .poll-question__input {
  @apply bg-gray-800;
}

.poll-question__input:not(:disabled):hover {
  @apply bg-gray-400;
}

.dark .poll-question__input:not(:disabled):hover {
  @apply bg-gray-600;
}

.poll-question__input:disabled {
  @apply text-gray-400;
}

.dark .poll-question__input:disabled {
  @apply text-gray-600;
}
</style>

<style>
.poll-question .poll-question__item-text > p {
  margin: 0;
}
</style>
