<template>
  <PatientInfo />
</template>

<script setup lang="ts">
const itemStore = usePatientStore();
const route = useRoute();
const id = String(route.params.id);

await useAsyncData(async () => await itemStore.show(id));
</script>
