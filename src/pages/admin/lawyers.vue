<template>
  <LawyerTable />
</template>

<script setup lang="ts">
const userLawyerStore = useUserLawyerStore();
await useAsyncData(async () => await userLawyerStore.index(""));
</script>
