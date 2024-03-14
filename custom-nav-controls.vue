<script lang="ts" setup>
import { configs } from "@slidev/client";
</script>

<template>
  <PollConnect v-if="configs.pollSettings?.server" />
</template>
