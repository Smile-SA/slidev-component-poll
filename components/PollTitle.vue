<script setup lang="ts">

defineProps<{
  question: string
}>();
</script>

<template>
  <div class="poll-title text-xl mb-1">{{question}}</div>
</template>
