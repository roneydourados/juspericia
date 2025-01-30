<template>
  <Parameters />
</template>

<script setup lang="ts">
const systemParametersStore = useSystemParametersStore();
await useAsyncData(async () => await systemParametersStore.index());
</script>
