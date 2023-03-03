<script lang="ts" setup>
import { PollResultsProp } from "../types/Poll";

import PollContainer from "./PollContainer.vue";
import PollProvider from "./PollProvider.vue";

const props = defineProps<{
  answers?: string[];
  clearable?: boolean;
  controlled?: boolean;
  editable?: boolean;
  id?: string;
  multiple?: boolean;
  question: string;
  reopenable?: boolean;
  results?: PollResultsProp;
}>();
const { id, ...otherProps } = props;
</script>

<template>
  <div class="poll border-1 border-gray-500 p-4 mt-4 mb-4">
    <PollProvider :id="id">
      <PollContainer v-bind="otherProps">
        <slot />
      </PollContainer>
    </PollProvider>
  </div>
</template>
