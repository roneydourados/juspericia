<template>
  <v-card variant="flat" rounded="xl" elevation="8">
    <v-card-text>
      <v-tabs v-model="tab" color="primary">
        <v-tab value="atendent" class="text-none">
          <span class="font-weight-bold text-primary"> Atendentes </span>
        </v-tab>
        <v-tab value="comission" class="text-none">
          <span class="font-weight-bold text-primary"> Comissão </span>
        </v-tab>
        <v-tab value="medics" class="text-none">
          <span class="font-weight-bold text-primary">
            Relação de médicos
          </span>
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="atendent">
          <AtendentTable />
        </v-tabs-window-item>
        <v-tabs-window-item value="comission">
          <AtendentTableComission />
        </v-tabs-window-item>
        <v-tabs-window-item value="medics">
          <AtendentMedics />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const tab = ref("atendent");
</script>
