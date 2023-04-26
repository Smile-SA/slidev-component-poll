<script lang="ts" setup>

import { DisplayResultsProp, ShowResultsProp } from "../types/Poll.ts";

import PollContainer from "./PollContainer.vue";
import PollProvider from "./PollProvider.vue";

const props = defineProps<{
  answers?: string[];
  clearable?: boolean;
  controlled?: boolean;
  correctAnswer?: string | number | number[];
  displayResults?: DisplayResultsProp;
  editable?: boolean;
  id?: string;
  multiple?: boolean;
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
