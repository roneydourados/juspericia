<template>
  <SolicitationTable />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const { setSolicitationsFilters } = useUtils();
const storeConsultation = useSolicitationConsultationStore();
const authStore = useAuthStore();

const loading = ref(false);
const $currentUser = computed(() => authStore.$currentUser);

onMounted(async () => {
  const modelFilters = ref<SolicitationConsultationFilterProps>({
    status: "open",
    initialDateSolicitation: dayjs().subtract(3, "month").format("YYYY-MM-DD"),
    finalDateSolicitation: dayjs().endOf("month").format("YYYY-MM-DD"),
    benefitType: undefined as BenefitTypeProps | undefined,
    patient: undefined as PatientProps | undefined,
    reportPurpose: undefined as ReportPurposeProps | undefined,
    userId:
      $currentUser.value?.profile?.type === "ADMIN"
        ? undefined
        : $currentUser.value?.id,
  });

  loading.value = true;
  try {
    setSolicitationsFilters(modelFilters.value);
    await storeConsultation.index(modelFilters.value);
  } finally {
    loading.value = false;
  }
});

// await useAsyncData("solicitations", async () => {
//   //atualizar filtros para padrão
//   setSolicitationsFilters(modelFilters.value);
//   await storeConsultation.index(modelFilters.value);
// });
</script>
