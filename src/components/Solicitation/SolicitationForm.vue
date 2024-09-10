<template>
  <v-card flat rounded="lg" class="pa-6">
    <v-card-title class="d-flex align-center justify-space-between pa-4">
      <strong style="font-size: 1.2rem">Solicitação de consulta</strong>

      <v-btn
        prepend-icon="mdi-arrow-left"
        class="text-none"
        size="small"
        color="primary"
        @click="handleClose"
      >
        voltar
      </v-btn>
    </v-card-title>
    <v-card-text>
      <FormCrud :on-submit="submitForm" :show-submit-button="false">
        <v-row dense>
          <v-col cols="12" lg="6">
            <SelectSearchConsultation
              v-model="form.consultation"
              required
              :clearable="true"
            />
          </v-col>
          <!-- <v-col
            v-if="form.consultation"
            cols="12"
            lg="6"
            class="d-flex flex-wrap"
            style="gap: 0.5rem"
          >
            <v-chip
              label
              color="success"
              variant="outlined"
              :style="mobile ? 'width: 100%' : ''"
            >
              <div class="d-flex" style="gap: 0.5rem">
                <strong>Preço</strong>
                <strong>
                  {{ amountFormated(form.consultation?.value ?? 0, true) }}
                </strong>
              </div>
            </v-chip>
            <v-chip
              label
              color="warning"
              variant="outlined"
              :style="mobile ? 'width: 100%' : ''"
            >
              <div class="d-flex" style="gap: 0.5rem">
                <strong>Preço no crédito</strong>
                <strong>
                  {{
                    amountFormated(form.consultation?.valueCredit ?? 0, true)
                  }}
                </strong>
              </div>
            </v-chip>
            <v-chip
              label
              color="info"
              variant="outlined"
              :style="mobile ? 'width: 100%' : ''"
            >
              <div class="d-flex" style="gap: 0.5rem">
                <strong>Valor p/ atencipar</strong>
                <strong>
                  {{
                    amountFormated(
                      form.consultation?.valueAntecipation ?? 0,
                      true
                    )
                  }}
                </strong>
              </div>
            </v-chip>
          </v-col> -->
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="6">
            <SelectSearchPatient
              v-model="form.patient"
              label="Paciente"
              required
              :clearable="true"
            />
          </v-col>
          <v-col cols="12" lg="3">
            <SelectSearchBenefitType
              v-model="form.benefitType"
              required
              :clearable="true"
              show-new-button
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
            <CKEditor v-model="form.content" />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <v-switch
              v-model="form.factsRealityConfirm"
              color="info"
              label="Confirmo que as informações acima descritas, correspondem à realidade dos fatos"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="1">
            <v-btn
              block
              prepend-icon="mdi-check"
              color="primary"
              class="text-none"
              flat
              size="small"
              type="submit"
              :disabled="!form.factsRealityConfirm"
            >
              Salvar
            </v-btn>
          </v-col>
        </v-row>
      </FormCrud>
    </v-card-text>
    <DialogLoading :dialog="loading" />
  </v-card>
</template>
<script setup lang="ts">
import moment from "moment";
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
const { amountFormated, getSolicitationsFilters } = useUtils();
const { mobile } = useDisplay();
const router = useRouter();

const storeConsultation = useSolicitationConsultationStore();

const loading = ref(false);
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
  consultation: undefined as ConsultationProps | undefined,
  patient: undefined as PatientProps | undefined,
  benefitType: undefined as BenefitTypeProps | undefined,
  reportPurpose: undefined as ReportPurposeProps | undefined,
  processSituation: "",
  judicialProcessNumber: "",
  content: "",
  factsRealityConfirm: false,
});

const filters = ref(getSolicitationsFilters());

onMounted(() => {
  if (props.data.id && props.show) {
    loadModel();
  } else {
    clearModel();
  }
});

const clearModel = () => {
  form.value = {
    id: 0,
    consultation: undefined,
    patient: undefined,
    benefitType: undefined,
    reportPurpose: undefined,
    processSituation: "",
    judicialProcessNumber: "",
    content: "",
    factsRealityConfirm: false,
  };
};

const loadModel = () => {
  form.value = {
    id: props.data.id!,
    consultation: props.data.Consultation,
    patient: props.data.Patient,
    benefitType: props.data.BenefitType,
    reportPurpose: props.data.ReportPurpose,
    processSituation: props.data.processSituation ?? "",
    judicialProcessNumber: props.data.proccessNumber ?? "",
    content: props.data.content!,
    factsRealityConfirm: false,
  };
};

const handleClose = () => {
  clearModel();
  router.push("/solicitations");
};

const submitForm = async () => {
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
      benefitTypeId: form.value.benefitType?.id,
      reportPurposeId: form.value.reportPurpose?.id,
      processSituation: form.value.processSituation
        ? form.value.processSituation
        : undefined,
      content: form.value.content,
      proccessNumber: form.value.judicialProcessNumber
        ? form.value.judicialProcessNumber
        : undefined,
      dateOpen: moment().format("YYYY-MM-DD"),
      consultationValue: form.value.consultation?.value ?? 0,
    });
  } catch (error) {
    console.log("🚀 ~ create ~ error:", error);
  }
};

const update = async () => {
  try {
    await storeConsultation.update({
      id: form.value.id,
      consultationId: form.value.consultation?.id,
      patientId: form.value.patient?.id,
      benefitTypeId: form.value.benefitType?.id,
      reportPurposeId: form.value.reportPurpose?.id,
      processSituation: form.value.processSituation
        ? form.value.processSituation
        : undefined,
      content: form.value.content,
      proccessNumber: form.value.judicialProcessNumber
        ? form.value.judicialProcessNumber
        : undefined,
      dateOpen: moment().format("YYYY-MM-DD"),
      consultationValue: form.value.consultation?.value ?? 0,
    });
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
</script>
