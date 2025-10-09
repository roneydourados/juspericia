<template>
  <div>
    <div
      class="font-weight-bold mb-4 mt-4 text-primary d-flex align-center justify-space-between"
      :style="`${mobile ? 'font-size: 0.8rem' : 'font-size: 1.2rem'}`"
    >
      Documentos/Anexos
      <Button
        variant="outlined"
        color="primary"
        size="small"
        @click="handleDownloadMergedFiles"
      >
        Baixar todos
      </Button>
    </div>
    <div v-for="item in $single?.files" class="w-100 mt-4">
      <AttachementCard
        :file-name="`${item.fileName!} - ${dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}`"
        download-visible
        :delete-visible="$single?.status === 'open'"
        @download="handleDownloadFile(item.publicId!, item.fileName!)"
        @view="handleViewPdf(item)"
        @delete="getFileDelete(item)"
      />
    </div>
    <DialogLoading :dialog="loading" />
    <DialogForm
      title="Detalhes documento"
      :show="showPdfDialog"
      @dialog="showPdfDialog = false"
      fullscreen
    >
      <iframe
        v-if="pdfUrl"
        :src="pdfUrl"
        style="height: 100dvh; width: 100%"
        frameborder="0"
      />
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
import dayjs from "dayjs";
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

const handleDownloadMergedFiles = async () => {
  if (!$single.value || !$single.value?.id) return;

  loading.value = true;
  try {
    const { file, fileName } = await fileStore.downloadMergedFiles({
      fileCategory: "solicitation-consultation",
      ownerId: $single.value.id,
    });

    // Exemplo: Se o fileStore.download retornar um blob com metadados do nome do arquivo
    const url = window.URL.createObjectURL(file);

    // Cria um link temporário
    const link = document.createElement("a");
    link.href = url;

    // Define o nome do arquivo
    link.download = `${fileName}.pdf`;

    // Adiciona e clica no link
    document.body.appendChild(link);
    link.click();

    // Remove o link temporário
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao baixar arquivos mesclados:", error);
  } finally {
    loading.value = false;
  }
};
</script>
