<template>
  <AtendentReportTable />
  <DialogLoading :diaog="loading" />
</template>
<script setup lang="ts">
import dayjs from "dayjs";
const atendentMedicStore = useAtendentMedicStore();

const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    const initialDate = dayjs().startOf("month").format("YYYY-MM-DD");
    const finalDate = dayjs().endOf("month").format("YYYY-MM-DD");
    await atendentMedicStore.getConsultationReports({
      initialDate,
      finalDate,
      emitReport: false,
    });
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
