<template>
  <div>
    <v-card flat class="mb-2 pa-2" rounded="lg">
      <v-card-title>
        <v-row dense align="center">
          <v-col cols="12" lg="10" class="d-flex align-center">
            <v-icon icon="mdi-view-dashboard-outline" start />
            <HeaderPage title="Estatísticas" />
          </v-col>
          <v-col cols="12" lg="2">
            <Years @year="handleYear($event)" />
          </v-col>
        </v-row>
      </v-card-title>
      <!-- <v-row dense>
        <v-col cols="12">
          <Tabs v-model="tab" :tabs="tabs" @update:model-value="handleTab" />
        </v-col>
      </v-row> -->
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
    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

//import dayjs from "dayjs";

/**
 * Deixe aqui por enquanto para pegar as estadísticas do ano inteiro
 * referente ao advogado logado
 * também na api vai chumbar o ano corrente, porém lá ainda permite
 * passar os parametros de data e tem um get
 * caso o cliente deseje mudar
 */

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

const filterEstatistics = ref({
  initialDate: dayjs().startOf("year").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("year").format("YYYY-MM-DD"),
});

const loading = ref(false);

const handleYear = async (year: number) => {
  loading.value = true;
  try {
    const initialDate = dayjs().year(year).startOf("year").format("YYYY-MM-DD");
    const finalDate = dayjs().year(year).endOf("year").format("YYYY-MM-DD");

    filterEstatistics.value = {
      initialDate,
      finalDate,
    };

    await userLawyer.getEstatistics(filterEstatistics.value);
  } finally {
    loading.value = false;
  }
};

//const tab = ref(1);
// const tabs = ref<TabProps[]>([
//   {
//     title: "Hoje",
//     icon: "mdi-check-decagram-outline",
//   },
//   {
//     title: "Semana",
//     icon: "mdi-chart-line-variant",
//   },
//   {
//     title: "Mês",
//     icon: "mdi-calendar-month-outline",
//   },
//   {
//     title: "Ano",
//     icon: "mdi-chart-bell-curve-cumulative",
//   },
// ]);

// const handleTab = async () => {
//   loading.value = true;
//   try {
//     switch (tab.value) {
//       case 1:
//         filterEstatistics.value = {
//           initialDate: dayjs().format("YYYY-MM-DD"),
//           finalDate: dayjs().format("YYYY-MM-DD"),
//         };
//         break;
//       case 2:
//         filterEstatistics.value = {
//           initialDate: dayjs().startOf("week").format("YYYY-MM-DD"),
//           finalDate: dayjs().endOf("week").format("YYYY-MM-DD"),
//         };
//         break;
//       case 3:
//         filterEstatistics.value = {
//           initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
//           finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
//         };
//         break;
//       case 4:
//         filterEstatistics.value = {
//           initialDate: dayjs().startOf("year").format("YYYY-MM-DD"),
//           finalDate: dayjs().endOf("year").format("YYYY-MM-DD"),
//         };
//         break;
//     }

//     await userLawyer.getEstatistics(filterEstatistics.value);
//   } finally {
//     loading.value = false;
//   }
// };
</script>
