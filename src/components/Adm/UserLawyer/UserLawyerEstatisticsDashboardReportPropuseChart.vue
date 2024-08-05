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
const randomNumbers = ref<Number[]>([]);

for (let i = 0; i < 12; i++) {
  randomNumbers.value.push(Math.floor(Math.random() * 100));
}

const chartConfig = computed(() => {
  return {
    series: [25, 48],
    chartOptions: {
      chart: {
        type: "donut",
        height: "400",
      },
      theme: {
        palette: "palette1",
      },
      labels: ["Administrativo", "Judicial"],
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
