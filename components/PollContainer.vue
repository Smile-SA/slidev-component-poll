<script lang="ts" setup>
import { computed, inject, onMounted, ref, watch } from "vue";

import { useAnswers } from "../composables/useAnswers.ts";
import { idContext } from "../constants/context.ts";
import { canUseControls } from "../services/helper.ts";
import { initPoll } from "../services/methods.ts";
import { pollState } from "../services/state.ts";
import { deviceId } from "../services/user.ts";
import { DisplayResultsProp, ShowResultsProp } from "../types/Poll.ts";

import PollControl from "./PollControl.vue";
import PollQuestion from "./PollQuestion.vue";
import PollResults from "./PollResults.vue";
import PollTitle from "./PollTitle.vue";

const props = withDefaults(
  defineProps<{
    answers?: string[];
    clearable?: boolean;
    controlled?: boolean;
    correctAnswer?: string | number | number[];
    displayResults?: DisplayResultsProp;
    editable?: boolean;
    multiple?: boolean;
    question: string;
    reOpenable?: boolean;
    showResults?: ShowResultsProp;
  }>(),
  { displayResults: "quiz", controlled: false, showResults: "auto" }
);
const id = inject(idContext, ref(""));

const showControls = computed(() => props.controlled && canUseControls.value);
const hasResult = computed(
  () => pollState[id.value]?.results[deviceId.value] !== undefined
);
const canShowResults = ref(
  canUseControls.value || (hasResult.value && props.showResults !== "none")
);
const showPollButton = computed(() => canUseControls.value || props.editable);
const showResultsButton = computed(
  () =>
    canUseControls.value ||
    props.showResults === "free" ||
    (props.showResults === "auto" && hasResult.value)
);
useAnswers(props.answers);

function toggleResults() {
  canShowResults.value = !canShowResults.value;
}

// Show results when user submit a value
watch(
  () => pollState[id.value]?.results[deviceId.value],
  () => {
    if (hasResult.value && props.showResults !== "none") {
      canShowResults.value = true;
    }
  }
);

// Reset canShowResults when poll results are reset
watch(
  hasResult,
  (newValue, oldValue) => {
    if (!newValue && oldValue) {
      if (!canUseControls.value && canShowResults.value) {
        canShowResults.value = false;
      }
    }
  }
);

onMounted(() => {
  if (!pollState[id.value]) {
    initPoll(id.value);
  }
});
</script>

<template>
  <div class="poll__header flex justify-between">
    <PollTitle :question="question" />
    <button
      v-if="showPollButton"
      v-show="canShowResults"
      @click="toggleResults"
      class="poll__button underline"
    >
      Show poll
    </button>
    <button
      v-if="showResultsButton"
      v-show="!canShowResults"
      @click="toggleResults"
      class="poll__button underline"
    >
      Show results
    </button>
  </div>
  <PollQuestion
    v-if="!canShowResults"
    :answers="answers"
    :controlled="controlled"
    :editable="editable"
    :multiple="multiple"
  >
    <slot />
  </PollQuestion>
  <PollResults
    v-if="canShowResults"
    :answers="answers"
    :controlled="controlled"
    :correctAnswer="correctAnswer"
    :displayResults="displayResults"
    :multiple="multiple"
  />
  <PollControl
    v-if="showControls"
    :clearable="clearable"
    :reOpenable="reOpenable"
  />
</template>
