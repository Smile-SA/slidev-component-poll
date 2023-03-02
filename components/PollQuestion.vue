<script lang="ts" setup>
import { computed, inject, isVNode, onMounted, ref } from "vue";

import { useAnswers } from "../composables/useAnswers";
import { idContext } from "../constants/context";
import { answerPoll, initPoll, state, uid } from "../services/state";
import { Result } from "../types/Poll";
import { PollStatus } from "../types/PollStatus";

const props = defineProps<{
  answers?: string[];
  controlled?: boolean;
  editable?: boolean;
  multiple?: boolean;
}>();
const { answers, editable = false, multiple = false } = props;
const id = inject(idContext, ref(''));

const renderAnswers = useAnswers(answers);
const hasResult = computed(
  () => state[id.value]?.results[uid.value] !== undefined
);
const chosenAnswer = ref<null | Result>(getDefaultValue());

function getDefaultValue(): null | Result {
  const answer = state[id.value]?.results?.[uid.value];
  if (hasResult.value) {
    if (
      (answer instanceof Array && multiple) ||
      (typeof answer === "number" && !multiple)
    ) {
      return answer;
    } else if (multiple && typeof answer === "number") {
      return [answer];
    } else if (!multiple && answer instanceof Array) {
      return answer[0];
    }
  }
  return multiple ? ([] as number[]) : null;
}

function handleSubmit() {
  answerPoll(id.value, chosenAnswer.value);
}

onMounted(() => {
  if (!state[id.value]) {
    initPoll(id.value);
  }
});
</script>

<template>
  <div v-if="state && state[id]" class="poll-question">
    <form
      v-if="
        (!controlled || state[id].status === PollStatus.OPEN) &&
        (editable || !hasResult)
      "
      @submit.prevent="handleSubmit"
      class="poll-question__form"
    >
      <ul class="poll-question__list mb-2">
        <li
          v-for="(answer, index) in renderAnswers"
          class="poll-question__item list-none flex items-center !m-0 !p-1 !leading-6"
        >
          <label class="poll-question__item-label flex w-full">
            <input
              :type="multiple ? 'checkbox' : 'radio'"
              :value="index"
              :name="`question-${id}`"
              v-model="chosenAnswer"
              class="poll-question__item-input mr-1"
            />
            <div class="poll-question__item-text flex-1">
              <component v-if="isVNode(answer)" :is="answer" />
              <div v-else>{{ answer }}</div>
            </div>
          </label>
        </li>
      </ul>
      <input type="submit" class="poll-question__input p-1" />
    </form>
    <div
      v-else-if="controlled && state[id].status === PollStatus.CLEAR"
      class="poll-question__clear"
    >
      The poll is not open
    </div>
    <div
      v-else-if="controlled && state[id].status === PollStatus.CLOSED"
      class="poll-question__closed"
    >
      The poll is closed
    </div>
    <div
      v-else-if="!editable && state[id]?.results[uid] !== undefined"
      class="poll-question__voted"
    >
      Voted!
    </div>
  </div>
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

.poll-question__input:hover {
  @apply bg-gray-400;
}

.dark .poll-question__input:hover {
  @apply bg-gray-600;
}
</style>

<style>
.poll-question .poll-question__item-text > p {
  margin: 0;
}
</style>
