<template>
  <v-card flat rounded="xl" elevation="0" class="pa-2">
    <Chart
      :series="chartConfig.series"
      :chart-options="chartConfig.chartOptions"
      :height="chartConfig.chartOptions.chart.height"
    />
  </v-card>
</template>

<script setup lang="ts">
const userLawyer = useUserLawyerStore();
const storeTheme = useThemeStore();

const $estatistics = computed(() => userLawyer.$estatistics);

const $currentTheme = computed(() => {
  return storeTheme.$theme;
});

const chartConfig = computed(() => {
  return {
    series: $estatistics.value?.laywerSolicitationsReportPropurse.map(
      (propurse) => propurse.quantity
    ),
    chartOptions: {
      chart: {
        type: "donut",
        height: "400",
      },
      theme: {
        palette: "palette1",
      },
      labels: $estatistics.value?.laywerSolicitationsReportPropurse.map(
        (propurse) => propurse.reportPurpose
      ),
      dataLabels: {
        enabled: false,
      },
      title: {
        text: "Solicitações por finalidade",
        align: "left",
        style: {
          color: $currentTheme.value === MAIN_THEME_DARK ? "#fff" : "",
        },
      },
      legend: {
        labels: {
          colors: $estatistics.value?.laywerSolicitationsReportPropurse.map(
            () => {
              return $currentTheme.value === MAIN_THEME_DARK ? "#fff" : "";
            }
          ),
        },
        show: true,
      },
    },
  };
});
</script>
