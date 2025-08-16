<template>
  <div class="pa-6">
    <HeaderPage title="Solicitação de consulta" font-size="1.8rem" />
  </div>
  <v-card flat rounded="xl" elevation="6" class="pa-6">
    <v-card-text>
      <FormCrud :on-submit="submitForm" :show-submit-button="false">
        <v-row dense>
          <v-col cols="12" lg="6">
            <SelectSearchConsultation
              v-model="form.consultation"
              required
              :clearable="true"
              @update:model-value="form.benefitTypeId = undefined"
            />
          </v-col>
          <v-col cols="12" lg="3">
            <AutoCompleteInput
              v-model="form.benefitTypeId"
              :items="$benefitTypes"
              item-title="name"
              item-value="id"
              label="Tipo de benefício"
              required
            />
            <!-- <SelectSearchBenefitType
              v-model="form.benefitType"
              required
              :clearable="true"
              show-new-button
            /> -->
          </v-col>
          <v-col cols="12" lg="3">
            <SelectSearchReportPurpose
              v-model="form.reportPurpose"
              required
              :clearable="true"
              @update:model-value="handleReportPurpose"
              show-new-button
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="6">
            <SelectSearchPatient
              v-model="form.patient"
              label="Paciente"
              required
              :clearable="true"
              show-new-Button
            />
          </v-col>
        </v-row>
        <v-row
          v-if="form.reportPurpose?.name?.toLowerCase() === 'judicial'"
          dense
        >
          <v-col cols="12" lg="3">
            <SelectInput
              label="Tipo de processo"
              :required="form.reportPurpose?.name?.toLowerCase() === 'judicial'"
              :items="judicialItems"
              item-title="name"
              item-value="value"
              :clearable="true"
              v-model="form.processSituation"
            >
              <template #items="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="String((item as any).raw.name)"
                  density="compact"
                />
              </template>

              <template #item-selection="{ item }">
                <div class="d-flex align-center">
                  {{ (item as any).raw.name }}
                </div>
              </template>
            </SelectInput>
          </v-col>
          <v-col v-if="form.processSituation === 'PA'" cols="12" lg="3">
            <StringInput
              label="Número do processo"
              v-model="form.judicialProcessNumber"
              :required="form.processSituation === 'PA'"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <span class="text-h6 font-weight-bold">
              Descrição da realidade dos fatos
            </span>
            <RitchTextEditor height="10" v-model="form.content" />
            <div class="d-flex flex-column mt-4">
              <input
                type="file"
                @input="handleFileUpload"
                style="display: none"
                ref="fileInput"
                multiple
              />
              <div class="d-flex justify-space-between flex-wrap w-100 px-2">
                <strong> Documentos: </strong>
                <Button
                  class="text-none font-weight-bold"
                  @click="($refs.fileInput as HTMLInputElement).click()"
                  size="small"
                  variant="outlined"
                  color="primary"
                >
                  <v-icon icon="mdi-paperclip" color="colorIcon" start />
                  <span class="text-caption"> Novo documento </span>
                </Button>

                <!-- <v-btn
                  color="primary"
                  flat
                  class="text-none"
                  size="small"
                  prepend-icon="mdi-paperclip"
                  @click="($refs.fileInput as HTMLInputElement).click()"
                >
                  Novo documento
                </v-btn> -->
              </div>
            </div>
            <div v-for="item in form.files" class="w-100 mt-4">
              <AttachementCard
                :file-name="item.fileName!"
                @delete="getFileDelete(item)"
                :download-visible="false"
              />
            </div>
          </v-col>
          <v-col cols="12" class="d-flex flex-column px-2">
            <v-switch
              v-model="form.factsRealityConfirm"
              color="info"
              hide-details
            >
              <template #label>
                <span>
                  Confirmo que as informações acima descritas, correspondem à
                  realidade dos fatos
                </span>
              </template>
            </v-switch>
            <v-divider class="mt-4" />
            <div class="d-flex mt-4" style="gap: 0.5rem">
              <Button
                class="text-none font-weight-bold"
                size="small"
                color="primary"
                type="submit"
                :disabled="!form.factsRealityConfirm"
              >
                <v-icon
                  icon="mdi-cloud-arrow-up-outline"
                  color="colorIcon"
                  start
                />
                <span class="text-caption"> Enviar </span>
              </Button>

              <Button
                @click="handleClose"
                size="small"
                color="grey"
                type="submit"
                variant="outlined"
              >
                <v-icon icon="mdi-cancel" color="red" start />
                <span class="text-caption text-primary"> Cancelar </span>
              </Button>

              <!-- <v-btn
                prepend-icon="mdi-check"
                color="primary"
                class="text-none"
                flat
                size="small"
                type="submit"
                :disabled="!form.factsRealityConfirm"
              >
                Enviar
              </v-btn> -->
              <!-- <v-btn
                prepend-icon="mdi-cancel"
                class="text-none"
                size="small"
                color="error"
                variant="flat"
                @click="handleClose"
              >
                Cancelar
              </v-btn> -->
            </div>
          </v-col>
        </v-row>
      </FormCrud>
    </v-card-text>
    <DialogLoading :dialog="loading" />
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
  </v-card>
</template>
<script setup lang="ts">
import dayjs from "dayjs";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => ({} as SolicitationConsultationProps),
  },
  showGoBack: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);
const { /*amountFormated,*/ getSolicitationsFilters } = useUtils();
//const { mobile } = useDisplay();
const router = useRouter();

const storeConsultation = useSolicitationConsultationStore();
const fileStore = useFileStore();

const loading = ref(false);
const showDelete = ref(false);
const selectedFile = ref<FileProps>();
const judicialItems = ref([
  {
    name: "Processo a distribuir",
    value: "PD",
  },
  {
    name: "Processo em andamento",
    value: "PA",
  },
]);

const form = ref({
  id: 0,
  benefitTypeId: undefined as number | undefined,
  consultation: undefined as ConsultationProps | undefined,
  patient: undefined as PatientProps | undefined,
  reportPurpose: undefined as ReportPurposeProps | undefined,
  processSituation: "",
  judicialProcessNumber: "",
  content: "",
  factsRealityConfirm: false,
  files: [] as FileProps[],
});

const filters = ref(getSolicitationsFilters());

const $single = computed(() => storeConsultation.$single);

onMounted(() => {
  if (props.data.id && props.show) {
    loadModel();
  } else {
    clearModel();
  }
});

const $benefitTypes = computed(() => {
  return form.value.consultation?.benefitTypes ?? [];
});

const clearModel = () => {
  form.value = {
    id: 0,
    benefitTypeId: undefined,
    consultation: undefined,
    patient: undefined,
    reportPurpose: undefined,
    processSituation: "",
    judicialProcessNumber: "",
    content: "",
    factsRealityConfirm: false,
    files: [],
  };
};

const loadModel = () => {
  form.value = {
    id: props.data.id!,
    consultation: props.data.Consultation,
    patient: props.data.Patient,
    reportPurpose: props.data.ReportPurpose,
    processSituation: props.data.processSituation ?? "",
    judicialProcessNumber: props.data.proccessNumber ?? "",
    content: props.data.content!,
    factsRealityConfirm: false,
    files: props.data.files as FileProps[],
    benefitTypeId: props.data.benefitTypeId ?? 0,
  };
};

const handleClose = async () => {
  clearModel();
  await router.push("/solicitations");
};

const submitForm = async () => {
  if (!form.value.content) {
    push.warning("Informe a descrição detalhada da realidade dos fatos.");
    return;
  }

  if (form.value.content.length < 100) {
    push.warning(
      "Informe a descrição detalhada da realidade dos fatos. Explicação está muito curta."
    );
    return;
  }

  loading.value = true;
  try {
    if (props.data.id) {
      await update();
    } else {
      await create();
    }
    await storeConsultation.index(filters.value);
    handleClose();
  } finally {
    loading.value = false;
  }
};

const create = async () => {
  try {
    await storeConsultation.create({
      consultationId: form.value.consultation?.id,
      patientId: form.value.patient?.id,
      benefitTypeId: form.value.benefitTypeId,
      reportPurposeId: form.value.reportPurpose?.id,
      processSituation: form.value.processSituation
        ? form.value.processSituation
        : undefined,
      content: form.value.content,
      proccessNumber: form.value.judicialProcessNumber
        ? form.value.judicialProcessNumber
        : undefined,
      dateOpen: dayjs().format("YYYY-MM-DD"),
      consultationValue: form.value.consultation?.value ?? 0,
      valueCredit: form.value.consultation?.valueCredit ?? 0,
    });

    if ($single.value?.id && form.value.files && form.value.files.length > 0) {
      const payload = form.value.files.map((attachment) => ({
        ...attachment,
        ownerId: $single.value?.id,
        fileCategory: "solicitation-consultation",
      }));

      //enviar arquivos
      await fileStore.uploadManyAws(payload);
    }
  } catch (error) {
    console.log("🚀 ~ create ~ error:", error);
  }
};

const update = async () => {
  try {
    await storeConsultation.update({
      publicId: props.data.publicId!,
      id: form.value.id,
      consultationId: form.value.consultation?.id,
      patientId: form.value.patient?.id,
      benefitTypeId: form.value.benefitTypeId,
      reportPurposeId: form.value.reportPurpose?.id,
      processSituation: form.value.processSituation
        ? form.value.processSituation
        : undefined,
      content: form.value.content,
      proccessNumber: form.value.judicialProcessNumber
        ? form.value.judicialProcessNumber
        : undefined,
      dateOpen: dayjs().format("YYYY-MM-DD"),
      consultationValue: form.value.consultation?.value ?? 0,
    });

    if ($single.value?.id && form.value.files && form.value.files.length > 0) {
      const payload: FileProps[] = form.value.files
        .filter(
          (
            attachment
          ): attachment is Omit<FileProps, "publicId"> | FileProps => {
            return !attachment.publicId;
          }
        )
        .map((attachment) => ({
          ...attachment,
          ownerId: $single.value?.id,
          fileCategory: "solicitation-consultation",
        }));

      if (payload && payload.length > 0) {
        //enviar arquivos
        await fileStore.uploadManyAws(payload);
      }
    }
  } catch (error) {
    console.log("🚀 ~ create ~ error:", error);
  }
};
const handleReportPurpose = () => {
  if (form.value.reportPurpose?.name?.toLowerCase() !== "judicial") {
    form.value.processSituation = "";
    form.value.judicialProcessNumber = "";
  }
};

const handleDeleteAttachment = async () => {
  showDelete.value = false;

  if (!selectedFile.value) return;

  loading.value = true;
  try {
    if (selectedFile.value.publicId) {
      await fileStore.removeAws(selectedFile.value.publicId);
      form.value.files = form.value.files.filter(
        (attachment) => attachment.fileName !== selectedFile.value?.fileName
      );
    } else {
      form.value.files = form.value.files.filter(
        (attachment) => attachment !== selectedFile.value
      );
    }
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (!files) return;

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const exists = form.value.files.some(
        (attachment) => attachment.fileName === (file?.name ?? "")
      );
      if (exists) {
        // push.warning(`Já existe um arquivo com o nome "${file.name}" anexado.`);
        continue;
      }
      form.value.files.push({
        fileCategory: "solicitation-consultation",
        fileData: file,
        fileName: file?.name ?? "unnamed_file",
      });
    }
  } catch (error) {
    console.log("🚀 ~ handleFileUpload ~ error:", error);
  } finally {
    input.value = ""; // Limpa o input de arquivo após o upload
  }
};

const getFileDelete = (item: FileProps) => {
  selectedFile.value = item;
  showDelete.value = true;
};
</script>
