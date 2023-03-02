<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { hasResult } from '../services/helper';
import { PollStatus } from "../enums/PollStatus";
import { answerPoll, initPoll, state, uid } from '../services/state';
import { Result } from '../interfaces/Poll';

const props = defineProps<{
  answers: string[]
  controlled?: boolean
  editable?: boolean
  id: string
  multiple?: boolean
}>();
const { answers, editable = false, id, multiple = false } = props;

const chosenAnswer = ref<null | Result>(getDefaultValue());

function getDefaultValue(): null | Result {
  const answer = state[id]?.results?.[uid.value];
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
  answerPoll(id, chosenAnswer.value)
}

onMounted(() =>  {
  if (!state[id]) {
    initPoll(id, answers);
  }
});
</script>

<template>
  <div v-if="state && state[id]" class="poll-question">
    <form
      v-if="(!controlled || state[id].status === PollStatus.OPEN) && (editable || !hasResult(id))"
      @submit.prevent="handleSubmit"
      class="poll-question__form"
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
  </div>
</template>

<style scoped>
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
