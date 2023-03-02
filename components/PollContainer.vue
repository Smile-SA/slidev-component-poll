<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import { isPresenter } from "@slidev/client/logic/nav";

import { useAnswers } from "../composables/useAnswers";
import { idContext } from "../constants/context";
import {
  hasControlAccess,
  isPrivateRemoteEnabled,
} from "../services/helper";
import { state, uid } from "../services/state";
import { PollResultsProp } from "../types/Poll";

import PollControl from "./PollControl.vue";
import PollQuestion from "./PollQuestion.vue";
import PollResults from "./PollResults.vue";
import PollTitle from "./PollTitle.vue";

const props = defineProps<{
  answers?: string[];
  clearable?: boolean;
  controlled?: boolean;
  editable?: boolean;
  multiple?: boolean;
  question: string;
  reopenable?: boolean;
  results?: PollResultsProp;
}>();
const { answers, controlled = false, editable, results = "auto" } = props;
const id = inject(idContext, ref(""));

const canUseControls = computed(
  () => hasControlAccess() && (isPrivateRemoteEnabled() || isPresenter.value)
);
const showControls = computed(() => controlled && canUseControls.value);
const hasResult = computed(
  () => state[id.value]?.results[uid.value] !== undefined
);
const showResults = ref(
  showControls.value || (hasResult.value && results !== "none")
);
const showPollButton = computed(() => canUseControls || editable);
const showResultsButton = computed(
  () =>
    canUseControls ||
    results === "free" ||
    (results === "auto" && hasResult.value)
);
useAnswers(answers);

function toggleResults() {
  showResults.value = !showResults.value;
}

// show results when user submit a value
watch(
  () => state[id.value]?.results[uid.value],
  () => {
    if (hasResult.value && results !== "none") {
      showResults.value = true;
    }
  }
);
</script>

<template>
  <div class="poll__header flex justify-between">
    <PollTitle :id="id" :question="question" />
    <button
      v-if="showResults && showPollButton"
      @click="toggleResults"
      class="poll__button underline"
    >
      Show poll
    </button>
    <button
      v-if="!showResults && showResultsButton"
      @click="toggleResults"
      class="poll__button underline"
    >
      Show results
    </button>
  </div>
  <PollQuestion
    v-if="!showResults"
    :answers="answers"
    :controlled="controlled"
    :editable="editable"
    :id="id"
    :multiple="multiple"
  >
    <slot />
  </PollQuestion>
  <PollResults v-if="showResults" :id="id" />
  <PollControl
    v-if="showControls"
    :clearable="clearable"
    :id="id"
    :reopenable="reopenable"
  />
</template>
