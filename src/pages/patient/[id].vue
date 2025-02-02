<template>
  <PatientInfo />
</template>

<script setup lang="ts">
const itemStore = usePatientStore();
const route = useRoute();
const id = String(route.params.id);

onMounted(async () => {
  await itemStore.show(id);
});

//await useAsyncData(async () => await itemStore.show(id));
</script>
