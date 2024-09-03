<template>
  <v-card flat rounded="lg" color="transparent" class="px-6">
    <v-card-title class="mb-12 d-flex align-center justify-space-between">
      <div class="d-flex flex-column flex-wrap">
        <span class="font-weight-bold text-h5"> Solicitações </span>
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
        <span v-if="!mobile"> Pendentes </span>
      </v-tab>
      <v-tab :value="2" class="text-none">
        <v-icon icon="mdi-clock-start" size="24" start />
        <span v-if="!mobile"> Em andamento </span>
      </v-tab>
      <v-tab :value="3" class="text-none">
        <v-icon icon="mdi-clock-check-outline" size="24" start />
        <span v-if="!mobile"> Agendado </span>
      </v-tab>
      <v-tab :value="4" class="text-none">
        <v-icon icon="mdi-calendar-month-outline" size="24" start />
        <span v-if="!mobile">Finalizadas </span>
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-card-text>
      <!-- <EmptyContent v-if="$all.length <= 0" /> -->
      <v-row v-for="item in $all" :key="item.id" dense>
        <v-col cols="12">
          <SolicitationTableItem
            :solicitation="item"
            @edit="getItemEdit($event)"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

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

//const { getSolicitationsFilters, setSolicitationsFilters } = useUtils();
const rounter = useRouter();
const { mobile } = useDisplay();
const storeConsultation = useSolicitationConsultationStore();
const $all = computed(() => storeConsultation.$all);
const tab = ref(1);

const loading = ref(false);
const showFilters = ref(false);
// const selected = ref<SolicitationConsultationProps>();

const modelFilters = ref<SolicitationConsultationFilterProps>({
  status: "open",
  initialDateSolicitation: moment().startOf("month").format("YYYY-MM-DD"),
  finalDateSolicitation: moment().endOf("month").format("YYYY-MM-DD"),
  benefitType: undefined as BenefitTypeProps | undefined,
  patient: undefined as PatientProps | undefined,
  reportPurpose: undefined as ReportPurposeProps | undefined,
});

onMounted(async () => {
  await search();
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
  }
  //setSolicitationsFilters(modelFilters.value);
  await search();
};

const search = async () => {
  setTimeout(async () => {
    loading.value = true;
    try {
      await storeConsultation.index(modelFilters.value);
    } finally {
      loading.value = false;
    }
  }, 500);
};

const getItemEdit = async (item: SolicitationConsultationProps) => {
  loading.value = true;
  try {
    await storeConsultation.show(item.id!);
    await rounter.push("/solicitations/edit");
    //selected.value = storeConsultation.$single;
    //showForm.value = true;
  } finally {
    loading.value = false;
  }
};

// const handleCloseForm = () => {
//   showForm.value = false;
//   selected.value = undefined;
// };
</script>
