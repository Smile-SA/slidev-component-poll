<script lang="ts" setup>
import { computed, ref } from "vue";

import { deviceId, loginPoll, userId, userState } from "../services";

const user = ref(userId.value);
const exist = computed(() =>
  Object.entries(userState)
    .filter(([did]) => deviceId.value !== did)
    .map(([, uid]) => uid)
    .includes(user.value)
);

function handleSubmit(event) {
  event.preventDefault();
  if (!exist.value) {
    loginPoll(user.value);
    userId.value = user.value;
  }
}
</script>

<template>
  <form @submit="handleSubmit">
    <label>
      Enter your name:
      <div class="mt-2">
        <input v-model="user" class="border-1 border-gray-500 rounded" />
        <span class="ml-2 text-red-400" v-if="exist">
          This name is already used
        </span>
      </div>
    </label>
    <div class="mt-3">
      <input class="primary p-1" type="submit" />
    </div>
  </form>
</template>
