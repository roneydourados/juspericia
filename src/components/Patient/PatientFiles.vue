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
          </div>
        </template>
      </Table>
    </v-card-text>
    <!-- <pre>{{ $files }}</pre> -->
  </v-card>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const fileStore = useFileStore();
const patientStore = usePatientStore();

const loading = ref(false);
const headers = ref([
  { title: "Arquivo", key: "fileName" },
  { title: "Ações", key: "actions", sortable: false },
]);

const $patient = computed(() => patientStore.$single);
const $files = computed(() => fileStore.$files);

const handleFileUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  loading.value = true;
  try {
    await fileStore.upload({
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
  }
};

const handleDownloadFile = async (publicId: string) => {
  loading.value = true;
  try {
    const data = await fileStore.download(publicId);
    console.log("🚀 ~ handleDownloadFile ~ data:", data);

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
  } finally {
    loading.value = false;
  }
};
</script>
