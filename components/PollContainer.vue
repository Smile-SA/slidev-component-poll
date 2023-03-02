<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import { isPresenter } from "@slidev/client/logic/nav";

import { useAnswers } from "../composables/useAnswers";
import { idContext } from "../constants/context";
import {
  hasControlAccess,
  hasResult,
  isPrivateRemoteEnabled,
} from "../services/helper";
import { state, uid } from "../services/state";

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
}>();
const { answers, controlled = false } = props;
const id = inject(idContext, ref(''));

const showResults = ref(hasResult(id.value));
const hasAccess = hasControlAccess();
const isPrivate = isPrivateRemoteEnabled();
const showControls = computed(
  () => controlled && hasAccess && (isPrivate || isPresenter.value)
);
useAnswers(answers);

function toggleResults() {
  showResults.value = !showResults.value;
}

// show results when user submit a value
watch(
  () => state[id.value]?.results[uid.value],
  () => {
    if (hasResult(id.value)) {
      showResults.value = true;
    }
  }
);

// display results if user has already submitted a value (initialization)
watch(id, () => {
  showResults.value = hasResult(id.value);
});
</script>

<template>
  <div class="poll__header flex justify-between">
    <PollTitle :id="id" :question="question" />
    <button
      v-if="editable || !hasResult(id)"
      v-show="!showControls"
      @click="toggleResults"
      class="poll__button underline"
    >
      {{ showResults ? "Show poll" : "Show results" }}
    </button>
  </div>
  <PollQuestion
    v-if="!showResults"
    v-show="!showControls"
    :answers="answers"
    :controlled="controlled"
    :editable="editable"
    :id="id"
    :multiple="multiple"
  >
    <slot />
  </PollQuestion>
  <PollResults v-if="showResults || showControls" :id="id" />
  <PollControl
    v-if="showControls"
    :clearable="clearable"
    :id="id"
    :reopenable="reopenable"
  />
</template>
