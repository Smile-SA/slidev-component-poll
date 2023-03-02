<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import VerticalDivider from "@slidev/client/internals/VerticalDivider.vue";

import { ConnectionStatus } from "../enums/ConnectionStatus";
import { autoConnect, connect, connectState, groupId } from "../services/state";

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
    return "Connect with poll WebSocket server";
  }
});
const hasWebSocketError = computed(
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
  connect();
  isOpen.value = false;
}

const oneDay = 1000 * 60 * 60 * 24;
onMounted(() => {
  if (
    autoConnect.value &&
    new Date().getTime() - new Date(autoConnect.value).getTime() < oneDay
  ) {
    connect();
  }
});
</script>

<template>
  <VerticalDivider />
  <button class="slidev-icon-btn" @click="isOpen = !isOpen" :title="title">
    <carbon:wifi-bridge-alt
      :class="{
        'text-red-500': hasWebSocketError,
        'text-green-500': connectState === ConnectionStatus.CONNECTED,
      }"
    />
  </button>
  <form
    v-if="!hasWebSocketError"
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
