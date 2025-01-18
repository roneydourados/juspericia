<template>
  <ServicePackages />
</template>

<script setup lang="ts">
const consutationPackage = useServicePackageStore();
await useAsyncData(async () => await consutationPackage.index("active"));
</script>
