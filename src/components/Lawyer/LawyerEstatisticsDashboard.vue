<template>
  <div>
    <v-card flat class="mb-2 pa-2" rounded="lg">
      <v-card-title class="d-flex flex-column">
        <HeaderPage title="Estatísticas" />
      </v-card-title>
      <v-row dense>
        <v-col cols="12">
          <Tabs v-model="tab" :tabs="tabs" />
        </v-col>
      </v-row>
    </v-card>
    <v-row dense>
      <v-col cols="12" lg="4">
        <LawyerEstatisticsDashboardServicesChart />
      </v-col>
      <v-col cols="12" lg="4">
        <LawyerEstatisticsDashboardPatientsChart />
      </v-col>
      <v-col cols="12" lg="4">
        <LawyerEstatisticsDashboardInvestmentChart />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="4">
        <DashboardCard
          title="Consultas abertas"
          icon="mdi-file-clock-outline"
          :value="$solicitationOpen.toString()"
          icon-color="success"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <DashboardCard
          title="Consultas agendadas"
          icon="mdi-file-check-outline"
          :value="$solicitationScheduled.toString()"
          icon-color="info"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <DashboardCard
          title="Consultas concluídas"
          icon="mdi-calendar-month-outline"
          :value="$solicitationClose.toString()"
          icon-color="orange"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="6">
        <LawyerEstatisticsDashboardSolicitationBenefitType />
      </v-col>
      <v-col cols="12" lg="6">
        <LawyerEstatisticsDashboardReportPropuseChart />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <LawyerEstatisticsDashboardTop10Solicitations />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const userLawyer = useUserLawyerStore();
const $estatistics = computed(() => userLawyer.$estatistics);

const $solicitationOpen = computed(() => {
  const data = $estatistics.value?.laywerSolicitationsStatus.find(
    (solicitation) => solicitation.status === "Abertas"
  );

  if (data) {
    return data.quantity;
  }

  return 0;
});

const $solicitationClose = computed(() => {
  const data = $estatistics.value?.laywerSolicitationsStatus.find(
    (solicitation) => solicitation.status === "Concluídas"
  );

  if (data) {
    return data.quantity;
  }

  return 0;
});

const $solicitationScheduled = computed(() => {
  const data = $estatistics.value?.laywerSolicitationsStatus.find(
    (solicitation) => solicitation.status === "Agendadas"
  );

  if (data) {
    return data.quantity;
  }

  return 0;
});

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
</script>
