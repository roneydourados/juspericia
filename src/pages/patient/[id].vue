<template>
  <PatientInfo />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const itemStore = usePatientStore();
const route = useRoute();
const id = String(route.params.id);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await itemStore.show(id);
  } finally {
    loading.value = false;
  }
});

//await useAsyncData(async () => await itemStore.show(id));
</script>
