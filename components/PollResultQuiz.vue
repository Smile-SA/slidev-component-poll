<script lang="ts" setup>
import { configs } from "@slidev/client/env.ts";
import { computed, inject, ref } from "vue";

import { idContext } from "../constants/context";
import {
  canUseControls,
  getDefaultValue,
  indexMatchResult,
} from "../services/helper";
import { pollState, userState } from "../services/state";
import { deviceId } from "../services/user";
import { PollStatus } from "../types/PollStatus";

const props = defineProps<{
  controlled?: boolean;
  correctAnswer?: string | number | number[];
  index: number;
  multiple?: boolean;
  public?: boolean;
}>();
const id = inject(idContext, ref(""));

const hasResult = computed(
  () => pollState[id.value]?.results[deviceId.value] !== undefined
);
const users = computed(() =>
  Object.entries(pollState[id.value]?.results)
    .filter(([, result]) => indexMatchResult(props.index, result))
    .map(([deviceId]) => userState[deviceId])
    .join(", ")
);
const isCorrect = computed(() =>
  indexMatchResult(props.index, props.correctAnswer)
);
const downplayed = computed(() => {
  if (!props.controlled || pollState[id.value].status === PollStatus.CLOSED) {
    if (props.correctAnswer !== undefined) {
      return !isCorrect.value;
    }
  }
  return false;
});
</script>

<template>
  <li
    class="list-none !m-0 !p-1 !leading-6 border-1 border-transparent rounded"
    :class="{
      '!border-green-500': isCorrect,
      'opacity-50': downplayed,
    }"
  >
    <div class="flex items-center gap-2">
      <input
        v-if="!canUseControls"
        :type="multiple ? 'checkbox' : 'radio'"
        :checked="getDefaultValue(id, hasResult, multiple) === index"
        class="mr-1"
        disabled
      />
      <div class="flex-1">
        <slot />
      </div>
      <div
        v-if="(canUseControls || public) && !configs.pollSettings?.anonymous"
        class="flex-1"
      >
        {{ users }}
      </div>
    </div>
  </li>
</template>
