<template>
  <PatientTable />
  <DialogLoading :dialog="loading" />
</template>
<script setup lang="ts">
const itemStore = usePatientStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await itemStore.index("");
  } finally {
    loading.value = false;
  }
});

//await useAsyncData(async () => await itemStore.index(""));
</script>
