<template>
  <DialogForm
    title="Detalhes  do Laudo"
    :show="dialog"
    @dialog="dialog = false"
    ok-text="OK"
    :width="mobile ? '100%' : '60%'"
    border-color="#002c9b"
    fullscreen
  >
    <v-card rounded="lg" flat>
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <strong>Dados do Paciente:</strong>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="6">
            <InfoLabel
              title="Paciente"
              :content="`${$report?.PatientConsultation?.Patient?.name}`"
              font-size-content="0.8"
            />
          </v-col>
          <v-col cols="12" lg="3">
            <InfoLabel
              title="Data geração laudo"
              :content="`${
                $report?.reportDate
                  ? dayjs($report?.reportDate).format('DD/MM/YYYY')
                  : 'Não informado'
              }`"
              font-size-content="0.8"
            />
          </v-col>
          <v-col cols="12" lg="3">
            <InfoLabel
              title="CPF"
              :content="
                formatCPFOrCNPJ(
                  $report?.PatientConsultation?.Patient?.cpf ?? ''
                )
              "
              font-size-content="0.8"
            />
          </v-col>
        </v-row>
        <v-row dense class="mt-4">
          <v-col cols="12">
            <strong>Laudo:</strong>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <div
              v-html="$report?.content"
              style="max-height: 25rem; overflow-y: auto"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="item in $report?.attachments" :key="item.id" cols="12">
            <AttachementCard
              :file-name="item.fileName!"
              download-visible
              @download="handleDownloadFile(item.publicId!, item.fileName!)"
              :delete-visible="false"
              :view-visible="false"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <DialogLoading :dialog="loading" />
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";
const fileStore = useFileStore();
const consultationReport = usePatientConsultationReportStore();
const { formatCPFOrCNPJ } = useUtils();
const { mobile } = useDisplay();

const dialog = defineModel({
  default: false,
});

const loading = ref(false);

const $report = computed(() => consultationReport.$single);

const handleDownloadFile = async (publicId: string, fileName: string) => {
  loading.value = true;
  try {
    const { file } = await fileStore.downloadAws(publicId);

    // Exemplo: Se o fileStore.download retornar um blob com metadados do nome do arquivo
    const url = window.URL.createObjectURL(file);

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
    console.log("🚀 ~ handleDownloadFile ~ error:", error);
  } finally {
    loading.value = false;
  }
};
</script>
