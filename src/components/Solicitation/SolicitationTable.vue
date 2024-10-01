<template>
  <v-card flat rounded="lg" color="transparent" class="px-6">
    <v-card-title class="mb-12 d-flex align-center justify-space-between">
      <div class="d-flex flex-column w-100">
        <HeaderPage title="Solicitações" />
        <v-row class="mt-4" dense>
          <v-col v-if="$currentUser?.Profile.type === 'ADMIN'" cols="12" lg="3">
            <SelectgetConsultationsLawyer
              label="Escritório/Advogado"
              v-model="modelFilters.lawyer"
              @update:model-value="getConsultations"
              clearable
            />
          </v-col>
          <v-col cols="12" lg="2">
            <DatePicker
              v-model="modelFilters.initialDateSolicitation"
              label="Data inicial"
              outlined
              dense
            />
          </v-col>
          <v-col cols="12" lg="2">
            <DatePicker
              v-model="modelFilters.finalDateSolicitation"
              label="Data final"
              outlined
              dense
            />
          </v-col>
          <v-col cols="1">
            <v-btn
              icon
              color="info"
              size="small"
              variant="flat"
              @click="getConsultations"
            >
              <v-icon icon="mdi-reload" />
              <v-tooltip
                activator="parent"
                location="top center"
                content-class="tooltip-background"
              >
                Atualizar dados
              </v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <div class="d-flex aling-center" style="gap: 0.5rem">
        <v-btn
          class="text-none"
          color="primary"
          size="small"
          prepend-icon="mdi-filter"
          @click="showFilters = !showFilters"
        >
          Mais filtros
        </v-btn>
      </div>
    </v-card-title>
    <v-tabs
      v-model="tab"
      :grow="mobile"
      @update:model-value="handleChangeTable"
    >
      <v-tab :value="1" class="text-none">
        <v-icon icon="mdi-file-clock-outline" size="24" start />
        <span v-if="!mobile">
          Pendentes
          <span class="text-info font-weight-bold">
            ({{ getQuantity("open") }})
          </span>
        </span>
      </v-tab>
      <v-tab :value="3" class="text-none">
        <v-icon icon="mdi-clock-check-outline" size="24" start />
        <span v-if="!mobile"> Agendado </span>
        <span class="text-info font-weight-bold">
          ({{ getQuantity("scheduled") }})
        </span>
      </v-tab>
      <v-tab :value="2" class="text-none">
        <v-icon icon="mdi-clock-start" size="24" start />
        <span v-if="!mobile"> Em andamento </span>
        <span class="text-info font-weight-bold">
          ({{ getQuantity("in_progress") }})
        </span>
      </v-tab>
      <v-tab :value="4" class="text-none">
        <v-icon icon="mdi-calendar-month-outline" size="24" start />
        <span v-if="!mobile">Finalizadas </span>
        <span class="text-info font-weight-bold"
          >({{ getQuantity("finished") }})</span
        >
      </v-tab>
      <v-tab :value="5" class="text-none">
        <v-icon icon="mdi-cancel" size="24" start />
        <span v-if="!mobile">Canceladas </span>
        <span class="text-info font-weight-bold">
          ({{ getQuantity("canceled") }})
        </span>
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-card-text>
      <v-row v-for="item in $all?.consultations" :key="item.id" dense>
        <v-col cols="12">
          <SolicitationTableItem
            :solicitation="item"
            @edit="getItemEdit($event)"
          />
        </v-col>
      </v-row>
      <EmptyContent v-if="$all?.consultations.length === 0" />
    </v-card-text>
  </v-card>
  <SolicitationFilters
    v-model:drawer="showFilters"
    v-model:filters="modelFilters"
    @update:model-value="getConsultations"
  />
  <DialogLoading :dialog="loading" />
  <!-- <pre>{{ modelFilters }}</pre> -->
</template>

<script setup lang="ts">
import moment from "moment";
import { useDisplay } from "vuetify";

const { getSolicitationsFilters, setSolicitationsFilters } = useUtils();
const rounter = useRouter();
const { mobile } = useDisplay();
const storeConsultation = useSolicitationConsultationStore();
const auth = useAuthStore();
const $all = computed(() => storeConsultation.$all);
const $currentUser = computed(() => auth.$currentUser);
const tab = ref(1);
const loading = ref(false);
const showFilters = ref(false);

const modelFilters = ref<SolicitationConsultationFilterProps>({
  status: "open",
  initialDateSolicitation: moment().startOf("year").format("YYYY-MM-DD"),
  finalDateSolicitation: moment().endOf("year").format("YYYY-MM-DD"),
  benefitType: undefined as BenefitTypeProps | undefined,
  patient: undefined as PatientProps | undefined,
  reportPurpose: undefined as ReportPurposeProps | undefined,
  lawyer: undefined as UserProps | undefined,
});

onMounted(async () => {
  const filters = getSolicitationsFilters();
  if (filters) {
    modelFilters.value = {
      ...filters,
      status: "open",
    };

    setSolicitationsFilters(modelFilters.value);
  }
});

const handleChangeTable = async () => {
  switch (tab.value) {
    case 1:
      modelFilters.value.status = "open";
      break;
    case 2:
      modelFilters.value.status = "in_progress";
      break;
    case 3:
      modelFilters.value.status = "scheduled";
      break;
    case 4:
      modelFilters.value.status = "finished";
      break;
    case 5:
      modelFilters.value.status = "canceled";
      break;
  }
  setSolicitationsFilters(modelFilters.value);
  await getConsultations();
};

const getQuantity = (status: string) => {
  if (!$all.value || !$all.value.totals) return 0;

  const quantity = $all.value?.totals.find((item) => {
    return item.status === status;
  });

  if (quantity) {
    return quantity.total;
  }

  return 0;
};

const getConsultations = async () => {
  loading.value = true;
  try {
    const filter = {
      ...modelFilters.value,
      userId: modelFilters.value.lawyer?.id,
      benefitTypeId: modelFilters.value.benefitType?.id,
      patientId: modelFilters.value.patient?.id,
      reportPurposeId: modelFilters.value.reportPurpose?.id,
    };

    await storeConsultation.index(filter);
  } finally {
    loading.value = false;
  }
};

const getItemEdit = async (item: SolicitationConsultationProps) => {
  loading.value = true;
  try {
    await storeConsultation.show(item.publicId!);
    await rounter.push("/solicitations/edit");
  } finally {
    loading.value = false;
  }
};
</script>
