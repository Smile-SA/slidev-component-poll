<script lang="ts" setup>

import type { CorrectAnswer, DisplayAnswersProp, ShowResultsProp } from "../types";

import PollContainer from "./PollContainer.vue";
import PollProvider from "./PollProvider.vue";

const props = defineProps<{
  answers?: string[];
  clearable?: boolean;
  controlled?: boolean;
  correctAnswer?: CorrectAnswer;
  displayAnswers?: DisplayAnswersProp;
  editable?: boolean;
  id?: string;
  multiple?: boolean;
  public?: boolean;
  question: string;
  reOpenable?: boolean;
  showResults?: ShowResultsProp;
}>();
const { id, ...otherProps } = props;
</script>

<template>
  <div class="poll border-1 border-gray-500 rounded p-4 mt-4 mb-4">
    <PollProvider :id="id">
      <PollContainer v-bind="otherProps">
        <slot />
      </PollContainer>
    </PollProvider>
  </div>
</template>
