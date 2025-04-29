<!-- 
 Formulário para manutenção e criação de laudos médicos
 -->
<template>
  <div>
    <v-card flat rounded="lg">
      <FormCrud :on-submit="handleSubmit" :show-submit-button="false">
        <v-card flat rounded="lg">
          <v-row dense class="pa-4">
            <v-col cols="12" lg="8">
              <SelectSearchReportModel
                v-model="model.reportModel"
                label="Carregar Modelo"
                @update:model-value="handleReportModel"
              />
            </v-col>

            <v-col
              cols="12"
              lg="4"
              class="d-flex align-center mt-n5"
              style="gap: 0.5rem"
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

              <v-btn
                variant="flat"
                color="info"
                prepend-icon="mdi-arrow-left"
                class="text-none"
                size="small"
                @click="emit('close')"
              >
                Voltar
              </v-btn>
              <v-btn
                color="primary"
                prepend-icon="mdi-check"
                type="submit"
                size="small"
                class="text-none"
                variant="flat"
              >
                Salvar
              </v-btn>
            </v-col>
          </v-row>
          <v-card-text>
            <RitchTextEditor v-model="model.content" />
            <v-card flat class="mt-4">
              <v-card-title class="mb-4">
                <input
                  type="file"
                  @change="handleFileUpload"
                  style="display: none"
                  ref="fileInput"
                />
                <div class="d-flex justify-space-between flex-wrap w-100 px-2">
                  <span> Anexos: </span>
                  <v-btn
                    color="primary"
                    flat
                    class="text-none"
                    size="small"
                    prepend-icon="mdi-paperclip"
                    @click="($refs.fileInput as HTMLInputElement).click()"
                  >
                    Novo anexo
                  </v-btn>
                </div>
              </v-card-title>
              <v-card-text>
                <v-row dense v-for="item in attachments">
                  <v-col cols="12">
                    <AttachementCard
                      :file-name="item.fileName!"
                      @delete="handleDeleteAttachment(item)"
                      :download-visible="false"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </FormCrud>
    </v-card>
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
    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["close"]);
//const { stringToHandlePDF } = useUtils();
const reportModelStore = useReportModelStore();
const scheduleStore = useScheduleStore();
const fileStore = useFileStore();
const patientConsultationReport = usePatientConsultationReportStore();
const solicitationStore = useSolicitationConsultationStore();

const showAlterContent = ref(false);
const loading = ref(false);
const model = ref({
  id: 0,
  title: "",
  content: "",
  reportModel: undefined as ReportModelProps | undefined,
});
const attachments = ref<FileProps[]>([]);

const $reportModel = computed(() => reportModelStore.$single);
const $sheduleConsultation = computed(() => scheduleStore.$single);
const $consultationSolicitation = computed(() => solicitationStore.$single);
const $consultationReport = computed(() => patientConsultationReport.$single);

onMounted(() => {
  if ($consultationSolicitation.value?.PatientConsultationReport?.content) {
    model.value.content =
      $consultationSolicitation.value?.PatientConsultationReport?.content;
  }
});

// const handlePDF = () => {
//   stringToHandlePDF(model.value.content);
// };

const handleSubmit = async () => {
  loading.value = true;
  try {
    await patientConsultationReport.create({
      content: model.value.content,
      patientConsultationId: $sheduleConsultation.value?.patientConsultationId,
      attachments: attachments.value,
    });

    if ($consultationReport.value?.id && attachments.value.length > 0) {
      const payload = attachments.value.map((attachment) => ({
        ...attachment,
        ownerId: $consultationReport.value?.id,
      }));

      await fileStore.uploadManyAws(payload);
    }

    await scheduleStore.update({
      publicId: $sheduleConsultation.value?.publicId,
      status: "completed",
    });
  } catch (error) {
    console.log("🚀 ~ handleSubmit laudo solicitação ~ error:", error);
  } finally {
    loading.value = false;
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
    attachments.value.push({
      fileCategory: "medical-report",
      fileData: files[0],
      fileName: files[0].name,
    });
  } catch (error) {
    console.log("🚀 ~ handleFileUpload ~ error:", error);
  } finally {
    input.value = ""; // Limpa o input de arquivo após o upload
  }
};

const handleDeleteAttachment = (item: FileProps) => {
  attachments.value = attachments.value.filter(
    (attachment) => attachment !== item
  );
};
</script>
