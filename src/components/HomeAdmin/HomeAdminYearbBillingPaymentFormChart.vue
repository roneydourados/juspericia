<template>
  <v-card flat rounded="lg" class="pa-4">
    <Chart
      type="donut"
      height="380"
      :chart-options="chartData.chartOptions"
      :series="chartData.series"
    />
  </v-card>
</template>

<script setup lang="ts">
const chartData = computed(() => {
  return {
    series: [44, 55, 33],
    chartOptions: {
      chart: {
        width: 380,
        type: "donut",
      },
      stroke: {
        show: false,
      },
      labels: ["PIX", "Cartão", "Boleto"],
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -5,
          },
        },
      },
      dataLabels: {
        //enabled: false,
        formatter(val: any, opts: any) {
          const name = opts.w.globals.labels[opts.seriesIndex];
          return [name, val.toFixed(1) + "%"];
        },
      },
      title: {
        text: "Faturamento por forma de pagamento",
        align: "left",
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
      },
    },
  };
});
</script>
