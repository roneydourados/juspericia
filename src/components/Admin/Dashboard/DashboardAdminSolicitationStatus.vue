<template>
  <Card class="pa-4">
    <template #title>
      <span> Solicitações por status </span>
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
    series: $dash.value?.solicitationConsultationStatus.map((item) =>
      Number(item.quantity)
    ),
    chartOptions: {
      chart: {
        height: "480",
        type: "donut",
      },
      theme: {
        palette: "palette3",
      },
      stroke: {
        show: false,
      },
      labels: $dash.value?.solicitationConsultationStatus.map(
        (item) => item.status
      ),
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
          return [name, val.toFixed(2) + "%"];
        },
      },
    },
  };
});
</script>
