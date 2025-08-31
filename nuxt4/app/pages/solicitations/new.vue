<template>
  <SolicitationForm show :show-go-back="false" />
</template>

<script setup lang="ts">
const sistemParametersStore = useSystemParametersStore();

onMounted(async () => {
  await sistemParametersStore.index();
});
</script>
