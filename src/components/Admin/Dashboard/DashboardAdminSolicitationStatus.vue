<template>
  <Card class="pa-4">
    <template #title>
      <span> Solicitações por status </span>
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
    series: [44, 55, 33, 47, 12],
    chartOptions: {
      chart: {
        width: 380,
        type: "donut",
      },
      theme: {
        palette: "palette3",
      },
      stroke: {
        show: false,
      },
      labels: ["Pendente", "Agendado", "Andamento", "Finalizado", "Cancelado"],
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
