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
    </v-row>

    <Table
      v-if="$all?.consultations && $all?.consultations.length > 0 && !mobile"
      title=""
      :items="$all?.consultations"
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
    <SolicitationTableItemMobile
      v-else-if="
        $all?.consultations && $all?.consultations.length > 0 && mobile
      "
      @edit="getItemEdit($event)"
      @refresh="getConsultations"
    />
    <EmptyContent v-if="$all?.consultations.length === 0" />
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
  medicIsNull: false,
});

onMounted(async () => {
  const filters = getSolicitationsFilters();
  console.log("🚀 ~ filters:", filters);
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

  //let userId: number | undefined;

  // se for admin, gerente ou vendedor, busca pelo advogado selecionado
  // if (
  //   $currentUser.value?.profile?.type === "ADMIN" ||
  //   $currentUser.value?.profile?.type === "GERENTE" ||
  //   $currentUser.value?.profile?.type === "VENDEDOR"
  // ) {
  //   userId = modelFilters.value.lawyer?.id;
  // } else {
  //   userId = $currentUser.value?.id;
  // }
  //tratamento acima movido para api

  try {
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
