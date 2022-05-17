<script setup lang="ts">
import { isPresenter } from '@slidev/client/logic/nav';

import { hasControlAccess } from './helper';
import { state } from "./state";
import { PollStatus } from "./types";

const props = defineProps<{
  clearable?: boolean
  id: string
  presenterOnly?: boolean
  reopenable?: boolean
}>();
const { id } = props;
const hasAccess = hasControlAccess();

function open() {
  state[id].status = PollStatus.OPEN;
}

function close() {
  state[id].status = PollStatus.CLOSED;
}

function clear() {
  state[id].results = {};
  state[id].status = PollStatus.CLEAR;
}
</script>

<template>
  <div v-if="state[id] && hasAccess && (!presenterOnly || isPresenter)" class="poll-control">
    <button
      v-if="state[id].status === PollStatus.CLEAR || (state[id].status === PollStatus.CLOSED && reopenable)"
      @click="open"
      class="poll-control__button p-1"
    >Open poll</button>
    <button
      v-if="state[id].status === PollStatus.OPEN"
      @click="close"
      class="poll-control__button p-1"
    >Close poll</button>
    <button
      v-if="state[id].status === PollStatus.CLOSED && clearable"
      @click="clear"
      class="poll-control__button p-1"
    >Clear poll</button>
  </div>
</template>

<style scoped>
.poll-control__button {
  @apply bg-gray-200;
}

.poll-control__button:hover {
  @apply bg-gray-400;
}
</style>