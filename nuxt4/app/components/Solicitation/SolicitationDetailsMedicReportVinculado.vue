<template>
  <v-card flat rounded="lg">
    <div class="font-weight-bold mb-4 mt-4" style="font-size: 1.2rem">
      {{
        data?.PatientConsultationReport?.status === "signed"
          ? "Laudo médico atual"
          : "Laudo médico (assinatura pendente)"
      }}
    </div>
    <div v-html="data?.PatientConsultationReport?.content" />
    <div
      v-if="
        data?.PatientConsultationReport?.attachments &&
        data?.PatientConsultationReport?.attachments.length > 0
      "
      class="mt-4"
    >
      <strong>Anexos</strong>
    </div>
    <v-row>
      <v-col
        v-for="item in data?.PatientConsultationReport?.attachments"
        :key="item.id"
        cols="12"
      >
        <AttachementCard
          :file-name="item.fileName!"
          download-visible
          @download="handleDownloadFile(item.publicId!, item.fileName!)"
          :delete-visible="false"
        />
      </v-col>
    </v-row>
    <DialogLoading :dialog="loading" />
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  data: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: {},
  },
});

const fileStore = useFileStore();

const loading = ref(false);

//baixar qualquer arquivo disponível para download
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
