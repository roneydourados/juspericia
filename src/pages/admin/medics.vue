<template>
  <MedicAbas />
</template>

<script setup lang="ts">
const medicStore = useMedicStore();

onMounted(async () => {
  await medicStore.index("");
});
//await useAsyncData(async () => await medicStore.index(""));
</script>
