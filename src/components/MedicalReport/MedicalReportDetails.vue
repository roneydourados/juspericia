<template>
  <v-dialog v-model="dialog" transition="dialog-bottom-transition" width="50%">
    <v-card rounded="lg">
      <v-toolbar>
        <v-toolbar-title>
          <div class="text-subtitle-1 font-weight-bold">Detalhes do laudo</div>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialog = false" variant="text">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-toolbar>
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
              :content="`${data.PatientConsultation?.Patient?.name} ${data.PatientConsultation?.Patient?.surname}`"
              font-size-content="0.8"
            />
          </v-col>
          <v-col cols="12" lg="3">
            <InfoLabel
              title="Data abertura"
              :content="
                dayjs(data.PatientConsultation?.createdAt).format('DD/MM/YYYY')
              "
              font-size-content="0.8"
            />
          </v-col>
          <v-col cols="12" lg="3">
            <InfoLabel
              title="CPF"
              :content="
                formatCPFOrCNPJ(data.PatientConsultation?.Patient?.cpf ?? '')
              "
              font-size-content="0.8"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <strong>Anexos:</strong>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col v-for="attachent in data.attachments" cols="12">
            <AttachementCard
              :file-name="attachent.fileName!"
              :delete-visible="false"
              @download="handleDownloadFile(attachent.publicId!)"
            />
          </v-col>
        </v-row>
        <!-- <pre>{{ data }}</pre> -->
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
defineProps({
  data: {
    type: Object as PropType<PatientConsultationReportProps>,
    default: {},
  },
});

const fileStore = useFileStore();
const { formatCPFOrCNPJ } = useUtils();

const dialog = defineModel({
  default: false,
});

const handleDownloadFile = async (publicId: string) => {
  try {
    const data = await fileStore.downloadAws(publicId);
    const url = window.URL.createObjectURL(data.file);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", data.fileName); // You can set the file name here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log("🚀 ~ handleDownloadFile ~ error:", error);
  }
};
</script>
