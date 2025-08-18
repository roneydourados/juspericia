<template>
  <div class="pa-6">
    <HeaderPage title=" Pacote de serviços" font-size="1.8rem" />
  </div>
  <v-row justify="center" class="px-6">
    <v-col v-for="(item, index) in $packages" :key="index" cols="12" lg="4">
      <ServicePackageCard :item="item" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const consutationPackage = useServicePackageStore();
const $packages = computed(() => consutationPackage.$all);
</script>
