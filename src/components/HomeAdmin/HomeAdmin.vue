<template>
  <v-card flat rounded="lg">
    <v-card-title class="pa-4 mb-8">
      <Tabs v-model="tab" :tabs="tabs" />
      <v-divider></v-divider>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" lg="6">
          <HomeAdminYearbBillingChart />
        </v-col>
        <v-col cols="12" lg="6">
          <HomeAdminYearbBillingPaymentFormChart />
        </v-col>
      </v-row>
      <div class="py-8">
        <HomeAdminCards />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { TabProps } from "@/types/Tab";
const tab = ref(1);

const tabs = ref<TabProps[]>([
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

const handleChangeTable = () => {
  console.log(tab.value);
};
</script>
