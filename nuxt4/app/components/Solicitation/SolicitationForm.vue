<template>
  <div class="pa-6">
    <HeaderPage
      title="Solicitação de consulta"
      :font-size="mobile ? '1rem' : '1.8rem'"
    />
  </div>
  <CardBlur :class="mobile ? 'pa-0' : 'pa-6'" :hover="false">
    <template #content>
      <FormCrud :on-submit="submitForm" :show-submit-button="false">
        <v-row dense>
          <v-col cols="12" lg="6">
            <SelectSearchConsultation
              v-model="form.consultation"
              required
              :clearable="true"
              @update:model-value="handleUpdateConsultation"
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
          <v-col cols="12" lg="3">
            <SelectSearchMedicalSpecialty
              v-if="form.selectOtherSpecialty"
              v-model="form.medicalSpecialty"
              required
            />
            <v-chip
              v-else
              class="w-100"
              variant="outlined"
              size="large"
              color="grey"
            >
              <div class="w-100 d-flex flex-column pa-1">
                <div class="text-caption text-primary">
                  Especialidade médica
                </div>
                <div class="w-100">
                  {{ form.medicalSpecialty?.medicalSpecialty }}
                </div>
              </div>
            </v-chip>
          </v-col>
          <v-col v-if="!form.id" cols="12" lg="3">
            <Button
              v-if="!form.selectOtherSpecialty"
              variant="outlined"
              color="grey"
              @click="handleSelectOtherSpecialty"
              :disabled="$isSelectMedicalSpecialty"
            >
              <v-icon icon="mdi-medical-bag" color="colorIcon" />
              <span class="text-caption text-primary">
                Selecionar outra especialidade
              </span>
            </Button>
            <Button
              v-else
              variant="outlined"
              color="grey"
              @click="handleDefaultMedicalSpecialty"
              :disabled="$isSelectMedicalSpecialty"
            >
              <v-icon icon="mdi-medical-bag" color="colorIcon" />
              <span class="text-caption text-primary"> Voltar padrão </span>
            </Button>
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
            <span class="text-subtitle-2 text-lg-h6">
              Descrição da realidade dos fatos
            </span>
            <TextEditor v-model="form.content" />
            <div class="d-flex flex-column mt-4">
              <input
                type="file"
                @input="handleFileUpload"
                style="display: none"
                ref="fileInput"
                multiple
                accept=".pdf"
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
                <span class="text-caption text-lg-subtitle-1">
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
            </div>
          </v-col>
        </v-row>
      </FormCrud>
    </template>
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

    <Dialog title="Documentação inválida" :dialog="isInValidFiles" okText="OK">
      <div class="text-red font-weight-bold" style="font-size: 1.2rem">
        Identificamos que o presente pedido está sendo enviado sem a
        documentação mínima necessária para a elaboração do laudo médico
        pericial. Sem essa documentação, o pedido não poderá ser processado.
      </div>
    </Dialog>
  </CardBlur>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";

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
const { mobile } = useDisplay();
const router = useRouter();

const authStore = useAuthStore();
const saltCredit = useUserCreditSaltStore();
const storeConsultation = useSolicitationConsultationStore();
const sistemParametersStore = useSystemParametersStore();
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
  medicalSpecialty: undefined as MedicalSpecialtyProps | undefined,
  selectOtherSpecialty: false,
});

const filters = ref(getSolicitationsFilters());
const isInValidFiles = ref(true);
const $currentUser = computed(() => authStore.$currentUser);
const $single = computed(() => storeConsultation.$single);
const $systemParameters = computed(() => sistemParametersStore.$parameters);
//const $userCreditTotalSalt = computed(() => saltCredit.$userCreditTotalSalt);
const $isSelectMedicalSpecialty = computed(() => {
  if (!form.value.consultation) return true;

  // return (
  //   form.value.consultation &&
  //   Number($userCreditTotalSalt.value?.totalSalt ?? 0) >=
  //     Number(form.value.consultation.valueCredit ?? 0) +
  //       Number(form.value.medicalSpecialty?.value ?? 0)
  // );
});

onMounted(async () => {
  await sistemParametersStore.index();
  await saltCredit.getTotalSalt($currentUser.value?.publicId!);

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
    medicalSpecialty: $systemParameters.value?.medicalSpecialty,
    selectOtherSpecialty: false,
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
    medicalSpecialty: props.data.medicalSpecialty,
    selectOtherSpecialty: false,
  };
};

const handleClose = async () => {
  clearModel();
  await router.push("/solicitations");
};

const submitForm = async () => {
  isInValidFiles.value = false;

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

  if (form.value.files.length === 0) {
    push.warning("Informe ao menos um documento.");
    isInValidFiles.value = true;
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
      medicalSpecialtyId: form.value.medicalSpecialty?.id,
      medicalSpecialtyValue: form.value.medicalSpecialty?.value,
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
      medicalSpecialtyId: form.value.medicalSpecialty?.id,
      medicalSpecialtyValue: form.value.medicalSpecialty?.value,
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

  isInValidFiles.value = false;

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

const handleUpdateConsultation = () => {
  form.value.benefitTypeId = undefined;
  handleDefaultMedicalSpecialty();
};

const handleSelectOtherSpecialty = () => {
  //form.value.medicalSpecialty = undefined;
  form.value.selectOtherSpecialty = true;
};

const handleDefaultMedicalSpecialty = () => {
  form.value.medicalSpecialty = $systemParameters.value?.medicalSpecialty;
  form.value.selectOtherSpecialty = false;
};
</script>
