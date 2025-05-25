<template>
  <div>
    <!-- <pre>{{ $consultationReports }}</pre> -->
    <div class="d-flex flex-column w-100">
      <HeaderPage title="Solicitações" />
      <v-row class="mt-4" dense>
        <v-col cols="12" lg="4">
          <SelectSearchPatient
            label="Paciente"
            v-model="filters.patient"
            @update:model-value="getReports"
            clearable
          />
        </v-col>
        <v-col
          v-if="
            $currentUser?.profile?.type === 'ADMIN' ||
            $currentUser?.profile?.type === 'ADVOGADO'
          "
          cols="12"
          lg="3"
        >
          <SelectSearchMedic
            label="Médico"
            v-model="filters.medic"
            @update:model-value="getReports"
            clearable
          />
        </v-col>

        <v-col cols="12" lg="2">
          <DatePicker
            v-model="filters.initialDate"
            label="Data inicial"
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" lg="2">
          <DatePicker
            v-model="filters.finalDate"
            label="Data final"
            outlined
            dense
          />
        </v-col>
        <v-col cols="1">
          <v-btn
            icon
            color="info"
            size="small"
            variant="flat"
            @click="getReports"
          >
            <v-icon icon="mdi-reload" />
            <v-tooltip
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Atualizar dados
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <Table
      title="Laudos Médicos"
      :show-crud="false"
      :headers="headers"
      :items="$consultationReports"
    >
      <template v-slot:item.reportDate="{ item }">
        <span>{{ dayjs(item.reportDate).format("DD/MM/YYYY") }}</span>
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
              $currentUser?.profile?.type === 'ADMIN' ||
              $currentUser?.profile?.type === 'MEDICO'
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
          <v-btn
            v-if="
              $currentUser?.profile?.type === 'ADMIN' ||
              $currentUser?.profile?.type === 'MEDICO'
            "
            icon
            color="purple"
            variant="text"
            size="small"
            @click="handleReportDetails(item)"
          >
            <v-icon icon="mdi-dots-vertical-circle-outline" size="20"></v-icon>
            <v-tooltip
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Detalhes do laudo
            </v-tooltip>
          </v-btn>
        </div>
      </template>
    </Table>
    <DialogLoading :dialog="loading" />
    <MedicalReportDetails v-model="showReportDetails" :data="selectedReport" />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const auth = useAuthStore();
const consultationReport = usePatientConsultationReportStore();

const { formatCPFOrCNPJ, stringToHandlePDF } = useUtils();
const $consultationReports = computed(() => consultationReport.$all);
const $single = computed(() => consultationReport.$single);
const $currentUser = computed(() => auth.$currentUser);

const loading = ref(false);
const showReportDetails = ref(false);
const selectedReport = ref<PatientConsultationReportProps>();

const filters = ref({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  patient: undefined as PatientProps | undefined,
  medic: undefined as UserProps | undefined,
});
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

const getReports = async () => {
  loading.value = true;
  try {
    await consultationReport.index({
      initialDate: filters.value.initialDate,
      finalDate: filters.value.finalDate,
      patientId: filters.value.patient?.id,
      medicId: filters.value.medic?.id,
    });
  } finally {
    loading.value = false;
  }
};

const handleReportDetails = (item: PatientConsultationReportProps) => {
  selectedReport.value = item;
  showReportDetails.value = true;
};
</script>
