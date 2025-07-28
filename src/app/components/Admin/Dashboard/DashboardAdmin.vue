<template>
  <v-card flat rounded="lg">
    <v-card-title class="pa-4 mb-8">
      <Tabs
        v-model="tabRegion"
        :tabs="tabsRegion"
        @update:model-value="handleChangeRegion"
      />
      <Tabs
        v-model="tabDate"
        :tabs="tabsDate"
        align-tabs="center"
        @update:model-value="handleDateChange"
      />
      <DashboardAdminFilters v-model:filters="modelFilters" />
      <v-divider></v-divider>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <DashboardAdminCards />
        </v-col>
        <v-col cols="12">
          <DahsboardAdminYearbBillingChart />
        </v-col>
      </v-row>
      <v-row dense no-gutters>
        <v-col cols="12" lg="6">
          <DashboardAdminPaymentFormChart />
        </v-col>
        <v-col cols="12" lg="6">
          <DashboardAdminSolicitationStatus />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="4">
          <DashboardAdminMedicHours />
        </v-col>
        <v-col cols="12" lg="4">
          <DashboardAdminMedicRateRange />
        </v-col>
        <v-col cols="12" lg="4">
          <DashboardAdminMedicReportRevision />
        </v-col>
      </v-row>
    </v-card-text>
    <DialogLoading :dialog="loading" />
  </v-card>
</template>

<script setup lang="ts">
import { TabProps } from "@/app/types/Tab";
import dayjs from "dayjs";

const tabRegion = ref(1);
const tabDate = ref(1);
const loading = ref(false);

const dash = useUserAdminStore();

const tabsDate = ref<TabProps[]>([
  {
    title: "Hoje",
    icon: "mdi-check-decagram-outline",
  },
  {
    title: "Semana",
    icon: "mdi-chart-line-variant",
  },
  {
    title: "Mês",
    icon: "mdi-calendar-month-outline",
  },
  {
    title: "Ano",
    icon: "mdi-chart-bell-curve-cumulative",
  },
]);

const tabsRegion = ref<TabProps[]>([
  {
    title: "Todos",
    icon: "mdi-poll",
  },
  {
    title: "Norte",
    icon: "mdi-chart-arc",
  },
  {
    title: "Nordeste",
    icon: "mdi-chart-donut",
  },
  {
    title: "Centro-Oeste",
    icon: "mdi-chart-sankey",
  },
  {
    title: "Sul",
    icon: "mdi-chart-bell-curve",
  },
  {
    title: "Sudeste",
    icon: "mdi-chart-multiline",
  },
]);

const modelFilters = ref<AdminDashBoardSalesFilterProps>({
  initialDate: dayjs().format("YYYY-MM-DD"),
  finalDate: dayjs().format("YYYY-MM-DD"),
  ufs: [],
});

const handleChangeRegion = async () => {
  switch (tabRegion.value) {
    case 2:
      modelFilters.value.ufs = ["AC", "AP", "AM", "PA", "RO", "RR", "TO"];
      break;
    case 3:
      modelFilters.value.ufs = [
        "AL",
        "BA",
        "CE",
        "MA",
        "PB",
        "PE",
        "PI",
        "RN",
        "SE",
      ];
      break;
    case 4:
      modelFilters.value.ufs = ["DF", "GO", "MT", "MS"];
      break;
    case 5:
      modelFilters.value.ufs = ["PR", "RS", "SC"];
      break;
    case 6:
      modelFilters.value.ufs = ["ES", "MG", "RJ", "SP"];
      break;
    default:
      modelFilters.value.ufs = [];
  }

  await getData();
};

const handleDateChange = async () => {
  switch (tabDate.value) {
    case 1:
      modelFilters.value.initialDate = dayjs().format("YYYY-MM-DD");
      modelFilters.value.finalDate = dayjs().format("YYYY-MM-DD");
      break;
    case 2:
      modelFilters.value.initialDate = dayjs()
        .startOf("week")
        .format("YYYY-MM-DD");
      modelFilters.value.finalDate = dayjs().endOf("week").format("YYYY-MM-DD");
      break;
    case 3:
      modelFilters.value.initialDate = dayjs()
        .startOf("month")
        .format("YYYY-MM-DD");
      modelFilters.value.finalDate = dayjs()
        .endOf("month")
        .format("YYYY-MM-DD");
      break;
    case 4:
      modelFilters.value.initialDate = dayjs()
        .startOf("year")
        .format("YYYY-MM-DD");
      modelFilters.value.finalDate = dayjs().endOf("year").format("YYYY-MM-DD");
      break;
  }

  await getData();
};

const getData = async () => {
  loading.value = true;
  try {
    await dash.getDashboardSales(modelFilters.value);
  } finally {
    loading.value = false;
  }
};
</script>
