<!-- 
 Formulário para manutenção e criação de laudos médicos
 -->
<template>
  <div>
    <v-card flat rounded="lg">
      <FormCrud :on-submit="handleSubmit" :show-submit-button="false">
        <v-card flat rounded="lg">
          <v-row dense class="pa-4">
            <v-col cols="12" lg="7">
              <SelectSearchReportModel
                v-model="model.reportModel"
                label="Carregar Modelo"
                @update:model-value="handleReportModel"
              />
            </v-col>
            <v-col cols="12" lg="2" />
            <v-col
              cols="12"
              lg="3"
              class="d-flex justify-end"
              style="gap: 0.5rem"
            >
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
                color="info"
                prepend-icon="mdi-printer"
                size="small"
                variant="flat"
                class="text-none"
                @click="handlePDF"
              >
                Imprimir
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
            <CKEditor v-model="model.content" />
          </v-card-text>
        </v-card>
      </FormCrud>
      <pre>{{ $sheduleConsultation }}</pre>
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
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["close"]);
const { stringToHandlePDF } = useUtils();
const reportModelStore = useReportModelStore();
const scheduleStore = useScheduleStore();
const patientConsultationReport = usePatientConsultationReportStore();
const solicitationStore = useSolicitationConsultationStore();

const model = ref({
  id: 0,
  title: "",
  content: "",
  reportModel: undefined as ReportModelProps | undefined,
});
const showAlterContent = ref(false);

const $reportModel = computed(() => reportModelStore.$single);
const $sheduleConsultation = computed(() => scheduleStore.$single);
const $consultationSolicitation = computed(() => solicitationStore.$single);

onMounted(() => {
  if ($consultationSolicitation.value?.PatientConsultationReport?.content) {
    model.value.content =
      $consultationSolicitation.value?.PatientConsultationReport?.content;
  }
});

const handlePDF = () => {
  stringToHandlePDF(model.value.content);
};

const handleSubmit = async () => {
  await patientConsultationReport.create({
    content: model.value.content,
    patientConsultationId: $sheduleConsultation.value?.patientConsultationId,
  });

  await scheduleStore.update({
    publicId: $sheduleConsultation.value?.publicId,
    status: "completed",
  });

  emit("close");
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
</script>
