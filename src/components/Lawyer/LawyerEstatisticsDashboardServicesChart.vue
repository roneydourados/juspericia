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
  const randomNumbers = [] as number[];

  for (let i = 0; i < 12; i++) {
    randomNumbers.push(Math.floor(Math.random() * 100));
  }

  return {
    series: [
      {
        name: "Solicitações enviadas",
        data: $estatistics.value?.laywerSolicitations.map(
          (solicitation) => solicitation.quantity
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
        palette: "palette1",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },

      title: {
        text: "Solicitações",
        align: "left",
      },

      labels: $estatistics.value?.laywerSolicitations.map(
        (solicitation) => solicitation.month
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
