<template>
  <v-card flat rounded="lg" class="pa-2">
    <Chart
      :series="chartConfig.series"
      :chart-options="chartConfig.chartOptions"
    />
  </v-card>
</template>

<script setup lang="ts">
const userLawyer = useUserLawyerStore();
const $estatistics = computed(() => userLawyer.$estatistics);

const chartConfig = computed(() => {
  return {
    series: [
      {
        name: "Total investido",
        data: $estatistics.value?.laywerInvestment.map(
          (investment) => investment.quantity
        ),
      },
    ],
    chartOptions: {
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: false,
        },
      },
      theme: {
        palette: "palette10",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },

      title: {
        text: "Investimento",
        align: "left",
      },

      labels: $estatistics.value?.laywerInvestment.map(
        (investment) => investment.month
      ),
      xaxis: {
        type: "",
      },
      yaxis: {
        opposite: true,
      },
      legend: {
        horizontalAlign: "left",
      },
    },
  };
});
</script>
