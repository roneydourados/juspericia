<template>
  <SolicitationDetails />
</template>

<script setup lang="ts">
const route = useRoute();
const id = String(route.params.id);

const storeConsultation = useSolicitationConsultationStore();

await useAsyncData(async () => {
  await storeConsultation.show(id);
});
</script>
