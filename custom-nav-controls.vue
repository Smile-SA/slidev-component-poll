<script lang="ts" setup>
import { configs } from "@slidev/client/env";
</script>

<template>
  <PollConnect v-if="configs.pollSettings?.server" />
</template>
