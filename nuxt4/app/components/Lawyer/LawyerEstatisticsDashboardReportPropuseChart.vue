<template>
  <CardBlur height="100%">
    <div class="pa-4">
      <HeaderPage title="Solicitações por finalidade" />
    </div>
    <Chart
      :series="chartConfig.series"
      :chart-options="chartConfig.chartOptions"
      :height="chartConfig.chartOptions.chart.height"
    />
  </CardBlur>
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
        type: "pie",
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
      // title: {
      //   text: "Solicitações por finalidade",
      //   align: "left",
      //   style: {
      //     color: $currentTheme.value === MAIN_THEME_DARK ? "#fff" : "",
      //   },
      // },
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
