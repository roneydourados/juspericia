<template>
  <ConsultationTable />
</template>

<script setup lang="ts">
const consutationStore = useConsultationStore();
await useAsyncData(async () => await consutationStore.index(""));
</script>
