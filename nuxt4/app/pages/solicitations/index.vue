<template>
  <SolicitationTable />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const { setSolicitationsFilters, getSolicitationsFilters } = useUtils();
const storeConsultation = useSolicitationConsultationStore();
//const authStore = useAuthStore();
const systemParameters = useSystemParametersStore();
const loading = ref(false);
//const $currentUser = computed(() => authStore.$currentUser);

onMounted(async () => {
  const filtes = getSolicitationsFilters();

  let modelFilters = {
    status: "open",
    initialDateSolicitation: dayjs().subtract(3, "month").format("YYYY-MM-DD"),
    finalDateSolicitation: dayjs().endOf("month").format("YYYY-MM-DD"),
    benefitType: undefined as BenefitTypeProps | undefined,
    patient: undefined as PatientProps | undefined,
    reportPurpose: undefined as ReportPurposeProps | undefined,
    lawyer: undefined as UserProps | undefined,
  };

  if (filtes) {
    modelFilters = {
      status: "open",
      initialDateSolicitation:
        filtes.initialDateSolicitation ??
        dayjs().subtract(3, "month").format("YYYY-MM-DD"),
      finalDateSolicitation:
        filtes.finalDateSolicitation ??
        dayjs().endOf("month").format("YYYY-MM-DD"),
      lawyer: filtes.lawyer,
      benefitType: undefined as BenefitTypeProps | undefined,
      patient: undefined as PatientProps | undefined,
      reportPurpose: undefined as ReportPurposeProps | undefined,
    };
  }

  loading.value = true;
  try {
    setSolicitationsFilters(modelFilters);
    await storeConsultation.index({
      ...modelFilters,
      userId: modelFilters.lawyer?.id,
    });
    await systemParameters.index();
  } finally {
    loading.value = false;
  }
});
</script>
