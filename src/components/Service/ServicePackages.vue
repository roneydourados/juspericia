<template>
  <v-card variant="flat" class="mx-auto" color="transparent">
    <v-card class="ma-4" rounded="lg" variant="flat" color="transparent">
      <v-card-item>
        <v-card-title class="text-body-2 d-flex align-center">
          <v-icon color="primary" icon="mdi-cart-arrow-up" start size="40" />

          <span class="text-h6 font-weight-bold"> Pacote de serviços </span>

          <v-spacer></v-spacer>
        </v-card-title>
      </v-card-item>

      <v-divider></v-divider>

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
