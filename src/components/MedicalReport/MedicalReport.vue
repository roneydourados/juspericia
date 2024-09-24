<template>
  <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
    <v-card flat rounded="lg">
      <v-row dense>
        <v-col cols="12" lg="6">
          <MedicalConsultationDetails />
        </v-col>
        <v-col cols="12" lg="6">
          <MedicalReportForm @close="dialog = false" />
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const dialog = defineModel({ default: false });
</script>
