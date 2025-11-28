<template>
  <div v-if="!showReportForm">
    <div class="d-flex flex-column w-100">
      <HeaderPage title="Gestão de laudos" font-size="1.8rem" />
      <v-row class="mt-4" dense align="center">
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
        <v-col
          cols="12"
          lg="6"
          class="d-flex align-center flex-wrap"
          style="gap: 1rem"
        >
          <v-checkbox
            v-model="filters.justify"
            label="Mostrar somente laudos com justificativas"
            hide-details
            @update:model-value="getReports"
            color="blue"
            class="mt-n2"
          />
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
        <!-- <v-col cols="12" lg="2">
          <Button
            color="primary"
            size="small"
            variant="flat"
            @click="getReports"
          >
            <v-icon icon="mdi-filter-outline" color="colorIcon" start />
            <span class="text-caption">Filtrar</span>
          </Button>
        </v-col> -->
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
          <span v-if="!item.justifyId">{{ item.reportId }}</span>
          <div v-else-if="item.justifyId">
            <v-chip
              label
              color="warning"
              variant="flat"
              @click="handleReportCorrection(item)"
            >
              <strong>
                {{ item.reportId }} - Laudo contém justificativas
              </strong>
              <v-tooltip
                activator="parent"
                location="top center"
                content-class="tooltip-background"
              >
                <p
                  style="
                    white-space: normal;
                    max-width: 260px;
                    word-break: break-word;
                  "
                >
                  Laudo contém justificativas, seja de solicitação de correção
                  ou de informações adicionais, como cancelamento de assinatura.
                  Clique para ver a justificativa.
                </p>
              </v-tooltip>
            </v-chip>
          </div>
        </div>
        <!-- <div class="d-flex flex-column">
          <span>{{ item.reportId }}</span>
        </div> -->
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
          <!-- <div
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
              :disabled="item.reportStatus === 'signed' || !item.reportContent"
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
          -->
          <v-btn
            icon
            color="orange"
            variant="text"
            size="small"
            @click="handleEditCorrection(item)"
            :disabled="item.reportStatus === 'signed' || !item.reportContent"
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
          <v-btn
            icon
            color="info"
            variant="text"
            size="small"
            @click="handleNewReport(item)"
            :disabled="item.reportContent && item.reportStatus !== 'empty'"
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
            <v-icon icon="mdi-dots-vertical-circle-outline" size="20"></v-icon>
            <v-tooltip
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Detalhes do laudo
            </v-tooltip>
          </v-btn>
          <v-btn
            color="purple-darken-2"
            icon
            variant="text"
            @click="handleDownloadRecord(item.nuvidioCallId)"
            size="small"
            :disabled="!item.nuvidioCallId"
          >
            <v-icon icon="mdi-video-outline" size="20" color="purple" />
            <v-tooltip
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Baixar gravação do atendimento
            </v-tooltip>
          </v-btn>
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
const nuvidioStore = useNuvidioStore();
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
  justify: false,
});

const headers = ref([
  { title: "Laudo Nº", key: "reportId" },
  { title: "Solicitação Nº", key: "id" },
  { title: "Data consulta", key: "dateClose" },
  //{ title: "Benefício", key: "benefitType" },
  // { title: "Finalidade", key: "reportPurpose" },
  { title: "Médico", key: "medic" },
  { title: "Paciente", key: "patient" },
  // { title: "CPF", key: "cpf" },
  { title: "Status", key: "reportStatus" },
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
      justify: filters.value.justify,
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

const handleDownloadRecord = async (nuvidioCallId?: string) => {
  if (!nuvidioCallId) {
    push.warning(
      "Agendamento ainda não possui uma chamada de vídeo totalmente finalizada."
    );
    return;
  }

  loading.value = true;
  try {
    const { file, fileName } = await nuvidioStore.getRecordCall(nuvidioCallId);

    // Exemplo: Se o fileStore.download retornar um blob com metadados do nome do arquivo
    const url = window.URL.createObjectURL(file);

    // Cria um link temporário
    const link = document.createElement("a");
    link.href = url;

    // Define o nome do arquivo
    link.download = `${fileName}`;

    // Adiciona e clica no link
    document.body.appendChild(link);
    link.click();

    // Remove o link temporário
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log("🚀 ~ handleDownloadRecord ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const handleReportCorrection = async (
  item: PatientConsultationReportListProps
) => {
  loading.value = true;
  try {
    await consultationReport.show(item.reportPublicId!);
    showJustificationCorrection.value = true;
  } finally {
    loading.value = false;
  }
};
</script>
