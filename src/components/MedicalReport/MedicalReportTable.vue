<template>
  <div v-if="!showReportForm">
    <div class="d-flex flex-column w-100">
      <HeaderPage title="Gestão de laudos" />
      <v-row class="mt-4" dense>
        <v-col cols="12" lg="3">
          <SelectSearchPatient
            label="Paciente"
            v-model="filters.patient"
            @update:model-value="getReports"
            clearable
          />
        </v-col>
        <v-col cols="12" lg="1">
          <SelectInput
            v-model="filters.emitReport"
            label="Laudo Emitido"
            :items="['Não', 'Sim']"
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
    <!-- <pre>{{ $consultationReports }}</pre> -->
    <Table
      title="Laudos Médicos"
      :show-crud="false"
      :headers="headers"
      :items="$consultationReports"
    >
      <template v-slot:item.dateClose="{ item }">
        <span>{{ dayjs(item.dateClose).format("DD/MM/YYYY") }}</span>
      </template>
      <template v-slot:item.cpf="{ item }">
        <span>{{ formatCPFOrCNPJ(item.cpf) }}</span>
      </template>
      <template v-slot:item.reportStatus="{ item }">
        <v-chip
          :color="getReportStatusColor(item.reportStatus).color"
          label
          variant="flat"
        >
          <v-icon :icon="getReportStatusColor(item.reportStatus).icon" start />
          <strong style="font-size: 0.8rem">
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
      Este Laudo encontra-se assinado, a cobrança pela assinatura digital não
      será revertida, tem certeza que deseja cancelar assinatura atual ?
    </span>
  </Dialog>
</template>

<script setup lang="ts">
import { pdfMakeFonts } from "@/utils/pdfMakeFonts";
import pdfMake from "pdfmake/build/pdfmake";
import htmlToPdfmake from "html-to-pdfmake";
import dayjs from "dayjs";

const auth = useAuthStore();
const consultationReport = usePatientConsultationReportStore();
const zapSign = useZapsignStore();

const { formatCPFOrCNPJ } = useUtils();
const $consultationReports = computed(() => consultationReport.$all);
const $document = computed(() => zapSign.$document);
const $currentUser = computed(() => auth.$currentUser);

const loading = ref(false);
const showReportDetails = ref(false);
const showReportForm = ref(false);
const showSignDocument = ref(false);
const showSignedCancel = ref(false);
const signerToken = ref("");
const selectedReport = ref<PatientConsultationReportListProps>();

const filters = ref({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  patient: undefined as PatientProps | undefined,
  medic: undefined as UserProps | undefined,
  emitReport: "Não",
});

const headers = ref([
  { title: "Nº", key: "reportId" },
  { title: "Solicitação Nº", key: "id" },
  { title: "Data consulta", key: "dateClose" },
  { title: "Benefício", key: "benefitType" },
  { title: "Finalidade", key: "reportPurpose" },
  { title: "Paciente", key: "patient" },
  { title: "CPF", key: "cpf" },
  { title: "Status", key: "reportStatus" },
  { title: "Ações", key: "actions", sortable: false },
]);

const handleSignDocument = async (item: PatientConsultationReportListProps) => {
  loading.value = true;
  try {
    if (!item.reportContent || !item.reportId) {
      return push.error("Laudo não possui conteúdo para gerar PDF.");
    }

    const htmlContent = htmlToPdfmake(item.reportContent);

    const report = {
      content: [
        htmlContent,
        "\n",
        {
          text: `Laudo Médico ${dayjs(item.dateClose).format("DD/MM/YYYY")}`,
          style: "subheader",
        },
        {
          text: `Paciente: ${item.patient} CPF: ${formatCPFOrCNPJ(item.cpf)}`,
          style: "subheader",
        },
        {
          text: `Emitido por Dr(a) ${item.medic}\nCRM: ${item.medicCrm}/${item.medicCrmUf}`,
          style: "subheader",
        },

        //"\n\n\n\n",
        // {
        //   canvas: [
        //     {
        //       type: "line" as const,
        //       x1: 0,
        //       y1: 0,
        //       x2: 400,
        //       y2: 0,
        //       lineWidth: 1,
        //     },
        //   ],
        // },
        // {
        //   text: `${item.medic}\nCRM: ${item.medicCrm}/${item.medicCrmUf}`,
        //   style: "subheader",
        // },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 12,
          bold: true,
        },
        quote: {
          italics: true,
        },
        small: {
          fontSize: 8,
        },
      },
    };

    pdfMake.vfs = pdfMakeFonts.vfs;
    //@ts-ignore
    pdfMake.createPdf(report).getBase64(async (base64) => {
      if (!$currentUser.value) {
        push.error("Usuário não autenticado.");
        return;
      }

      loading.value = true;
      try {
        const payload = {
          fileBase64: base64,
          fileName: `Laudo_${item.patient}_${item.reportPublicId}.pdf`,
          name: $currentUser.value.name as string,
          email: $currentUser.value.email as string,
          fileCategory: "solicitation-report",
          ownerId: item.reportId,
        };

        if (!item.signToken) {
          await zapSign.sendDocument(payload);
        } else {
          await zapSign.getDocument(item.signToken);
        }

        //atualizar a lista de laudos após o envio
        await getReports();

        signerToken.value = $document.value?.signers[0]?.token ?? "";
        showSignDocument.value = true;
      } catch (error) {
        console.error("Erro ao enviar documento para ZapSign:", error);
        push.error("Erro ao enviar documento para ZapSign.");
      } finally {
        loading.value = false;
      }
    });
    //.download(`Laudo_${item.patient}_${item.publicId}.pdf`);
  } finally {
    loading.value = false;
  }
};

const handleDownloadSignedFile = async (
  item: PatientConsultationReportListProps
) => {
  if (!item.reportPublicId) {
    push.error("Documento não assinado.");
    return;
  }

  loading.value = true;
  try {
    const { fileBlob, fileName } = await zapSign.getSignedFile(
      item.reportPublicId
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
      medicId: filters.value.medic?.id,
      emitReport: filters.value.emitReport === "Sim",
    });
  } finally {
    loading.value = false;
  }
};

const handleReportDetails = (item: PatientConsultationReportListProps) => {
  selectedReport.value = item;
  showReportDetails.value = true;
};

const handleNewReport = (item: PatientConsultationReportListProps) => {
  selectedReport.value = item;
  showReportForm.value = true;
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
    await consultationReport.cancelSign(selectedReport.value.reportPublicId!);
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
  } finally {
    showSignedCancel.value = false;
    loading.value = false;
    await getReports();
  }
};
</script>
