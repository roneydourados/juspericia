<template>
  <Parameters />
</template>

<script setup lang="ts">
const systemParametersStore = useSystemParametersStore();

onMounted(async () => {
  await systemParametersStore.index();
});
//await useAsyncData(async () => await systemParametersStore.index());
</script>
