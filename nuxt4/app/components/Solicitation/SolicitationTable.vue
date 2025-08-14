<template>
  <v-card flat rounded="lg" color="transparent" class="px-6">
    <v-card-title class="mb-12 d-flex align-center justify-space-between">
      <div class="d-flex flex-column w-100">
        <HeaderPage title="Solicitações" font-size="1.5rem" />
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
          <v-col cols="1">
            <Button
              color="primary"
              size="small"
              variant="flat"
              class="text-none"
              @click="getConsultations"
            >
              <v-icon icon="mdi-filter-outline" color="colorIcon" start />
              <span class="text-caption"> Filtrar </span>
            </Button>
          </v-col>
        </v-row>
      </div>
      <div class="d-flex aling-center" style="gap: 0.5rem">
        <Button
          class="text-none"
          color="primary"
          size="small"
          variant="outlined"
          flat
          @click="showFilters = !showFilters"
        >
          <v-icon icon="mdi-filter-cog-outline" color="colorIcon" start />
          <span class="text-caption"> Mais filtros </span>
        </Button>
      </div>
    </v-card-title>
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
          color="colorIcon"
        />
        <span v-if="!mobile"> Abertas </span>
        <span class="text-info font-weight-bold">
          ({{ getQuantity("open") }})
        </span>
      </v-tab>
      <v-tab value="payment_pending" class="text-none">
        <v-icon icon="mdi-cash-clock" size="24" start color="colorIcon" />
        <span v-if="!mobile"> Pendente de pagamento </span>
        <span class="text-info font-weight-bold">
          ({{ getQuantity("payment_pending") }})
        </span>
      </v-tab>
      <v-tab value="paid" class="text-none">
        <v-icon icon="mdi-cash-check" size="24" start color="colorIcon" />
        <span v-if="!mobile"> Paga </span>
        <span class="text-info font-weight-bold">
          ({{ getQuantity("paid") }})
        </span>
      </v-tab>
      <v-tab value="scheduled" class="text-none">
        <v-icon
          icon="mdi-clock-check-outline"
          size="24"
          start
          color="colorIcon"
        />
        <span v-if="!mobile"> Agendado </span>
        <span class="text-info font-weight-bold">
          ({{ getQuantity("scheduled") }})
        </span>
      </v-tab>
      <v-tab value="canceled" class="text-none">
        <v-icon icon="mdi-cancel" size="24" start color="colorIcon" />
        <span v-if="!mobile">Canceladas </span>
        <span class="text-info font-weight-bold">
          ({{ getQuantity("canceled") }})
        </span>
      </v-tab>
      <v-tab value="finished" class="text-none">
        <v-icon
          icon="mdi-calendar-month-outline"
          size="24"
          color="colorIcon"
          start
        />
        <span v-if="!mobile">Finalizadas </span>
        <span class="text-info font-weight-bold"
          >({{ getQuantity("finished") }})</span
        >
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-card-text>
      <div v-if="$all?.consultations && $all?.consultations.length > 0">
        <Table
          title=""
          :items="$all?.consultations"
          hide-dfault-header
          :headers="headers"
          :showCrud="false"
          :items-per-page="10"
        >
          <template v-slot:item.status="{ item }">
            <div class="py-8">
              <SolicitationTableItem
                :solicitation="item"
                @edit="getItemEdit($event)"
              />
            </div>
          </template>
        </Table>
      </div>
      <EmptyContent head-line="Sem solicitações" v-else />
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
import dayjs from "dayjs";
import { useDisplay } from "vuetify";

const { getSolicitationsFilters, setSolicitationsFilters } = useUtils();
const rounter = useRouter();
const { mobile } = useDisplay();
const storeConsultation = useSolicitationConsultationStore();
const auth = useAuthStore();
const $all = computed(() => storeConsultation.$all);
const $currentUser = computed(() => auth.$currentUser);
const tab = ref("open");
const loading = ref(false);
const showFilters = ref(false);

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

  let userId: number | undefined;

  // se for admin, gerente ou vendedor, busca pelo advogado selecionado
  if (
    $currentUser.value?.profile?.type === "ADMIN" ||
    $currentUser.value?.profile?.type === "GERENTE" ||
    $currentUser.value?.profile?.type === "VENDEDOR"
  ) {
    userId = modelFilters.value.lawyer?.id;
  } else {
    userId = $currentUser.value?.id;
  }

  try {
    const filter = {
      ...modelFilters.value,
      userId,
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
