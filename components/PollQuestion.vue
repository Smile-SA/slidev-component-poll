<script lang="ts" setup>
import { configs } from "@slidev/client";
import { computed, inject, isVNode, ref } from "vue";

import { useAnswers } from "../composables/useAnswers.ts";
import { idContext } from "../constants/context.ts";
import { getDefaultValue } from "../services/helper.ts";
import { answerPoll } from "../services/methods.ts";
import { pollState } from "../services/state.ts";
import { deviceId, userId } from "../services/user.ts";
import { Result } from "../types/Poll.ts";
import { PollStatus } from "../types/PollStatus.ts";

import PollUser from "./PollUser.vue";

const props = withDefaults(
  defineProps<{
    answers?: string[];
    controlled?: boolean;
    editable?: boolean;
    multiple?: boolean;
  }>(),
  { editable: false, multiple: false }
);
const id = inject(idContext, ref(""));

const renderAnswers = useAnswers(props.answers);
const hasResult = computed(
  () => pollState[id.value]?.results[deviceId.value] !== undefined
);
const chosenAnswer = ref<null | Result>(
  getDefaultValue(id.value, hasResult.value, props.multiple)
);

function handleSubmit() {
  answerPoll(id.value, chosenAnswer.value);
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
        <ul class="poll-question__list mb-2">
          <li
            v-for="(answer, index) in renderAnswers"
            class="poll-question__item list-none flex items-center !m-0 !p-1 !leading-6 border-1 border-transparent"
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
