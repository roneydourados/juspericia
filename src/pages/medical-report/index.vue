<template>
  <MedicalReportTable />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import moment from "moment";

const consultationReport = usePatientConsultationReportStore();

const initialDate = moment().startOf("month").format("YYYY-MM-DD");
const finalDate = moment().endOf("month").format("YYYY-MM-DD");

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await consultationReport.index({ initialDate, finalDate });
  } finally {
    loading.value = false;
  }
});

// await useAsyncData(async () => {
//   await consultationReport.index({ initialDate, finalDate });
//});
</script>
