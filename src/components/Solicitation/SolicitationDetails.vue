<template>
  <v-card flat rounded="lg" class="pa-4">
    <v-card-title>
      <v-row dense>
        <v-col cols="12" lg="11">
          <span style="font-size: 1.5rem" class="mr-2 font-weight-bold">
            #{{ $single?.id }}
          </span>
          <span style="font-size: 1.5rem">Detalhes</span>
        </v-col>
        <v-col cols="12" lg="1">
          <v-btn
            class="text-none"
            prepend-icon="mdi-arrow-left"
            flat
            color="primary"
            size="small"
            @click="router.back()"
            v-if="showVoltar"
          >
            Voltar
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-row dense class="px-4">
      <v-divider />
      <v-col cols="12" lg="6">
        <v-card flat rounded="lg">
          <div
            v-if="
              $single?.Schedule &&
              $single?.Schedule.length > 0 &&
              $single?.status !== 'finished'
            "
            class="d-flex bg-green-darken-1 pa-2 rounded-lg"
          >
            <InfoLabel
              title="Teleconsulta agendada para"
              font-size="1.1"
              font-size-content="1.1"
              :content="`${dayjs($single.Schedule[0]?.scheduleDate).format(
                'DD/MM/YYYY'
              )} as ${$single.Schedule[0].scheduleHour}`"
              :show-divider="false"
            />
          </div>
          <div
            v-else-if="$single?.status === 'finished'"
            class="d-flex bg-green-darken-1 pa-2 rounded-lg"
          >
            <InfoLabel
              :title="`Solicitação finalizada em ${dayjs(
                $single?.dateClose
              ).format('DD/MM/YYYY')}`"
              font-size="1.1"
              font-size-content="1.1"
              :show-divider="false"
              :content="`${
                $single?.PatientConsultationReport &&
                $single?.PatientConsultationReport?.status === 'signed'
                  ? 'Laudo médico disponível'
                  : 'Laudo médico Pendente Assinatura'
              }`"
            />
            <v-btn
              v-if="
                $single?.PatientConsultationReport &&
                $single?.PatientConsultationReport?.status === 'signed'
              "
              class="text-none font-weight-bold"
              prepend-icon="mdi-file-document-edit"
              @click="handleDownloadSignedFile($single)"
              variant="text"
              size="small"
            >
              Baixar Laudo
            </v-btn>
          </div>
          <SolicitationDetailsConsultation />
          <SolicitationDetailsPatient />
          <SolicitationDetailsOffice
            v-if="$currentUser?.profile?.type === 'ADMIN'"
          />
        </v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card flat rounded="lg">
          <div class="font-weight-bold mb-4 mt-4" style="font-size: 1.2rem">
            Descrição dos fatos
          </div>
          <div v-html="$single?.content" />
        </v-card>
        <SolicitationDetailsDocuments />
        <v-card flat rounded="lg">
          <div class="font-weight-bold mb-4 mt-4" style="font-size: 1.2rem">
            Motivos para correção
          </div>
          <div
            v-for="justify in $single?.PatientConsultationReport?.justifies"
            :key="justify.id"
            class="mb-2"
          >
            <strong> - {{ justify.justify }}</strong>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      v-if="$single?.PatientConsultationReport && showReport"
      dense
      class="px-4 mt-9"
    >
      <v-col
        v-if="
          $single?.PatientConsultationReport &&
          $single?.PatientConsultationReport?.status === 'signed'
        "
        cols="12"
      >
        <v-btn
          class="text-none font-weight-bold"
          prepend-icon="mdi-file-document-edit"
          @click="handleDownloadSignedFile($single)"
          variant="flat"
          color="success"
          size="small"
        >
          Baixar Laudo
        </v-btn>
      </v-col>
      <v-col cols="12">
        <SolicitationDetailsMedicReportVinculado :data="$single" />
      </v-col>
    </v-row>
    <DialogLoading :dialog="loading" />
  </v-card>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

defineProps({
  showVoltar: {
    type: Boolean,
    default: true,
  },
  showReport: {
    type: Boolean,
    default: true,
  },
});
const router = useRouter();
const storeConsultation = useSolicitationConsultationStore();

const authStore = useAuthStore();
const zapSign = useZapsignStore();

const $single = computed(() => storeConsultation.$single);
const $currentUser = computed(() => authStore.$currentUser);

const loading = ref(false);

const handleDownloadSignedFile = async (
  item: SolicitationConsultationProps
) => {
  if (!item.PatientConsultationReport) {
    push.error("Documento não assinado.");
    return;
  }

  loading.value = true;
  try {
    const { fileBlob, fileName } = await zapSign.getSignedFile(
      item.PatientConsultationReport.publicId!
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
</script>
