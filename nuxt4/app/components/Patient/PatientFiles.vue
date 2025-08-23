<template>
  <v-card flat>
    <v-card-text>
      <input
        multiple
        type="file"
        @change="handleFileUpload"
        style="display: none"
        ref="fileInput"
      />
      <Button
        variant="outlined"
        color="grey"
        size="small"
        @click="($refs.fileInput as HTMLInputElement).click()"
      >
        <v-icon icon="mdi-attachment" color="colorIcon" start />
        <span class="text-caption text-primary"> Novo anexo </span>
      </Button>
      <div v-for="item in fileList" class="w-100 mt-4">
        <AttachementCard
          :file-name="item.fileName!"
          download-visible
          :delete-visible="true"
          @download="handleDownloadFile(item.publicId!, item.fileName!)"
          @delete="getFileDelete(item)"
        />
      </div>
    </v-card-text>
  </v-card>
  <Dialog
    title="Confirmação"
    :dialog="showDelete"
    @cancel="showDelete = false"
    @confirm="handleDeleteFile"
    show-cancel
  >
    <span>
      Apagar arquivo
      <strong>{{ itemSelected?.fileName }}</strong> ?
    </span>
  </Dialog>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const fileStore = useFileStore();
const patientStore = usePatientStore();

const loading = ref(false);
const showDelete = ref(false);
const itemSelected = ref<FileProps>();
const fileList = ref<FileProps[]>([]);

const $patient = computed(() => patientStore.$single);

watch(
  () => $patient.value?.files,
  (newFiles) => {
    if (newFiles) {
      fileList.value = newFiles;
    }
  },
  { immediate: true }
);

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (!files) return;

  loading.value = true;
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const exists = fileList.value.some(
        (attachment) => attachment.fileName === file?.name
      );
      if (exists) {
        // push.warning(`Já existe um arquivo com o nome "${file.name}" anexado.`);
        continue;
      }
      fileList.value.push({
        fileCategory: "patient",
        ownerId: $patient.value?.id!,
        fileData: file,
        fileName: file?.name,
      });
    }

    if (fileList.value.length > 0) {
      await fileStore.uploadManyAws(fileList.value);
    }
    await patientStore.show($patient.value?.publicId!);
  } catch (error) {
    console.log("🚀 ~ handleFileUpload ~ error:", error);
  } finally {
    input.value = ""; // Limpa o input de arquivo após o upload
    loading.value = false;
  }
};

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

const getFileDelete = (item: FileProps) => {
  itemSelected.value = item;
  showDelete.value = true;
};

const handleDeleteFile = async () => {
  if (!itemSelected.value) return;

  loading.value = true;
  try {
    await fileStore.removeAws(itemSelected.value.publicId!);
    await patientStore.show($patient.value?.publicId!);
  } catch (error) {
    console.log("🚀 ~ handleDeleteFile ~ error:", error);
  } finally {
    loading.value = false;
    itemSelected.value = undefined;
    showDelete.value = false;
  }
};
</script>
