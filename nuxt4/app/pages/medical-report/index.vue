<template>
  <MedicalReportTable />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const consultationReport = usePatientConsultationReportStore();
const auth = useAuthStore();
const $currentUser = computed(() => auth.$currentUser);
const initialDate = dayjs().startOf("month").format("YYYY-MM-DD");
const finalDate = dayjs().endOf("month").format("YYYY-MM-DD");

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await consultationReport.index({
      initialDate,
      finalDate,
      userId:
        $currentUser.value?.profile?.type === "MEDICO"
          ? $currentUser.value?.id
          : undefined,
    });
  } finally {
    loading.value = false;
  }
});
</script>
