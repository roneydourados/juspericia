<template>
  <MedicTable />
</template>

<script setup lang="ts">
const medicStore = useMedicStore();
await useAsyncData(async () => await medicStore.index(""));
</script>
