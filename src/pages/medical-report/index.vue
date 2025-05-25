<template>
  <MedicalReportTable />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const consultationReport = usePatientConsultationReportStore();

const initialDate = dayjs().startOf("month").format("YYYY-MM-DD");
const finalDate = dayjs().endOf("month").format("YYYY-MM-DD");

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
