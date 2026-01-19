<template>
  <v-card variant="flat" rounded="xl" elevation="8" color="bgcolor">
    <v-card-text>
      <v-tabs v-model="tab" color="primary">
        <v-tab value="seller" class="text-none">
          <span class="font-weight-bold text-colorTextPrimary">
            Vendedores
          </span>
        </v-tab>
        <v-tab value="comission" class="text-none">
          <span class="font-weight-bold text-colorTextPrimary"> Comissão </span>
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="seller">
          <SellerTable />
        </v-tabs-window-item>
        <v-tabs-window-item value="comission">
          <SellerTableComission />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const tab = ref("seller");
</script>
