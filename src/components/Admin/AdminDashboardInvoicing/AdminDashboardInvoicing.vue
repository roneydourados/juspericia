<template>
  <Tabs
    v-model="tabDate"
    :tabs="tabsDate"
    align-tabs="center"
    @update:model-value="handleDateChange"
  />
  <v-row>
    <v-col cols="12" lg="4">
      <AdminDashboardInvoicingSalesPaymentFormChart />
    </v-col>
    <v-col cols="12" lg="4">
      <AdminDashboardInvoicingSalesCategoryChart />
    </v-col>
    <v-col cols="12" lg="4">
      <AdminDashboardInvoicingSalesTotal />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <AdminDashboardInvoicingSalesClient />
    </v-col>
    <v-col cols="12">
      <AdminDashboardInvoicingSalesGeral />
    </v-col>
  </v-row>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const userAdmin = useUserAdminStore();

const loading = ref(false);
const tabDate = ref(1);
const tabsDate = ref<TabProps[]>([
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

const modelFilters = ref({
  initialDate: dayjs().startOf("week").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("week").format("YYYY-MM-DD"),
});

const $invoicing = computed(() => userAdmin.$dashboardInvoicing);

const handleDateChange = async () => {
  switch (tabDate.value) {
    case 1:
      modelFilters.value.initialDate = dayjs()
        .startOf("week")
        .format("YYYY-MM-DD");
      modelFilters.value.finalDate = dayjs().endOf("week").format("YYYY-MM-DD");
      break;
    case 2:
      modelFilters.value.initialDate = dayjs()
        .startOf("month")
        .format("YYYY-MM-DD");
      modelFilters.value.finalDate = dayjs()
        .endOf("month")
        .format("YYYY-MM-DD");
      break;
    case 3:
      modelFilters.value.initialDate = dayjs()
        .startOf("year")
        .format("YYYY-MM-DD");
      modelFilters.value.finalDate = dayjs().endOf("year").format("YYYY-MM-DD");
      break;
  }

  await getData();
};

const getData = async () => {
  try {
    loading.value = true;
    await userAdmin.getDashboardInvoicing(modelFilters.value);
  } catch (error) {
    console.error("Error fetching invoicing data:", error);
  } finally {
    loading.value = false;
  }
};
</script>
