<template>
  <PatientInfo />
</template>

<script setup lang="ts">
const itemStore = usePatientStore();
const route = useRoute();
const id = route.params.id;

await useAsyncData(async () => await itemStore.show(id[0]));
</script>
