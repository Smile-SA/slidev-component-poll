<script lang="ts" setup>
import { inject, ref } from "vue";
import { useNav } from "@slidev/client";

import { idContext } from "../constants";
import { hasControlAccess, pollState, resetPoll, setPollStatus } from "../services";
import { PollStatus } from "../types";

const props = defineProps<{
  clearable?: boolean;
  presenterOnly?: boolean;
  reOpenable?: boolean;
}>();

const { isPresenter } = useNav();

const id = inject(idContext, ref(""));
const hasAccess = hasControlAccess();

function open() {
  setPollStatus(id.value, PollStatus.OPEN);
}

function close() {
  setPollStatus(id.value, PollStatus.CLOSED);
}

function clear() {
  resetPoll(id.value);
}
</script>

<template>
  <div
    v-if="pollState[id] && hasAccess && (!presenterOnly || isPresenter)"
    class="poll-control"
  >
    <button
      v-if="
        pollState[id].status === PollStatus.CLEAR ||
        (pollState[id].status === PollStatus.CLOSED && reOpenable)
      "
      @click="open"
      class="poll-control__button p-1"
    >
      Open poll
    </button>
    <button
      v-if="pollState[id].status === PollStatus.OPEN"
      @click="close"
      class="poll-control__button p-1"
    >
      Close poll
    </button>
    <button
      v-if="pollState[id].status === PollStatus.CLOSED && clearable"
      @click="clear"
      class="poll-control__button p-1"
    >
      Clear poll
    </button>
  </div>
</template>

<style scoped>
.poll-control__button {
  @apply bg-gray-200;
}

.dark .poll-control__button {
  @apply bg-gray-800;
}

.poll-control__button:hover {
  @apply bg-gray-400;
}

.dark .poll-control__button:hover {
  @apply bg-gray-600;
}
</style>
