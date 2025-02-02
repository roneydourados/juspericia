<template>
  <ServicePackages />
</template>

<script setup lang="ts">
const consutationPackage = useServicePackageStore();
onMounted(async () => {
  await consutationPackage.index("active");
});
//await useAsyncData(async () => await consutationPackage.index("active"));
</script>
