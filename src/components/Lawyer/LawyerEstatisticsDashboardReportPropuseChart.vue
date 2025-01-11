<template>
  <v-card flat rounded="lg" class="pa-2">
    <Chart
      :series="chartConfig.series"
      :chart-options="chartConfig.chartOptions"
      :height="chartConfig.chartOptions.chart.height"
    />
  </v-card>
</template>

<script setup lang="ts">
const userLawyer = useUserLawyerStore();
const $estatistics = computed(() => userLawyer.$estatistics);

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
      },
    },
  };
});
</script>
