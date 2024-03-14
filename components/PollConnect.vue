<script lang="ts" setup>
import { configs } from "@slidev/client";
import { computed, onMounted, ref, watch } from "vue";
import VerticalDivider from "@slidev/client/internals/VerticalDivider.vue";

import { connectPoll } from "../services/methods.ts";
import { autoConnect, connectState, groupId } from "../services/server.ts";
import { ConnectionStatus } from "../types/ConnectionStatus.ts";

const input = ref<HTMLInputElement>();
const isOpen = ref(false);
const title = computed(() => {
  if (connectState.value === ConnectionStatus.DISCONNECTED) {
    return "Disconnected";
  } else if (connectState.value === ConnectionStatus.ERROR) {
    return "Server unreachable";
  } else if (connectState.value === ConnectionStatus.CONNECTED) {
    return "Connected";
  } else {
    return "Connect with poll server";
  }
});
const hasConnectionError = computed(
  () =>
    connectState.value === ConnectionStatus.DISCONNECTED ||
    connectState.value === ConnectionStatus.ERROR
);

watch(isOpen, () => {
  if (isOpen.value) {
    input.value?.focus();
  }
});

function submit() {
  connectPoll();
  isOpen.value = false;
}

const oneDay = 1000 * 60 * 60 * 24;
onMounted(() => {
  if (configs.pollSettings?.autoConnect) {
    console.log(configs.pollSettings?.autoConnect);
    if (
      configs.pollSettings?.autoConnect === true ||
      (autoConnect.value &&
        new Date().getTime() - new Date(autoConnect.value).getTime() <
          configs.pollSettings?.autoConnect * 1000)
    ) {
      connectPoll();
    }
  }
});
</script>

<template>
  <VerticalDivider />
  <button class="slidev-icon-btn" @click="isOpen = !isOpen" :title="title">
    <carbon:wifi-bridge-alt
      :class="{
        'text-red-500': hasConnectionError,
        'text-green-500': connectState === ConnectionStatus.CONNECTED,
      }"
    />
  </button>
  <form
    v-if="!hasConnectionError"
    class="flex align-center py-2"
    @submit.prevent="submit"
  >
    <input
      border="~ transparent rounded gray-400 opacity-25"
      class="px-2 text-sm transition-all bg-main"
      placeholder="Type in ID to create or join"
      ref="input"
      :style="{
        width: isOpen ? '200px' : 0,
        padding: isOpen ? undefined : 0,
        border: isOpen ? undefined : 0,
      }"
      v-model="groupId"
    />
  </form>
</template>
