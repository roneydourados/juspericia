<template>
  <SolicitationDetails />
</template>

<script setup lang="ts">
const route = useRoute();
const id = String(route.params.id);

const storeConsultation = useSolicitationConsultationStore();

onMounted(async () => {
  await storeConsultation.show(id);
});
// await useAsyncData(async () => {
//   await storeConsultation.show(id);
// });
</script>
