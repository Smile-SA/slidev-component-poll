<script lang="ts" setup>
import { provide, ref } from "vue";

import { useId } from "../composables/useId";
import { answersContext, idContext } from "../constants/context";

const props = defineProps<{
  id?: string;
}>();

let id;
if (props.id) {
  id = ref(props.id);
} else if (!id) {
  ({ id } = useId());
}

const answers = ref([]);

function setAnswers(newAnswers) {
  answers.value = newAnswers;
}

provide(idContext, id);
provide(answersContext, { answers, setAnswers });
</script>

<template>
  <div>
    <slot v-if="id" />
  </div>
</template>
