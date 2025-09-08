<template>
  <v-card variant="flat" rounded="xl" elevation="8">
    <v-card-text>
      <v-tabs v-model="tab" color="primary">
        <v-tab value="medic" class="text-none">
          <span class="font-weight-bold text-primary"> Médicos </span>
        </v-tab>
        <v-tab value="comission" class="text-none">
          <span class="font-weight-bold text-primary"> Comissão consulta </span>
        </v-tab>
        <v-tab value="schedule" class="text-none">
          <span class="font-weight-bold text-primary"> Agenda </span>
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="medic">
          <MedicTable />
        </v-tabs-window-item>
        <v-tabs-window-item value="comission">
          <MedicTableComission />
        </v-tabs-window-item>
        <v-tabs-window-item value="schedule">
          <MedicDoctorSchedule />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const tab = ref("medic");
</script>
