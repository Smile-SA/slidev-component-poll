<script setup lang="ts">
import { inject, ref } from "vue";
import { isPresenter } from "@slidev/client/logic/nav";

import { idContext } from "../constants/context";
import { hasControlAccess } from "../services/helper";
import { resetPoll, setPollStatus, state } from "../services/state";
import { PollStatus } from "../types/PollStatus";

const props = defineProps<{
  clearable?: boolean;
  presenterOnly?: boolean;
  reopenable?: boolean;
}>();
const id = inject(idContext, ref(''));
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
    v-if="state[id] && hasAccess && (!presenterOnly || isPresenter)"
    class="poll-control"
  >
    <button
      v-if="
        state[id].status === PollStatus.CLEAR ||
        (state[id].status === PollStatus.CLOSED && reopenable)
      "
      @click="open"
      class="poll-control__button p-1"
    >
      Open poll
    </button>
    <button
      v-if="state[id].status === PollStatus.OPEN"
      @click="close"
      class="poll-control__button p-1"
    >
      Close poll
    </button>
    <button
      v-if="state[id].status === PollStatus.CLOSED && clearable"
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
