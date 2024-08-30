<template>
  <v-card v-if="!showForm" flat rounded="lg" color="transparent" class="px-6">
    <v-card-title class="mb-12 d-flex align-center justify-space-between">
      <div class="d-flex flex-column flex-wrap">
        <span class="font-weight-bold text-h5"> Solicitações </span>
        <span class="text-grey-darken-3" style="font-size: 0.8rem">
          Filtros: Data inicial:
          {{
            moment(modelFilters.initialDateSolicitation).format("DD/MM/YYYY")
          }}
          - Data final:
          {{ moment(modelFilters.finalDateSolicitation).format("DD/MM/YYYY") }},
          Paciente: {{ modelFilters.patient?.name ?? "Todos" }}, Tipo de
          Benefício: {{ modelFilters.benefitType?.name ?? "Todos" }},
          Finalidade: {{ modelFilters.reportPurpose?.name ?? "Todos" }}, Status:
          {{ getStatusName() }}
        </span>
      </div>

      <div class="d-flex aling-center" style="gap: 0.5rem">
        <v-btn
          class="text-none"
          color="primary"
          size="small"
          prepend-icon="mdi-plus"
          @click="showForm = true"
        >
          Nova solicitação
        </v-btn>
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
        <span v-if="!mobile"> Pendentes </span>
      </v-tab>
      <v-tab :value="2" class="text-none">
        <v-icon icon="mdi-file-check-outline" size="24" start />
        <span v-if="!mobile"> Agendadas </span>
      </v-tab>
      <v-tab :value="3" class="text-none">
        <v-icon icon="mdi-calendar-month-outline" size="24" start />
        <span v-if="!mobile">Finalizadas </span>
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-card-text>
      <v-row v-for="item in $all" :key="item.id" dense>
        <v-col cols="12">
          <SolicitationTableItem
            :solicitation="item"
            @edit="getItemEdit($event)"
          />
        </v-col>
      </v-row>
      <EmptyContent v-if="!$all" />
    </v-card-text>
  </v-card>

  <SolicitationForm
    v-else
    @close="handleCloseForm"
    :show="showForm"
    :data="selected"
  />
  <SolicitationFilters
    v-model:drawer="showFilters"
    v-model:filters="modelFilters"
    @update:model-value="search"
  />
  <DialogLoading :dialog="loading" />
  <!-- <pre>{{ modelFilters }}</pre> -->
</template>

<script setup lang="ts">
import moment from "moment";
import { useDisplay } from "vuetify";

const { getSolicitationsFilters, setSolicitationsFilters } = useUtils();
const { mobile } = useDisplay();
const storeConsultation = useSolicitationConsultationStore();
const $all = computed(() => storeConsultation.$all);
const tab = ref(1);
const showForm = ref(false);
const loading = ref(false);
const showFilters = ref(false);
const selected = ref<SolicitationConsultationProps>();
const modelFilters = ref(getSolicitationsFilters());

// const modelFilters = ref<SolicitationConsultationFilterProps>({
//   status: "open",
//   initialDateSolicitation: moment().startOf("month").format("YYYY-MM-DD"),
//   finalDateSolicitation: moment().endOf("month").format("YYYY-MM-DD"),
//   benefitType: undefined as BenefitTypeProps | undefined,
//   patient: undefined as PatientProps | undefined,
//   reportPurpose: undefined as ReportPurposeProps | undefined,
// });

onMounted(async () => {
  await search();
});

const handleChangeTable = async () => {
  switch (tab.value) {
    case 1:
      modelFilters.value.status = "open";
      break;
    case 2:
      modelFilters.value.status = "scheduled";
      break;
    case 3:
      modelFilters.value.status = "closed";
      break;
  }
  setSolicitationsFilters(modelFilters.value);
  await search();
};

const getStatusName = () => {
  switch (modelFilters.value.status) {
    case "open":
      return "Pendente";
    case "scheduled":
      return "Agendada";
    case "closed":
      return "Finalizada";
    default:
      return "Pendente";
  }
};

const search = async () => {
  loading.value = true;
  try {
    await storeConsultation.index(modelFilters.value);
  } finally {
    loading.value = false;
  }
};

const getItemEdit = async (item: SolicitationConsultationProps) => {
  loading.value = true;
  try {
    await storeConsultation.show(item.id!);
    selected.value = storeConsultation.$single;
    showForm.value = true;
  } finally {
    loading.value = false;
  }
};

const handleCloseForm = () => {
  showForm.value = false;
  selected.value = undefined;
};
</script>
