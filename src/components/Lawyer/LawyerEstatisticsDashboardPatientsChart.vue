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
        name: "Pacientes cadastrados",
        data: $estatistics.value?.laywerPatientsRegistered.map(
          (patient) => patient.quantity
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
        palette: "palette4",
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },

      title: {
        text: "Pacientes cadastrados",
        align: "left",
      },

      labels: $estatistics.value?.laywerPatientsRegistered.map(
        (patient) => patient.month
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
