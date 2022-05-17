<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { isPresenter } from '@slidev/client/logic/nav';

import { hasControlAccess, hasResult, isPrivateRemoteEnabled } from './helper';
import PollControl from './PollControl.vue';
import PollQuestion from './PollQuestion.vue';
import PollResults from './PollResults.vue';
import PollTitle from './PollTitle.vue';
import { state, uid } from './state';
import { useId } from './useId';

const props = defineProps<{
  answers: string[]
  clearable?: boolean
  controlled?: boolean
  editable?: boolean
  multiple?: BooleanConstructor
  question: string
  reopenable?: boolean
}>();
const { controlled = false } = props;
const { elementRef, id } = useId();
const showResults = ref(false);
const hasAccess = hasControlAccess();
const isPrivate = isPrivateRemoteEnabled();
const showControls = computed(() => controlled && hasAccess && (isPrivate || isPresenter))

function toggleResults() {
  showResults.value = !showResults.value;
}

// show results when user submit a value
watch(() => state[id.value]?.results[uid.value], () => {
  if (hasResult(id.value)) {
    showResults.value = true;
  }
})

// display results if user has already submitted a value (initialization)
watch(id, () => {
  showResults.value = hasResult(id.value);
})
</script>

<template>
  <div ref="elementRef" class="poll border-1 border-gray-500 p-4 mt-4 mb-4">
    <template v-if="id">
      <div class="poll__header flex justify-between">
        <PollTitle :id="id" :question="question" />
        <button
          v-if="editable || !hasResult(id)"
          v-show="!showControls.value"
          @click="toggleResults"
          class="poll__button underline"
        >{{ showResults ? 'Show poll' : 'Show results' }}</button>
      </div>
      <PollQuestion
        v-if="!showResults"
        v-show="!showControls.value"
        :answers="answers"
        :controlled="controlled"
        :editable="editable"
        :id="id"
        :multiple="multiple"
      />
      <PollResults
        v-if="showResults || showControls.value"
        :id="id"
      />
      <PollControl
        v-if="showControls.value"
        :clearable="clearable"
        :id="id"
        :reopenable="reopenable"
      />
    </template>
  </div>
</template>
