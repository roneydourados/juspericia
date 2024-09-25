<template>
  <div>
    <!-- <pre>{{ $consultationReports }}</pre> -->
    <Table
      title="Laudos Médicos"
      :show-crud="false"
      :headers="headers"
      :items="$consultationReports"
    >
      <template v-slot:item.reportDate="{ item }">
        <span>{{ moment(item.reportDate).format("DD/MM/YYYY") }}</span>
      </template>
      <template v-slot:item.Medic="{ item }">
        <div class="d-flex flex-column">
          <span>{{ item.Medic.name }}</span>
          <span style="font-size: 0.7rem">
            CRM:
            <strong style="font-size: 0.7rem"
              >{{ item.Medic.crm }}/{{ item.Medic.crmUf }}</strong
            >
          </span>
        </div>
      </template>
      <template v-slot:item.PatientConsultation="{ item }">
        <div class="d-flex flex-column">
          <span>
            {{ item.PatientConsultation.Patient.name }}
            {{ item.PatientConsultation.Patient.surname }}
          </span>
          <span style="font-size: 0.7rem">
            CPF:
            <strong style="font-size: 0.7rem">
              {{ formatCPFOrCNPJ(item.PatientConsultation.Patient.cpf) }}
            </strong>
          </span>
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-content-center">
          <v-btn
            icon
            color="info"
            variant="text"
            size="small"
            @click="handleGeneratePDF(item.publicId)"
          >
            <v-icon icon="mdi-printer-outline" size="20"></v-icon>
            <v-tooltip
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Imprimir
            </v-tooltip>
          </v-btn>
          <v-btn
            v-if="
              $currentUser?.Profile.type === 'ADMIN' ||
              $currentUser?.Profile.type === 'MEDICO'
            "
            icon
            color="orange"
            variant="text"
            size="small"
          >
            <v-icon icon="mdi-clock-edit-outline" size="20"></v-icon>
            <v-tooltip
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Efetuar correção
            </v-tooltip>
          </v-btn>
        </div>
      </template>
    </Table>
    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
const auth = useAuthStore();
const consultationReport = usePatientConsultationReportStore();
const { formatCPFOrCNPJ, stringToHandlePDF } = useUtils();
const $consultationReports = computed(() => consultationReport.$all);
const $single = computed(() => consultationReport.$single);
const $currentUser = computed(() => auth.$currentUser);

const loading = ref(false);
const headers = ref([
  { title: "Data Laudo", key: "reportDate" },
  { title: "Médico", key: "Medic" },
  { title: "Paciente", key: "PatientConsultation" },
  { title: "Ações", key: "actions", sortable: false },
]);

const handleGeneratePDF = async (pulicId: string) => {
  loading.value = true;
  try {
    await consultationReport.show(pulicId);

    if (!$single.value?.content) return;

    stringToHandlePDF($single.value.content);
  } finally {
    loading.value = false;
  }
};
</script>
