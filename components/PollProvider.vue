<script lang="ts" setup>
import { provide, ref } from 'vue';

import { useId } from "../composables/useId";
import { answersContext, idContext } from '../constants/context';

let elementRef, id;
if (!id) {
  ({ elementRef, id } = useId());
}

const answers = ref([])

function setAnswers(newAnswers) {
  answers.value = newAnswers;
}

provide(idContext, id);
provide(answersContext, { answers, setAnswers });
</script>

<template>
  <div ref="elementRef">
    <slot v-if="id"/>
  </div>
</template>
