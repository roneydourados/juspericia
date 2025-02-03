<template>
  <SolicitationTable />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import moment from "moment";

const { setSolicitationsFilters } = useUtils();
const storeConsultation = useSolicitationConsultationStore();

const loading = ref(false);
const modelFilters = ref<SolicitationConsultationFilterProps>({
  status: "open",
  initialDateSolicitation: moment().startOf("year").format("YYYY-MM-DD"),
  finalDateSolicitation: moment().endOf("year").format("YYYY-MM-DD"),
  benefitType: undefined as BenefitTypeProps | undefined,
  patient: undefined as PatientProps | undefined,
  reportPurpose: undefined as ReportPurposeProps | undefined,
});

onMounted(async () => {
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
