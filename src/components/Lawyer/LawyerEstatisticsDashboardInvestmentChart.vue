<template>
  <v-card flat rounded="lg" class="pa-2">
    <Chart
      :series="chartConfig.series"
      :chart-options="chartConfig.chartOptions"
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
    series: [
      {
        name: "Total investido",
        data: randomNumbers,
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

      labels: months,
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
