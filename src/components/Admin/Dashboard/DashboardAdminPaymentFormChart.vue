<template>
  <Card class="pa-4">
    <template #title>
      <span> Faturamento por forma de pagamento </span>
    </template>
    <template #content>
      <Chart
        type="donut"
        height="380"
        :chart-options="chartData.chartOptions"
        :series="chartData.series"
      />
    </template>
  </Card>
</template>

<script setup lang="ts">
const chartData = computed(() => {
  return {
    series: [44, 55, 33, 47],
    chartOptions: {
      chart: {
        width: 380,
        type: "donut",
      },
      theme: {
        palette: "palette2",
      },
      stroke: {
        show: false,
      },
      labels: ["PIX", "Cartão", "Boleto", "Pacote"],
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -5,
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter(val: any, opts: any) {
          const name = opts.w.globals.labels[opts.seriesIndex];
          return [name, val.toFixed(1) + "%"];
        },
      },
    },
  };
});
</script>
