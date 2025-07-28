<template>
  <ConsultationTable />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const consutationStore = useConsultationStore();
const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    await consutationStore.index("");
  } finally {
    loading.value = false;
  }
});
//await useAsyncData(async () => await consutationStore.index(""));
</script>
