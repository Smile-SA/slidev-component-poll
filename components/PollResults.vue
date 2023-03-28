<script lang="ts" setup>
import { inject, ref } from "vue";

import { idContext } from "../constants/context";
import { canUseControls } from "../services/helper";
import { pollState } from "../services/state";
import { DisplayResultsProp } from "../types/Poll";
import { PollStatus } from "../types/PollStatus";

import PollResultsPoll from "./PollResultsPoll.vue";
import PollResultsQuiz from "./PollResultsQuiz.vue";

withDefaults(
  defineProps<{
    answers?: string[];
    controlled?: boolean;
    correctAnswer?: string | number | number[];
    displayResults?: DisplayResultsProp;
    multiple?: boolean;
  }>(),
  { displayResults: "quiz" }
);
const id = inject(idContext, ref(""));
</script>

<template>
  <template v-if="pollState && pollState[id]">
    <template
      v-if="
        !controlled ||
        pollState[id].status === PollStatus.CLOSED ||
        canUseControls
      "
    >
      <PollResultsPoll
        v-if="displayResults === 'poll'"
        :controlled="controlled"
        :correctAnswer="correctAnswer"
      />
      <PollResultsQuiz
        v-else-if="displayResults === 'quiz' || displayResults === 'publicQuiz'"
        :answers="answers"
        :controlled="controlled"
        :correctAnswer="correctAnswer"
        :multiple="multiple"
        :public="displayResults === 'publicQuiz'"
      />
    </template>
    <template v-else>
      <p>Your answer has been submitted.</p>
      <p>Waiting for the poll to be closed...</p>
    </template>
  </template>
</template>
