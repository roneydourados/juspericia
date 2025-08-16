<template>
  <div class="pa-6">
    <HeaderPage title=" Pacote de serviços" font-size="1.8rem" />
  </div>
  <v-card variant="flat" class="mx-auto" color="transparent">
    <v-card class="ma-4" rounded="lg" variant="flat" color="transparent">
      <v-card flat rounded="lg" color="transparent">
        <v-card-text>
          <v-row dense justify="center">
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
    </v-card>
  </v-card>
</template>

<script setup lang="ts">
const consutationPackage = useServicePackageStore();
const $packages = computed(() => consutationPackage.$all);
</script>
