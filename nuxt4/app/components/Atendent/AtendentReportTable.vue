<template>
  <div v-if="!showReportForm">
    <div class="d-flex flex-column w-100">
      <HeaderPage title="Gestão de laudos" font-size="1.8rem" />
      <v-row class="mt-4" dense>
        <v-col cols="12" lg="4">
          <SelectSearchPatient
            label="Paciente"
            v-model="filters.patient"
            @update:model-value="getReports"
            clearable
          />
        </v-col>
        <v-col cols="12" lg="2">
          <SelectInput
            v-model="filters.emitReport"
            label="Laudo Emitido"
            :items="['Não', 'Sim']"
            @update:model-value="getReports"
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
        <v-col cols="12" lg="4">
          <SelectSearchMedicAtendent
            label="Médico"
            v-model="filters.medic"
            @update:model-value="getReports"
            clearable
          />
        </v-col>
        <v-col cols="12" lg="2">
          <Button
            color="primary"
            size="small"
            variant="flat"
            @click="getReports"
          >
            <v-icon icon="mdi-filter-outline" color="colorIcon" start />
            <span class="text-caption">Filtrar</span>
          </Button>
        </v-col>
      </v-row>
    </div>
    <Table
      title="Laudos Médicos"
      font-size="1.5rem"
      :show-crud="false"
      :headers="headers"
      :items="$consultationReports"
      v-if="!mobile"
    >
      <template v-slot:item.reportId="{ item }">
        <div class="d-flex flex-column">
          <span>{{ item.reportId }}</span>
        </div>
      </template>
      <template v-slot:item.dateClose="{ item }">
        <span>{{ dayjs(item.dateClose).format("DD/MM/YYYY") }}</span>
      </template>
      <template v-slot:item.cpf="{ item }">
        <span>{{ formatCPFOrCNPJ(item.cpf) }}</span>
      </template>
      <template v-slot:item.reportStatus="{ item }">
        <v-chip
          :color="getReportStatusColor(item.reportStatus).color"
          variant="flat"
        >
          <v-icon :icon="getReportStatusColor(item.reportStatus).icon" start />
          <strong style="font-size: 0.7rem">
            {{
              item.reportStatus === "empty"
                ? "Sem laudo"
                : item.reportStatus === "cancel"
                ? "Cancelado"
                : item.reportStatus === "sign-pending"
                ? "Assinatura pendente"
                : item.reportStatus === "signed"
                ? "Assinado"
                : "Desconhecido"
            }}
          </strong>
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-content-center">
          <div
            v-if="item.reportContent && item.reportStatus !== 'cancel'"
            class="d-flex justify-content-center"
          >
            <v-btn
              v-if="
                ($currentUser?.profile?.type === 'ADMIN' ||
                  $currentUser?.profile?.type === 'MEDICO' ||
                  $currentUser?.profile?.type === 'ATENDENTE') &&
                item.reportStatus !== 'signed'
              "
              icon
              color="orange"
              variant="text"
              size="small"
              @click="handleEditCorrection(item)"
              :disabled="item.reportStatus === 'signed'"
            >
              <v-icon icon="mdi-clock-edit-outline" size="20"></v-icon>
              <v-tooltip
                activator="parent"
                location="top center"
                content-class="tooltip-background"
              >
                Correção/Editar
              </v-tooltip>
            </v-btn>
          </div>
          <div class="d-flex justify-content-center">
            <v-btn
              v-if="!item.reportContent && item.reportStatus === 'empty'"
              icon
              color="info"
              variant="text"
              size="small"
              @click="handleNewReport(item)"
            >
              <v-icon icon="mdi-file-document-edit-outline" size="20"></v-icon>
              <v-tooltip
                activator="parent"
                location="top center"
                content-class="tooltip-background"
              >
                Digitar laudo
              </v-tooltip>
            </v-btn>
            <v-btn
              icon
              color="purple"
              variant="text"
              size="small"
              @click="handleReportDetails(item)"
            >
              <v-icon
                icon="mdi-dots-vertical-circle-outline"
                size="20"
              ></v-icon>
              <v-tooltip
                activator="parent"
                location="top center"
                content-class="tooltip-background"
              >
                Detalhes do laudo
              </v-tooltip>
            </v-btn>
          </div>
        </div>
      </template>
    </Table>
    <AtendentReportTableMobile
      v-else
      @details="handleReportDetails($event)"
      @new="handleNewReport($event)"
      @cancel-sign="handleGetSignatureCancel($event)"
      @edit-correction="handleEditCorrection($event)"
    />
    <DialogLoading :dialog="loading" />
    <MedicalReportDetails v-model="showReportDetails" :data="selectedReport" />
  </div>
  <MedicalReportForm
    v-if="showReportForm"
    @close="handleCloseForm"
    :data="selectedReport"
  />

  <MedicalReportJustifies v-model="showJustificationCorrection" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const auth = useAuthStore();
const consultationReport = usePatientConsultationReportStore();
const atendentMedicStore = useAtendentMedicStore();
const storeConsultation = useSolicitationConsultationStore();
const scheduleStore = useScheduleStore();
//const zapSign = useZapsignStore();

const { formatCPFOrCNPJ } = useUtils();
const $consultationReports = computed(
  () => atendentMedicStore.$consultationReportsList
);

// const $consultationReport = computed(() => consultationReport.$single);
// const $document = computed(() => zapSign.$document);
const $currentUser = computed(() => auth.$currentUser);
//const $solicitation = computed(() => storeConsultation.$single);

const loading = ref(false);
const showReportDetails = ref(false);
const showReportForm = ref(false);
//const showSignDocument = ref(false);
const showSignedCancel = ref(false);
const showJustificationCorrection = ref(false);
//const signerToken = ref("");
const selectedReport = ref<PatientConsultationReportListProps>();

const filters = ref({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  patient: undefined as PatientProps | undefined,
  medic: undefined as UserProps | undefined,
  emitReport: "Não",
});

const headers = ref([
  { title: "Laudo Nº", key: "reportId" },
  { title: "Solicitação Nº", key: "id" },
  { title: "Data consulta", key: "dateClose" },
  { title: "Benefício", key: "benefitType" },
  // { title: "Finalidade", key: "reportPurpose" },
  //{ title: "Paciente", key: "patient" },
  // { title: "CPF", key: "cpf" },
  { title: "Status", key: "reportStatus" },
  { title: "Médico", key: "medic" },
  { title: "Ações", key: "actions", sortable: false },
]);

const getReports = async () => {
  loading.value = true;
  try {
    await atendentMedicStore.getConsultationReports({
      initialDate: filters.value.initialDate,
      finalDate: filters.value.finalDate,
      patientId: filters.value.patient?.id,
      emitReport: filters.value.emitReport === "Sim",
      medicId: filters.value.medic?.id,
    });
  } finally {
    loading.value = false;
  }
};

const handleReportDetails = async (
  item: PatientConsultationReportListProps
) => {
  loading.value = true;
  try {
    await consultationReport.show(item.reportPublicId!);
    showReportDetails.value = true;
  } finally {
    loading.value = false;
  }
};

const handleNewReport = async (item: PatientConsultationReportListProps) => {
  loading.value = true;
  try {
    // Finalizar a solicitação de consulta
    await storeConsultation.update({
      publicId: item.publicId,
      isTelemedicine: false,
      dateClose: dayjs().format("YYYY-MM-DD"), //atualizar a data de fechamento novamente para o dia que foi finalizado de fato
      status: "finished",
    });

    //pegar solicitação atualizada
    await storeConsultation.show(item.publicId!);

    // finalizar qualuqer agenda pendente
    await scheduleStore.finalizeSchedule(item.id!);

    selectedReport.value = item;
    showReportForm.value = true;
  } finally {
    loading.value = false;
  }
};

const handleCloseForm = async () => {
  showReportForm.value = false;
  selectedReport.value = undefined;
  await getReports();
};

const handleEditCorrection = async (
  item: PatientConsultationReportListProps
) => {
  loading.value = true;
  try {
    await storeConsultation.show(item.publicId!);
    await consultationReport.show(item.reportPublicId!);
    selectedReport.value = item;
    showReportForm.value = true;
  } finally {
    loading.value = false;
  }
};

const handleGetSignatureCancel = (item: PatientConsultationReportListProps) => {
  selectedReport.value = item;
  showSignedCancel.value = true;
};

const getReportStatusColor = (status: string) => {
  switch (status) {
    case "empty":
      return {
        color: "orange-darken-1",
        icon: "mdi-alert-circle-outline",
      };
    case "cancel":
      return {
        color: "red",
        icon: "mdi-close-circle-outline",
      };
    case "sign-pending":
      return {
        color: "blue",
        icon: "mdi-clock-alert-outline",
      };
    case "signed":
      return {
        color: "green",
        icon: "mdi-check-all",
      };
    default:
      return {
        color: "grey",
        icon: "mdi-help-circle-outline",
      };
  }
};
</script>
