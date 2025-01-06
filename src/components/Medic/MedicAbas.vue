<template>
  <v-card>
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab value="medic">Médicos</v-tab>
      <v-tab value="comission">Comissão consulta</v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="medic">
          <MedicTable />
        </v-tabs-window-item>
        <v-tabs-window-item value="comission">
          <MedicTableComission />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const tab = ref("medic");
</script>
