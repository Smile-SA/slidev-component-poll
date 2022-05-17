<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import { hasResult } from './helper';
import { state, uid } from './state';
import { PollStatus } from './types';

const props = defineProps<{
  answers: string[]
  controlled?: boolean
  editable?: boolean
  id: string
  multiple?: BooleanConstructor
}>();
const { answers, editable = false, id, multiple = false } = props;

const chosenAnswer = ref<null | number | number[]>(getDefaultValue());

function getDefaultValue(): null | number | number[] {
  const answer =state[id]?.results?.[uid.value];
  if (hasResult(id)) {
    if (answer instanceof Array && multiple || typeof answer === 'number' && !multiple) {
      return answer;
    } else if (multiple && typeof answer === 'number') {
      return [answer];
    } else if (!multiple && answer instanceof Array) {
      return answer[0];
    }
  }
  return multiple ? [] as number[]: null
}

function handleSubmit() {
  const poll = state[id];
  if (poll && chosenAnswer.value !== null) {
    poll.results[uid.value] = chosenAnswer.value;
  }
}

watchEffect(() =>  {
  if (!state[id]) {
    state[id] = {
      answers,
      results: {},
      status: PollStatus.CLEAR
    };
  }
});
</script>

<template>
  <form
    v-if="(!controlled || (state[id] && state[id].status === PollStatus.OPEN)) && (editable || !hasResult(id))"
    @submit.prevent="handleSubmit"
    class="poll-question"
  >
    <ul class="poll-question__list">
      <li v-for="(answer, index) in answers" class="poll-question__item list-none flex items-center h-8 !m-0 !p-1">
        <label class="poll-question__item-label">
          <input
            :type="multiple ? 'checkbox' : 'radio'"
            :value="index"
            :name="`question-${id}`"
            v-model="chosenAnswer"
            class="poll-question__item-input"
          />
          {{answer}}
        </label>
      </li>
    </ul>
    <input type="submit" class="poll-question__input p-1"/>
  </form>
  <div v-else-if="controlled && state[id].status === PollStatus.CLEAR" class="poll-question__clear">The poll is not open</div>
  <div v-else-if="controlled && state[id].status === PollStatus.CLOSED" class="poll-question__closed">The poll is closed</div>
  <div v-else-if="!editable && state[id]?.results[uid] !== undefined" class="poll-question__voted">Voted!</div>
</template>

<style scoped>
.poll-question__input {
  @apply bg-gray-200;
}

.poll-question__input:hover {
  @apply bg-gray-400;
}
</style>
