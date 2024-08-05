<template>
  <div>
    <v-card flat class="mb-2 pa-2" rounded="lg">
      <v-row dense>
        <v-col cols="12">
          <Tabs v-model="tab" :tabs="tabs" />
        </v-col>
      </v-row>
    </v-card>
    <v-row dense>
      <v-col cols="12" lg="4">
        <UserLawyerEstatisticsDashboardServicesChart />
      </v-col>
      <v-col cols="12" lg="4">
        <UserLawyerEstatisticsDashboardPatientsChart />
      </v-col>
      <v-col cols="12" lg="4">
        <UserLawyerEstatisticsDashboardInvestmentChart />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="4">
        <UserLawyerEstatisticsDashboardCard
          title="Consultas abertas"
          icon="mdi-file-clock-outline"
          value="40"
          icon-color="success"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <UserLawyerEstatisticsDashboardCard
          title="Consultas agendadas"
          icon="mdi-file-check-outline"
          value="35"
          icon-color="info"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <UserLawyerEstatisticsDashboardCard
          title="Consultas concluídas"
          icon="mdi-calendar-month-outline"
          value="25"
          icon-color="orange"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="6">
        <UserLawyerEstatisticsDashboardSolicitationBenefitType />
      </v-col>
      <v-col cols="12" lg="6">
        <UserLawyerEstatisticsDashboardReportPropuseChart />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <UserLawyerEstatisticsDashboardTop10Solicitations />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const tab = ref(3);

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
