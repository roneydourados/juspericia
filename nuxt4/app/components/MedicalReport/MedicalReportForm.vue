<template>
  <v-row dense>
    <v-col cols="12">
      <v-card flat rounded="lg" height="100%">
        <FormCrud :on-submit="handleSubmit" :show-submit-button="false">
          <v-card flat rounded="lg">
            <v-row dense class="pa-4">
              <v-col cols="12">
                <SelectSearchReportModel
                  v-model="model.reportModel"
                  label="Carregar Modelo"
                  @update:model-value="handleReportModel"
                />
              </v-col>

              <v-col
                cols="12"
                class="d-flex align-center justify-space-between"
              >
                <v-btn
                  icon
                  variant="text"
                  class="text-none"
                  size="small"
                  @click="handleChatGpt"
                >
                  <ChatGptIcon height="28" />
                  <v-tooltip
                    activator="parent"
                    location="top center"
                    content-class="tooltip-background"
                  >
                    Perguntar para o ChatGPT
                  </v-tooltip>
                </v-btn>

                <div class="d-flex flex-wrap" style="gap: 0.54rem">
                  <Button
                    variant="outlined"
                    color="grey"
                    class="text-none"
                    size="small"
                    @click="emit('close')"
                  >
                    <v-icon icon="mdi-arrow-left" color="darkText" />
                    <span class="text-darkText text-caption"> Voltar </span>
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    size="small"
                    class="text-none"
                    variant="flat"
                  >
                    <v-icon icon="mdi-check" color="colorIcon" />
                    <span class="text-caption"> Salvar </span>
                  </Button>
                </div>
              </v-col>
            </v-row>
            <v-card-text>
              <TextEditor v-model="model.content" />
              <!-- <v-card flat class="mt-4">
                <v-card-title class="mb-4">
                  <input
                    type="file"
                    @change="handleFileUpload"
                    style="display: none"
                    ref="fileInput"
                    multiple
                  />
                  <div
                    class="d-flex justify-space-between flex-wrap w-100 px-2"
                  >
                    <span> Anexos: </span>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      @click="($refs.fileInput as HTMLInputElement).click()"
                    >
                      <v-icon icon="mdi-paperclip" color="colorIcon" />
                      <span class="text-caption"> Novo Anexo </span>
                    </Button>
                  </div>
                </v-card-title>
                <v-card-text>
                  <v-row dense v-for="item in attachments">
                    <v-col cols="12">
                      <AttachementCard
                        :file-name="item.fileName!"
                        @delete="getFileDelete(item)"
                        :download-visible="false"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card> -->
            </v-card-text>
          </v-card>
        </FormCrud>
      </v-card>
    </v-col>
    <v-col cols="12">
      <SolicitationDetails :show-voltar="false" :show-report="false" />
    </v-col>
    <Dialog
      title="Alterar conteúdo"
      :dialog="showAlterContent"
      show-cancel
      @cancel="showAlterContent = false"
      @confirm="getReportModelContent"
    >
      Já existe um conteúdo informado neste laudo, tem certeza que deseja
      alterá-lo?
    </Dialog>
    <Dialog
      title="Confirmação"
      :dialog="showDelete"
      @cancel="showDelete = false"
      @confirm="handleDeleteAttachment"
      show-cancel
    >
      <span>
        Apagar documento
        <strong>{{ selectedFile?.fileName }}</strong> ?
      </span>
    </Dialog>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object as () => PatientConsultationReportListProps,
    default: () => ({}),
  },
});

const emit = defineEmits(["close"]);
const reportModelStore = useReportModelStore();
//const scheduleStore = useScheduleStore();
const fileStore = useFileStore();
const patientConsultationReport = usePatientConsultationReportStore();
const solicitationStore = useSolicitationConsultationStore();
const auth = useAuthStore();

const showAlterContent = ref(false);

const model = ref({
  publicId: "",
  title: "",
  content: "",
  reportModel: undefined as ReportModelProps | undefined,
});

const showDelete = ref(false);
const loading = ref(false);
const selectedFile = ref<FileProps>();
const attachments = ref<FileProps[]>([]);

const $reportModel = computed(() => reportModelStore.$single);
const $consultationSolicitation = computed(() => solicitationStore.$single);
const $consultationReport = computed(() => patientConsultationReport.$single);
const $currentUser = computed(() => auth.$currentUser);

watch(
  () => props.data,
  (newData) => {
    if (newData.id) {
      model.value.publicId = newData.reportPublicId || "";
      model.value.content = newData.reportContent || "";
      attachments.value = $consultationReport.value?.attachments || [];
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  if (!$consultationSolicitation.value || !$consultationSolicitation.value.id) {
    console.error("Patient consultation ID is required.");
    return;
  }

  try {
    let atendentId = undefined;

    if ($currentUser.value?.profile?.type === "ATENDENTE") {
      atendentId = $currentUser.value.id;
    }

    if (props.data.reportPublicId) {
      await patientConsultationReport.update({
        content: model.value.content,
        publicId: props.data.reportPublicId,
        atendentId,
      });
    } else {
      await patientConsultationReport.create({
        content: model.value.content,
        patientConsultationId: $consultationSolicitation.value.id,
        atendentId,
      });
    }
  } catch (error) {
    console.log("🚀 ~ handleSubmit laudo solicitação ~ error:", error);
  } finally {
    emit("close");
  }
};

const handleReportModel = async () => {
  if (!model.value.reportModel?.publicId) return;

  await reportModelStore.show(model.value.reportModel?.publicId);

  // caso ainda não exista conteúdo então carregar do modelo na primeira seleção
  if (!model.value.content) {
    getReportModelContent();
  } else {
    // caso contrário perguntar se o usuário deseja alterar o conteúdo
    showAlterContent.value = true;
  }
};

const getReportModelContent = () => {
  model.value.content = $reportModel.value?.content || "";
  showAlterContent.value = false;
};

const handleChatGpt = () => {
  window.open("https://chatgpt.com", "_blank");
};

const handleFileUpload = (event: Event) => {
  // const files = (event.target as HTMLInputElement).files;
  // if (!files) return;
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (!files) return;

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const exists = attachments.value.some(
        (attachment) => attachment.fileName === (file?.name ?? "")
      );
      if (exists) {
        // push.warning(`Já existe um arquivo com o nome "${file.name}" anexado.`);
        continue;
      }
      attachments.value.push({
        fileCategory: "medical-report",
        fileData: file,
        fileName: file?.name ?? "",
      });
    }
  } catch (error) {
    console.log("🚀 ~ handleFileUpload ~ error:", error);
  } finally {
    input.value = ""; // Limpa o input de arquivo após o upload
  }
};

const handleDeleteAttachment = async () => {
  showDelete.value = false;

  if (!selectedFile.value) return;

  loading.value = true;
  try {
    if (selectedFile.value.publicId) {
      await fileStore.removeAws(selectedFile.value.publicId);
      attachments.value = attachments.value.filter(
        (attachment) => attachment.fileName !== selectedFile.value?.fileName
      );
    } else {
      attachments.value = attachments.value.filter(
        (attachment) => attachment !== selectedFile.value
      );
    }
  } finally {
    loading.value = false;
  }
};

const getFileDelete = (item: FileProps) => {
  selectedFile.value = item;
  showDelete.value = true;
};
</script>
