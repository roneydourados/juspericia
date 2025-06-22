<template>
  <v-card>
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab value="seller" class="text-none">Vendedores</v-tab>
      <v-tab value="comission" class="text-none">Comissão</v-tab>
    </v-tabs>

    <v-card-text>
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
