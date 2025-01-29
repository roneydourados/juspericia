<template>
  <PatientTable />
</template>
<script setup lang="ts">
const itemStore = usePatientStore();
await useAsyncData(async () => await itemStore.index(""));
</script>
