<template>
  <ServicePackages />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const consutationPackage = useServicePackageStore();

const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    await consutationPackage.index("active");
  } finally {
    loading.value = false;
  }
});
//await useAsyncData(async () => await consutationPackage.index("active"));
</script>
