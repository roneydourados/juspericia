<template>
  <div>
    <div
      class="font-weight-bold mb-4 mt-4"
      style="font-size: 1.2rem; font-weight: 700"
    >
      Documentos/Anexos
    </div>
    <div v-for="item in $single?.files" class="w-100 mt-4">
      <AttachementCard
        :file-name="item.fileName!"
        download-visible
        :delete-visible="$single?.status === 'open'"
        @download="handleDownloadFile(item.publicId!, item.fileName!)"
        @delete="getFileDelete(item)"
      />
    </div>
    <DialogLoading :dialog="loading" />
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
const storeConsultation = useSolicitationConsultationStore();
const fileStore = useFileStore();
const $single = computed(() => storeConsultation.$single);

const loading = ref(false);
const showDelete = ref(false);
const itemSelected = ref<FileProps>();

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
</script>
