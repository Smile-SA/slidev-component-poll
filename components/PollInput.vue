<script setup lang="ts">
import { computed, inject, ref } from "vue";

import { idContext } from "../constants";
import type { DisplayAnswersProp, Result } from "../types";

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    displayAnswers: DisplayAnswersProp;
    index: number;
    multiple?: boolean;
    result: null | Result;
  }>(),
  { displayAnswers: "mcq", multiple: false }
);
const emits = defineEmits<{
  change: [value: Result];
}>();
const id = inject(idContext, ref(""));
const checked = computed(() => {
  if (props.result === null) {
    return false;
  } 
  if (props.result instanceof Array) {
    return props.result.includes(props.index);
  }
  // This case should never happen because it only is true when displayAnswers is "brier"
  if (props.result instanceof Object) {
    return props.result[props.index]!== undefined;
  }
  return props.result === props.index;
});

function handleChange(index: number) {
  if (props.multiple) {
    const result = !(props.result instanceof Array) ? [] : [...props.result];
    const answerIndex = result.indexOf(index);
    if (answerIndex === -1) {
      result.push(index);
      return emits("change", result);
    }
    result.splice(answerIndex, 1);
    return emits("change", result);
  }
  emits("change", index);
}

function handleBrierChange(index: number, e) {
  const value = Number(e.target.value);
  const result = !(props.result instanceof Object) ? {} : { ...props.result };
  result[index] = value;
  emits("change", result);
}
</script>

<template>
  <input
    v-if="displayAnswers === 'mcq'"
    :disabled="disabled"
    :type="multiple ? 'checkbox' : 'radio'"
    :value="index"
    :name="`question-${id}`"
    :checked="checked"
    @input="handleChange(index)"
    class="poll-input mr-1"
  />
  <div v-else class="flex items-center">
    <input
      type="range"
      :disabled="disabled"
      :value="result?.[index] ?? 0"
      @input="handleBrierChange(index, $event)"
      class="poll-range mr-1"
      min="0"
      max="100"
      step="1"
    />
    <input
      type="number"
      :disabled="disabled"
      :name="`question-${id}`"
      :value="result?.[index] ?? 0"
      @input="handleBrierChange(index, $event)"
      class="poll-input mr-1"
      min="0"
      max="100"
    />
  </div>
</template>
