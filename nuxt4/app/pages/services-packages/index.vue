<template>
  <!-- <ServicePackages /> -->
  <EmptyContent
    head-line="Fora do ar"
    title="Serviço temporariamente fora do ar."
  />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const consutationPackage = useServicePackageStore();

const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    await consutationPackage.index({ name: "", status: "active" });
  } finally {
    loading.value = false;
  }
});
//await useAsyncData(async () => await consutationPackage.index("active"));
</script>
