<template>
  <v-card flat>
    <v-card-title>
      <input
        type="file"
        @change="handleFileUpload"
        style="display: none"
        ref="fileInput"
      />
      <v-btn
        variant="flat"
        color="info"
        class="text-none"
        size="small"
        @click="($refs.fileInput as HTMLInputElement).click()"
      >
        <v-icon icon="mdi-attachment" start />
        Novo anexo
      </v-btn>
    </v-card-title>
    <v-card-text>
      <Table
        :headers="headers"
        :items="$files"
        itle="Documentos/Anexos"
        :show-crud="false"
      >
        <template v-slot:item.fileName="{ item }">
          <span class="text-info">{{ item.fileName }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-content-center">
            <v-btn
              icon
              color="info"
              variant="text"
              size="small"
              @click="handleDownloadFile(item.publicId)"
            >
              <v-icon icon="mdi-cloud-download-outline" size="20"></v-icon>
              <v-tooltip
                activator="parent"
                location="top center"
                content-class="tooltip-background"
              >
                Baixar arquivo
              </v-tooltip>
            </v-btn>

            <v-btn
              icon
              color="error"
              variant="text"
              size="small"
              @click="getFileDelete(item)"
            >
              <v-icon icon="mdi-delete-outline" size="20"></v-icon>
              <v-tooltip
                activator="parent"
                location="top center"
                content-class="tooltip-background"
              >
                Apagar arquivo
              </v-tooltip>
            </v-btn>
          </div>
        </template>
      </Table>
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
const headers = ref([
  { title: "Arquivo", key: "fileName" },
  { title: "Ações", key: "actions", sortable: false },
]);

const $patient = computed(() => patientStore.$single);
const $files = computed(() => fileStore.$files);

const handleFileUpload = async (event: Event) => {
  // const files = (event.target as HTMLInputElement).files;
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (!files) return;

  loading.value = true;
  try {
    await fileStore.uploadAws({
      fileCategory: "patient",
      fileData: files[0],
      fileName: files[0].name,
      ownerId: $patient.value?.id!,
    });

    await fileStore.index({
      fileCategory: "patient",
      ownerId: $patient.value?.id!,
    });
  } catch (error) {
    console.log("🚀 ~ handleFileUpload ~ error:", error);
  } finally {
    loading.value = false;
    input.value = ""; // Limpa o input de arquivo após o upload
  }
};

const handleDownloadFile = async (publicId: string) => {
  loading.value = true;
  try {
    const { file, fileName } = await fileStore.download(publicId);

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
    await fileStore.remove(itemSelected.value.publicId!);

    await fileStore.index({
      fileCategory: "patient",
      ownerId: $patient.value?.id!,
    });
  } catch (error) {
    console.log("🚀 ~ handleDeleteFile ~ error:", error);
  } finally {
    loading.value = false;
    itemSelected.value = undefined;
    showDelete.value = false;
  }
};
</script>
