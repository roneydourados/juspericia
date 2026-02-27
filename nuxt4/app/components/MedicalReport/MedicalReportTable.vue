<template>
  <div v-if="!showReportForm">
    <div class="d-flex flex-column w-100">
      <HeaderPage title="Gestão de laudos" font-size="1.8rem" />
      <v-row class="mt-4" dense>
        <v-col cols="12" lg="3">
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
        <v-col v-if="filters.emitReport === 'Sim'" cols="12" lg="2">
          <SelectInput
            v-model="filters.status"
            label="Status"
            item-value="value"
            item-title="text"
            :items="[
              {
                text: 'Todos',
                value: undefined,
              },
              {
                text: 'Pendente de assinatura',
                value: 'sign-pending',
              },
              {
                text: 'Assinado',
                value: 'signed',
              },
            ]"
            @update:model-value="getReports"
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
        <v-col
          cols="12"
          lg="6"
          class="d-flex flex-wrap align-center"
          style="gap: 1rem"
        >
          <v-checkbox
            v-model="filters.justify"
            label="Mostrar somente laudos com justificativas"
            hide-details
            @update:model-value="getReports"
            color="blue"
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
      </template>
      <template v-slot:item.dateClose="{ item }">
        <span>{{ dayjs(item.dateClose).format("DD/MM/YYYY") }}</span>
      </template>
      <template v-slot:item.gutScore="{ item }">
        <strong :style="{ color: gutScoreColor(item.gutScore) }">{{
          item.gutScore ?? "N/A"
        }}</strong>
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
              v-if="item.reportStatus === 'sign-pending'"
              icon
              color="blue"
              variant="text"
              size="small"
              @click="handleSignDocument(item)"
            >
              <v-icon icon="mdi-file-edit-outline" size="20"></v-icon>
              <v-tooltip
                activator="parent"
                location="top center"
                content-class="tooltip-background"
              >
                Assinar documento
              </v-tooltip>
            </v-btn>
            <v-btn
              v-else
              icon
              color="red"
              variant="text"
              size="small"
              @click="handleDownloadSignedFile(item)"
            >
              <v-icon icon="mdi-file-pdf-box" size="20"></v-icon>
              <v-tooltip
                activator="parent"
                location="top center"
                content-class="tooltip-background"
              >
                Laudo
              </v-tooltip>
            </v-btn>
            <v-btn
              v-if="item.reportStatus === 'signed'"
              icon
              color="danger"
              variant="text"
              size="small"
              @click="handleGetSignatureCancel(item)"
            >
              <v-icon icon="mdi-pencil-off-outline" size="20"></v-icon>
              <v-tooltip
                activator="parent"
                location="top center"
                content-class="tooltip-background"
              >
                Cancelar assinatura
              </v-tooltip>
            </v-btn>
            <v-btn
              v-if="
                ($currentUser?.profile?.type === 'ADMIN' ||
                  $currentUser?.profile?.type === 'MEDICO') &&
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
          <div class="d-flex">
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
              :disabled="!item.reportPublicId"
            >
              <v-icon icon="mdi-dots-vertical-circle-outline" size="20" />
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
        </div>
      </template>
    </Table>
    <MedicalReportTableMobile
      v-else
      @details="handleReportDetails($event)"
      @new="handleNewReport($event)"
      @sign="handleSignDocument($event)"
      @download-sign="handleDownloadSignedFile($event)"
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
  <MedicSignDocument
    v-model:dialog="showSignDocument"
    v-model:token="signerToken"
    v-model:report="selectedReport"
    @close="getReports"
  />
  <Dialog
    title="CONFIRME"
    :dialog="showSignedCancel"
    @cancel="showSignedCancel = false"
    @confirm="handleSetSignedCancel"
    show-cancel
  >
    <span>
      Todos os anexos do laudo serão apagados, este processo é irreversível.
      Este Laudo encontra-se assinado, a cobrança pela assinatura digital não
      será revertida, tem certeza que deseja cancelar assinatura atual ?
    </span>
  </Dialog>
  <MedicalReportJustifies v-model="showJustificationCorrection" />
</template>

<script setup lang="ts">
// import { pdfMakeFonts } from "@/utils/pdfMakeFonts";
// import pdfMake from "pdfmake/build/pdfmake";
// import htmlToPdfmake from "html-to-pdfmake";
import dayjs from "dayjs";
import { uuidv7 } from "uuidv7";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const auth = useAuthStore();
const consultationReport = usePatientConsultationReportStore();
const storeConsultation = useSolicitationConsultationStore();
const nuvidioStore = useNuvidioStore();
const zapSign = useZapsignStore();
const fileStore = useFileStore();

const { formatCPFOrCNPJ, gutScoreColor } = useUtils();
const $consultationReports = computed(() => consultationReport.$all);
const $consultationReport = computed(() => consultationReport.$single);
const $document = computed(() => zapSign.$document);
const $currentUser = computed(() => auth.$currentUser);
//const $solicitation = computed(() => storeConsultation.$single);

const loading = ref(false);
const showReportDetails = ref(false);
const showReportForm = ref(false);
const showSignDocument = ref(false);
const showSignedCancel = ref(false);
const showJustificationCorrection = ref(false);
const signerToken = ref("");
const selectedReport = ref<PatientConsultationReportListProps>();

const filters = ref({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  patient: undefined as PatientProps | undefined,
  medic: undefined as UserProps | undefined,
  emitReport: "Não",
  justify: false,
  status: undefined as string | undefined,
});

const headers = ref([
  { title: "Laudo Nº", key: "reportId" },
  { title: "Solicitação Nº", key: "id" },
  { title: "Score", key: "gutScore" },
  { title: "Data consulta", key: "dateClose" },
  { title: "Benefício", key: "benefitType" },
  { title: "Finalidade", key: "reportPurpose" },
  { title: "Paciente", key: "patient" },
  { title: "CPF", key: "cpf" },
  { title: "Status", key: "reportStatus" },
  { title: "Ações", key: "actions", sortable: false },
]);

const handleSignDocument = async (item: PatientConsultationReportListProps) => {
  selectedReport.value = item;

  if (!item.reportContent || !item.reportId) {
    return push.error("Laudo não possui conteúdo para gerar PDF.");
  }

  loading.value = true;
  try {
    let base64 = {
      pdfBase64: "",
    };

    if (item.isPdfMode) {
      //se for PDF mode o content já é um base 64 de PDF então não precisa buscar, ja passar direto
      base64.pdfBase64 = item.reportContent;

      // const infoBlock = `
      // <div style="margin-bottom: 24px; font-size: 14px; color: #333;">
      //   <strong>Paciente:</strong> ${item.patient}<br/>
      //   <strong>Data do Laudo:</strong> ${item.dateClose}<br/>
      //   <strong>Médico Responsável:</strong> ${item.medic}<br/>
      //   <strong>CRM:</strong> ${item.medicCrm}
      //   <strong>UF:</strong> ${item.medicCrmUf}<br/>
      //   ${
      //     item.medicalSpecialty
      //       ? `<br/><strong>Especialidade:</strong> ${item.medicalSpecialty}`
      //       : ""
      //   }
      // </div>`;
    } else {
      base64 = await consultationReport.getPdfBase64(item.reportPublicId);
    }

    if (base64.pdfBase64) {
      const fileName = `Laudo_${item.patient}_${uuidv7()}.pdf`;
      const payload = {
        fileBase64: base64.pdfBase64,
        fileName,
        name: $currentUser.value?.name as string,
        email: $currentUser.value?.email as string,
        fileCategory: "medical-report",
        ownerId: item.reportId,
      };

      if (!item.signToken) {
        await zapSign.sendDocument(payload);
      } else {
        await zapSign.getDocument(item.signToken);
      }

      signerToken.value = $document.value?.signers[0]?.token ?? "";
      showSignDocument.value = !!signerToken.value;
    }

    //atualizar a lista de laudos após o envio
    await getReports();
  } catch (error) {
    //atualizar a lista de laudos após o envio
    await getReports();
    console.error("Erro ao enviar documento para ZapSign:", error);
    push.error("Erro ao enviar documento para ZapSign.");
  } finally {
    loading.value = false;
  }
};

const handleDownloadSignedFile = async (
  item: PatientConsultationReportListProps,
) => {
  if (!item.reportPublicId) {
    push.error("Documento não assinado.");
    return;
  }

  loading.value = true;
  try {
    const { fileBlob, fileName } = await zapSign.getSignedFile(
      item.reportPublicId,
    );

    // Exemplo: Se o fileStore.download retornar um blob com metadados do nome do arquivo
    const url = window.URL.createObjectURL(fileBlob);

    // Cria um link temporário
    const link = document.createElement("a");
    link.href = url;

    // Define o nome do arquivo
    link.download = fileName;

    // Adiciona e clica no link
    document.body.appendChild(link);
    link.click();

    // Remove o link temporário
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log("🚀 ~ handleDownloadSignedFile ~ error:", error);
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
      userId:
        $currentUser.value?.profile?.type === "MEDICO"
          ? $currentUser.value?.id
          : filters.value.medic?.id,
      emitReport: filters.value.emitReport === "Sim",
      justify: filters.value.justify,
      status: filters.value.status,
    });
  } finally {
    loading.value = false;
  }
};

const handleReportDetails = async (
  item: PatientConsultationReportListProps,
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
    await storeConsultation.show(item.publicId!);
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
  item: PatientConsultationReportListProps,
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

const handleSetSignedCancel = async () => {
  if (!selectedReport.value) return;
  loading.value = true;
  try {
    await consultationReport.show(selectedReport.value.reportPublicId!);

    // antes de cancelar a assinatura, verificar se existem anexos a serem deletados
    if (
      $consultationReport.value &&
      $consultationReport.value.attachments &&
      $consultationReport.value.attachments.length > 0
    ) {
      for (const attachment of $consultationReport.value.attachments) {
        if (attachment.publicId) {
          await fileStore.removeAws(attachment.publicId);
        }
      }
    }
    // apagar os anexos do laudo

    await consultationReport.cancelSign({
      publicId: selectedReport.value.reportPublicId!,
      justify: `Cancelamento de assinatura pelo usuário: ${$currentUser.value?.name}`,
    });
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
  } finally {
    showSignedCancel.value = false;
    loading.value = false;
    await getReports();
  }
};

const handleReportCorrection = async (
  item: PatientConsultationReportListProps,
) => {
  loading.value = true;
  try {
    await consultationReport.show(item.reportPublicId!);
    showJustificationCorrection.value = true;
  } finally {
    loading.value = false;
  }
};

const handleDownloadRecord = async (nuvidioCallId?: string) => {
  if (!nuvidioCallId) {
    push.warning(
      "Agendamento ainda não possui uma chamada de vídeo totalmente finalizada.",
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
</script>
