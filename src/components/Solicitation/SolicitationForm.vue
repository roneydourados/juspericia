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
          <v-col
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
          </v-col>
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
            />
          </v-col>
          <v-col cols="12" lg="3">
            <SelectSearchReportPurpose
              v-model="form.reportPurpose"
              required
              :clearable="true"
              @update:model-value="handleReportPurpose"
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
    <!-- <pre>{{ form }}</pre> -->
  </v-card>
</template>
<script setup lang="ts">
import { useDisplay } from "vuetify";
const emit = defineEmits(["close"]);
const { amountFormated } = useUtils();
const { mobile } = useDisplay();
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
  consultation: undefined as ConsultationProps | undefined,
  patient: undefined as PatientProps | undefined,
  benefitType: undefined as BenefitTypeProps | undefined,
  reportPurpose: undefined as ReportPurposeProps | undefined,
  processSituation: "",
  judicialProcessNumber: "",
  content: "",
  factsRealityConfirm: false,
});

const handleClose = () => {
  emit("close");
};

const submitForm = async () => {
  console.log("submit form");
};

const handleReportPurpose = () => {
  if (form.value.reportPurpose?.name?.toLowerCase() !== "judicial") {
    form.value.processSituation = "";
    form.value.judicialProcessNumber = "";
  }
};
</script>
