<template>
  <div class="pa-6">
    <HeaderPage
      title="Detalhes Solicitação"
      :font-size="mobile ? '1.2rem' : '1.8rem'"
    />
  </div>
  <CardBlur :hover="false">
    <v-row dense>
      <v-col cols="10" class="px-4">
        <span
          :style="`${mobile ? 'font-size: 1rem' : 'font-size: 1.5rem'}`"
          class="font-weight-bold text-primary"
        >
          #{{ $single?.id }}
        </span>
        <span
          :style="`${mobile ? 'font-size: 1rem' : 'font-size: 1.5rem'}`"
          class="text-primary"
        >
          Detalhes
        </span>
      </v-col>
      <v-col cols="12" lg="2" class="d-flex justify-end">
        <Button
          variant="outlined"
          color="grey"
          :class="mobile ? 'text-none mt-n9' : 'text-none'"
          size="small"
          @click="router.back()"
          v-if="showVoltar"
        >
          <v-icon icon="mdi-arrow-left" color="darkText" start />
          <span class="text-darkText text-caption"> Voltar </span>
        </Button>
      </v-col>
    </v-row>
    <v-row dense class="px-4">
      <v-divider />
      <v-col cols="12" lg="6">
        <v-card flat rounded="lg" class="px-2">
          <v-card
            height="120"
            v-if="
              $single?.Schedule &&
              $single?.Schedule.length > 0 &&
              $single?.status !== 'finished'
            "
            rounded="xl"
            style="border-top: 4px solid #f57f17"
            class="pa-2"
            elevation="2"
            flat
          >
            <v-card-title>
              <strong class="text-primary" style="font-size: 1.1rem">
                Teleconsulta agendada para
              </strong>
            </v-card-title>
            <v-card-text>
              <strong class="text-primary" style="font-size: 1rem">
                {{
                  `${dayjs($single.Schedule[0]?.scheduleDate).format(
                    "DD/MM/YYYY"
                  )} as ${$single?.Schedule?.[0]?.scheduleHour}`
                }}
              </strong>
            </v-card-text>
          </v-card>
          <v-card
            height="120"
            v-else-if="$single?.status === 'finished'"
            rounded="xl"
            style="border-top: 3px solid #4caf50"
            class="pa-2"
            elevation="2"
            flat
          >
            <v-card-title>
              <strong class="text-primary" style="font-size: 1.1rem">
                {{
                  `Solicitação finalizada em ${dayjs($single?.dateClose).format(
                    "DD/MM/YYYY"
                  )}`
                }}
              </strong>
            </v-card-title>
            <v-card-text>
              <strong class="text-primary" style="font-size: 1rem">
                {{
                  `${
                    $single?.PatientConsultationReport &&
                    $single?.PatientConsultationReport?.status === "signed"
                      ? "Laudo médico disponível"
                      : "Laudo médico Pendente Assinatura"
                  }`
                }}
              </strong>
            </v-card-text>
            <!-- <v-card-actions class="d-flex justify-end px-2">
              <Button
                v-if="
                  $single?.PatientConsultationReport &&
                  $single?.PatientConsultationReport?.status === 'signed'
                "
                class="text-none font-weight-bold"
                @click="handleDownloadSignedFile($single)"
                size="small"
                :variant="mobile ? 'text' : 'outlined'"
                color="white"
              >
                <v-icon
                  icon="mdi-file-document-edit"
                  color="colorIcon"
                  :start="!mobile"
                />
                <span class="text-caption"> Baixar Laudo </span>
              </Button>
            </v-card-actions> -->
          </v-card>
          <SolicitationDetailsConsultation />
          <SolicitationDetailsPatient />
          <SolicitationDetailsOffice
            v-if="$currentUser?.profile?.type === 'ADMIN'"
          />
        </v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card flat rounded="lg">
          <div
            class="font-weight-bold mb-4 mt-4 text-primary"
            :style="`${mobile ? 'font-size: 0.8rem' : 'font-size: 1.2rem'}`"
          >
            Descrição dos fatos
          </div>
          <div v-html="$single?.content" class="text-primary tiptap-content" />
        </v-card>
        <SolicitationDetailsDocuments />
        <v-card flat rounded="lg">
          <div
            class="font-weight-bold mb-4 mt-4 text-primary"
            :style="`${mobile ? 'font-size: 0.8rem' : 'font-size: 1.2rem'}`"
          >
            Motivos para correção
          </div>
          <div
            v-for="justify in $single?.PatientConsultationReport?.justifies"
            :key="justify.id"
            class="mb-2 text-primary"
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
        <Button
          v-if="
            $single?.PatientConsultationReport &&
            $single?.PatientConsultationReport?.status === 'signed'
          "
          class="text-none font-weight-bold"
          @click="handleDownloadSignedFile($single)"
          size="small"
          variant="outlined"
          color="primary"
        >
          <v-icon icon="mdi-file-document-edit" color="colorIcon" start />
          <span class="text-caption"> Baixar Laudo </span>
        </Button>
      </v-col>
      <v-col cols="12">
        <SolicitationDetailsMedicReportVinculado :data="$single" />
      </v-col>
      <v-col
        v-if="$single?.corrections && $single?.corrections.length > 0"
        cols="12"
      >
        <strong
          >Correções solicitadas ({{ $single?.corrections?.length }}):</strong
        >
      </v-col>
      <v-col v-for="item in $single?.corrections" :key="item.id" cols="12">
        <SolicitationDetailsCorrections :data="item" :solicitation="$single" />
      </v-col>
    </v-row>
  </CardBlur>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";
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

const { mobile } = useDisplay();

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
