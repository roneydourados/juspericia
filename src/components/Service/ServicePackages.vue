<template>
  <div>
    <v-card flat rounded="lg">
      <v-card-title>
        <HeaderPage title="Pacotes de serviços" />
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col
            v-for="(item, index) in $packages"
            :key="index"
            cols="12"
            lg="4"
          >
            <ServicePackageCard :item="item" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const consutationPackage = useServicePackageStore();
const $packages = computed(() => consutationPackage.$all);
</script>
