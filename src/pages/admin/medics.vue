<template>
  <MedicAbas />
</template>

<script setup lang="ts">
const medicStore = useMedicStore();
await useAsyncData(async () => await medicStore.index(""));
</script>
