<template>
  <SolicitationTable />
</template>

<script setup lang="ts">
import moment from "moment";

const storeConsultation = useSolicitationConsultationStore();

const modelFilters = ref<SolicitationConsultationFilterProps>({
  status: "open",
  initialDateSolicitation: moment().startOf("month").format("YYYY-MM-DD"),
  finalDateSolicitation: moment().endOf("month").format("YYYY-MM-DD"),
  benefitType: undefined as BenefitTypeProps | undefined,
  patient: undefined as PatientProps | undefined,
  reportPurpose: undefined as ReportPurposeProps | undefined,
});

await useAsyncData(async () => {
  await storeConsultation.index(modelFilters.value);
});
</script>
