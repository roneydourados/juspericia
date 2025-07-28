<template>
  <Card class="pa-4">
    <template #title>
      <span> Faturamento por forma de pagamento </span>
    </template>
    <template #content>
      <Chart
        :type="chartData.chartOptions.chart.type"
        :height="chartData.chartOptions.chart.height"
        :chart-options="chartData.chartOptions"
        :series="chartData.series"
      />
    </template>
  </Card>
</template>

<script setup lang="ts">
const dash = useUserAdminStore();
const $dash = computed(() => dash.$dashboard);

const chartData = computed(() => {
  return {
    series: $dash.value?.salesPaymentForm.map((item) => Number(item.total)),
    chartOptions: {
      chart: {
        height: "480",
        type: "donut",
      },
      theme: {
        palette: "palette1",
      },
      stroke: {
        show: false,
      },
      labels: $dash.value?.salesPaymentForm.map((item) => item.payment),
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
          return [name, Number(val ?? 0).toFixed(2) + "%"];
        },
      },
    },
  };
});
</script>
