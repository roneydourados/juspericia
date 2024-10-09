<template>
  <MedicalReportTable />
</template>

<script setup lang="ts">
import moment from "moment";

const consultationReport = usePatientConsultationReportStore();

const initialDate = moment().startOf("month").format("YYYY-MM-DD");
const finalDate = moment().endOf("month").format("YYYY-MM-DD");

await useAsyncData(async () => {
  await consultationReport.index({ initialDate, finalDate });
});
</script>
