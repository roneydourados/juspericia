<template>
  <PatientTable />
</template>
<script setup lang="ts">
const itemStore = usePatientStore();

onMounted(async () => {
  await itemStore.index("");
});

//await useAsyncData(async () => await itemStore.index(""));
</script>
