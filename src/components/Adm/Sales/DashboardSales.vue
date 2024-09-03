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
        @update:model-value="handleDateChange"
      />
      <DashboardSalesFilters v-model:filters="modelFilters" />
      <v-divider></v-divider>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" lg="6">
          <DahsboardSalesYearbBillingChart />
        </v-col>
        <v-col cols="12" lg="6">
          <DashboardSalesHomeAdminYearbBillingPaymentFormChart />
        </v-col>
      </v-row>
      <div class="py-8">
        <DashboardSalesCards />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { TabProps } from "@/types/Tab";
import moment from "moment";
const tabRegion = ref(1);
const tabDate = ref(1);
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

const modelFilters = ref<DashboardSalesFilterProps>({
  initialDate: moment().format("YYYY-MM-DD"),
  finalDate: moment().format("YYYY-MM-DD"),
  region: "Norte",
});

const handleChangeRegion = () => {
  switch (tabRegion.value) {
    case 1:
      modelFilters.value.region = "Norte";
      break;
    case 2:
      modelFilters.value.region = "Nordeste";
      break;
    case 3:
      modelFilters.value.region = "Centro-Oeste";
      break;
    case 4:
      modelFilters.value.region = "Sul";
      break;
    case 5:
      modelFilters.value.region = "Sudeste";
      break;
  }
};

const handleDateChange = () => {
  switch (tabDate.value) {
    case 1:
      modelFilters.value.initialDate = moment().format("YYYY-MM-DD");
      modelFilters.value.finalDate = moment().format("YYYY-MM-DD");
      break;
    case 2:
      modelFilters.value.initialDate = moment()
        .startOf("week")
        .format("YYYY-MM-DD");
      modelFilters.value.finalDate = moment()
        .endOf("week")
        .format("YYYY-MM-DD");
      break;
    case 3:
      modelFilters.value.initialDate = moment()
        .startOf("month")
        .format("YYYY-MM-DD");
      modelFilters.value.finalDate = moment()
        .endOf("month")
        .format("YYYY-MM-DD");
      break;
    case 4:
      modelFilters.value.initialDate = moment()
        .startOf("year")
        .format("YYYY-MM-DD");
      modelFilters.value.finalDate = moment()
        .endOf("year")
        .format("YYYY-MM-DD");
      break;
  }
};
</script>
