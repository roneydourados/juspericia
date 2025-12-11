<template>
  <div :class="mobile ? 'px-0' : 'px-4'">
    <v-row>
      <v-col cols="12">
        <HeaderPage title="Solicitações" font-size="1.8rem" />
      </v-col>
    </v-row>
    <v-row class="mt-4" dense>
      <v-col
        v-if="
          $currentUser?.profile?.type === 'ADMIN' ||
          $currentUser?.profile?.type === 'GERENTE' ||
          $currentUser?.profile?.type === 'VENDEDOR'
        "
        cols="12"
        lg="3"
      >
        <SelectSearchLawyer
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
      <v-col v-if="mobile" cols="12">
        <SelectInput
          label="Status"
          v-model="modelFilters.status"
          item-title="text"
          item-value="value"
          :items="[
            { text: 'Abertas', value: 'open' },
            { text: 'Finalizada', value: 'finished' },
            { text: 'Cancelada', value: 'canceled' },
            { text: 'Paga', value: 'paid' },
            { text: 'Agendada', value: 'scheduled' },
            { text: 'Pendente de pagamento', value: 'payment_pending' },
          ]"
          @update:model-value="getConsultations"
        />
      </v-col>
      <v-col
        cols="12"
        lg="5"
        class="d-flex align-center mt-n5"
        style="gap: 0.5rem"
      >
        <Button
          color="primary"
          size="small"
          variant="flat"
          @click="getConsultations"
        >
          <v-icon icon="mdi-filter-outline" color="colorIcon" start />
          <span class="text-caption"> Filtrar </span>
        </Button>
        <Button
          color="primary"
          size="small"
          variant="outlined"
          flat
          @click="showFilters = !showFilters"
        >
          <v-icon icon="mdi-filter-cog-outline" color="colorIcon" start />
          <span class="text-caption"> Mais filtros </span>
        </Button>
        <v-switch
          v-if="$currentUser?.profile?.type === 'ADMIN'"
          v-model="modelFilters.medicIsNull"
          hide-details
          label="Não vinculados"
          color="green"
          @update:model-value="getConsultations"
        />
      </v-col>
    </v-row>
    <v-row v-if="!mobile">
      <v-col cols="12">
        <v-tabs
          v-model="tab"
          :grow="mobile"
          color="grey-darken-2"
          @update:model-value="handleChangeTable"
        >
          <v-tab value="open" class="text-none">
            <v-icon
              icon="mdi-file-clock-outline"
              size="24"
              start
              color="primary"
            />
            <span v-if="!mobile" class="text-primary"> Abertas </span>
            <span class="text-info" style="font-weight: 500">
              ({{ getQuantity("open") }})
            </span>
          </v-tab>
          <v-tab value="payment_pending" class="text-none">
            <v-icon icon="mdi-cash-clock" size="24" start color="primary" />
            <span v-if="!mobile" class="text-primary">
              Pendente de pagamento
            </span>
            <span class="text-info" style="font-weight: 500">
              ({{ getQuantity("payment_pending") }})
            </span>
          </v-tab>
          <v-tab value="paid" class="text-none">
            <v-icon icon="mdi-currency-usd" size="24" start color="primary" />
            <span v-if="!mobile" class="text-primary"> Paga </span>
            <span class="text-info" style="font-weight: 500">
              ({{ getQuantity("paid") }})
            </span>
          </v-tab>
          <v-tab value="scheduled" class="text-none">
            <v-icon
              icon="mdi-clock-check-outline"
              size="24"
              start
              color="primary"
            />
            <span v-if="!mobile" class="text-primary"> Agendado </span>
            <span class="text-info" style="font-weight: 500">
              ({{ getQuantity("scheduled") }})
            </span>
          </v-tab>
          <v-tab value="canceled" class="text-none">
            <v-icon icon="mdi-cancel" size="24" start color="primary" />
            <span v-if="!mobile" class="text-primary">Canceladas </span>
            <span class="text-info" style="font-weight: 500">
              ({{ getQuantity("canceled") }})
            </span>
          </v-tab>
          <v-tab value="finished" class="text-none">
            <v-icon
              icon="mdi-calendar-month-outline"
              size="24"
              color="primary"
              start
            />
            <span v-if="!mobile" class="text-primary">Finalizadas </span>
            <span class="text-info" style="font-weight: 500">
              ({{ getQuantity("finished") }})
            </span>
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="12" style="padding-right: 8rem">
        <SolicitationTableLocalFilters
          :showReportStatus="tab === 'finished'"
          v-model="localFilters"
        />
      </v-col>
    </v-row>
    <Table
      v-if="
        displayConsultations?.consultations &&
        displayConsultations?.consultations.length > 0
      "
      title=""
      :items="displayConsultations?.consultations"
      hide-dfault-header
      :headers="headers"
      :showCrud="false"
      :items-per-page="10"
    >
      <template v-slot:item.status="{ item }">
        <SolicitationTableItem
          :solicitation="item"
          @edit="getItemEdit($event)"
          @refresh="getConsultations"
        />
      </template>
    </Table>
    <!-- <SolicitationTableItemMobile
      v-else-if="
        displayConsultations?.consultations &&
        displayConsultations?.consultations.length > 0 &&
        mobile
      "
      @edit="getItemEdit($event)"
      @refresh="getConsultations"
    /> -->
    <EmptyContent v-if="displayConsultations?.consultations.length === 0" />
  </div>
  <SolicitationFilters
    v-model:drawer="showFilters"
    v-model:filters="modelFilters"
    @update:model-value="getConsultations"
  />
  <DialogLoading :dialog="loading" />
  <!-- <ScheduleCalendar /> -->
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";

const { getSolicitationsFilters, setSolicitationsFilters } = useUtils();
const rounter = useRouter();
const { mobile } = useDisplay();
const storeConsultation = useSolicitationConsultationStore();
const auth = useAuthStore();
//const $all = computed(() => storeConsultation.$all);
const $currentUser = computed(() => auth.$currentUser);
const tab = ref("open");
const loading = ref(false);
const showFilters = ref(false);

// Variáveis para filtros locais
const localFilters = ref({
  reportStatus: "report_all",
  solicitationId: "",
});

// Computed que aplica os filtros localmente
const filteredConsultations = computed(() => {
  if (!storeConsultation.$all?.consultations) return storeConsultation.$all;

  let filtered = [...storeConsultation.$all.consultations];

  // Filtro por reportStatus
  if (localFilters.value.reportStatus !== "report_all") {
    switch (localFilters.value.reportStatus) {
      case "signature_pending":
        filtered = filtered.filter(
          (consultation) =>
            consultation.PatientConsultationReport?.status === "sign-pending"
        );
        break;
      case "report_pending":
        filtered = filtered.filter(
          (consultation) => !consultation.PatientConsultationReport
        );
        break;
      case "report_ready":
        filtered = filtered.filter(
          (consultation) =>
            consultation.PatientConsultationReport?.status === "signed"
        );
        break;
    }
  }

  // Filtro por solicitationId (opcional)
  if (localFilters.value.solicitationId) {
    filtered = filtered.filter((consultation) =>
      consultation.id?.toString().includes(localFilters.value.solicitationId)
    );
  }

  return {
    ...storeConsultation.$all,
    consultations: filtered,
  };
});

// Computed que substitui $all?.consultations no template
const displayConsultations = computed(() => {
  // Se não há filtros ativos, retorna os dados originais
  if (
    localFilters.value.reportStatus === "report_all" &&
    !localFilters.value.solicitationId
  ) {
    return storeConsultation.$all;
  }

  return filteredConsultations.value;
});

const headers = ref([
  {
    title: "",
    key: "status",
  },
]);

const modelFilters = ref<SolicitationConsultationFilterProps>({
  status: "open",
  initialDateSolicitation: dayjs().subtract(3, "month").format("YYYY-MM-DD"),
  finalDateSolicitation: dayjs().endOf("month").format("YYYY-MM-DD"),
  benefitType: undefined as BenefitTypeProps | undefined,
  patient: undefined as PatientProps | undefined,
  reportPurpose: undefined as ReportPurposeProps | undefined,
  lawyer: undefined as UserProps | undefined,
  medicIsNull: false,
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
  modelFilters.value.status = tab.value;
  setSolicitationsFilters(modelFilters.value);
  await getConsultations();
};

const getQuantity = (status: string) => {
  if (!displayConsultations.value || !displayConsultations.value.totals)
    return 0;

  const quantity = displayConsultations.value?.totals.find((item) => {
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
    localFilters.value = {
      reportStatus: "report_all",
      solicitationId: "",
    };

    const filter = {
      ...modelFilters.value,
      userId: modelFilters.value.lawyer?.id,
      benefitTypeId: modelFilters.value.benefitType?.id,
      patientId: modelFilters.value.patient?.id,
      reportPurposeId: modelFilters.value.reportPurpose?.id,
      medicIsNull: modelFilters.value.medicIsNull,
    };

    await storeConsultation.index(filter);

    setSolicitationsFilters(modelFilters.value);
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
