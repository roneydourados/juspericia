<template>
  <div>
    <div
      class="font-weight-bold mb-4 mt-4 text-primary"
      :style="`${mobile ? 'font-size: 0.8rem' : 'font-size: 1.2rem'}`"
    >
      Documentos/Anexos
    </div>
    <div v-for="item in $single?.files" class="w-100 mt-4">
      <AttachementCard
        :file-name="item.fileName!"
        download-visible
        :delete-visible="$single?.status === 'open'"
        @download="handleDownloadFile(item.publicId!, item.fileName!)"
        @view="handleViewPdf(item)"
        @delete="getFileDelete(item)"
      />
    </div>
    <DialogLoading :dialog="loading" />

    <!-- Dialog para visualizar PDF -->
    <DialogForm
      title="Detalhes documento"
      :show="showPdfDialog"
      @dialog="showPdfDialog = false"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Visualizar PDF: {{ currentPdfName }}</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <iframe
            v-if="pdfUrl"
            :src="pdfUrl"
            width="100%"
            height="600px"
            frameborder="0"
          ></iframe>
        </v-card-text>
      </v-card>
    </DialogForm>
    <Dialog
      title="Confirmação"
      :dialog="showDelete"
      @cancel="showDelete = false"
      @confirm="handleDeleteFile"
      show-cancel
    >
      <span>
        Apagar documento
        <strong>{{ itemSelected?.fileName }}</strong> ?
      </span>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const storeConsultation = useSolicitationConsultationStore();
const fileStore = useFileStore();
const $single = computed(() => storeConsultation.$single);

const loading = ref(false);
const showDelete = ref(false);
const itemSelected = ref<FileProps>();

// Estados para o dialog de PDF
const showPdfDialog = ref(false);
const pdfUrl = ref("");
const currentPdfName = ref("");

const handleDownloadFile = async (publicId: string, fileName: string) => {
  loading.value = true;
  try {
    const resp = await fileStore.downloadAws(publicId);

    // Exemplo: Se o fileStore.download retornar um blob com metadados do nome do arquivo
    const url = window.URL.createObjectURL(resp.file);

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

const getFileDelete = (item: FileProps) => {
  itemSelected.value = item;
  showDelete.value = true;
};

const handleDeleteFile = async () => {
  if (!itemSelected.value) return;

  loading.value = true;
  try {
    await fileStore.removeAws(itemSelected.value.publicId!);
    await storeConsultation.show($single.value?.publicId!);
  } catch (error) {
    console.log("🚀 ~ handleDeleteFile ~ error:", error);
  } finally {
    loading.value = false;
    itemSelected.value = undefined;
    showDelete.value = false;
  }
};

// Novo método para visualizar PDF
const handleViewPdf = async (file: FileProps) => {
  try {
    loading.value = true;

    // Verifica se é um arquivo PDF
    const isPdf = file.fileName?.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      console.log("Este arquivo não é um PDF");
      return;
    }

    const response = await fileStore.downloadAws(file.publicId!);
    const blob = new Blob([response.file], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    pdfUrl.value = url;
    currentPdfName.value = file.fileName || "Documento";
    showPdfDialog.value = true;
  } catch (error) {
    console.error("Erro ao visualizar PDF:", error);
  } finally {
    loading.value = false;
  }
};

// Método para fechar o dialog e limpar recursos
const closePdfDialog = () => {
  showPdfDialog.value = false;
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value);
    pdfUrl.value = "";
  }
  currentPdfName.value = "";
};
</script>
