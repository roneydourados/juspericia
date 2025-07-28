<template>
  <SolicitationDetails />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const route = useRoute();
const id = String(route.params.id);

const storeConsultation = useSolicitationConsultationStore();
const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    await storeConsultation.show(id);
  } finally {
    loading.value = false;
  }
});
// await useAsyncData(async () => {
//   await storeConsultation.show(id);
// });
</script>
