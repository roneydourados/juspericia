<template>
  <v-row justify="end">
    <v-col v-if="showReportStatus" cols="12" lg="4">
      <SelectInput
        label="Status Laudo"
        v-model="model.reportStatus"
        item-title="text"
        item-value="value"
        :items="[
          { text: 'Aguardando Assinatura', value: 'signature_pending' },
          { text: 'Aguardando Laudo', value: 'report_pending' },
          { text: 'Laudo Pronto', value: 'report_ready' },
          { text: 'Todos', value: 'report_all' },
        ]"
      />
    </v-col>
    <v-col cols="12" lg="2">
      <IntegerInput label="Nº Solicitação" v-model="model.solicitationId" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps({
  showReportStatus: {
    type: Boolean,
    default: true,
  },
});

const model = defineModel({
  default: {
    reportStatus: "report_all",
    solicitationId: "",
  },
});
</script>

<style scoped></style>
