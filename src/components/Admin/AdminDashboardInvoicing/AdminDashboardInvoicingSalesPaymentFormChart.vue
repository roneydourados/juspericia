<template>
  <Card height="300">
    <template #title>
      <span class="font-weight-bold text-subtitle-1">
        Vendas por forma de pagamento
      </span>
    </template>
    <template #content>
      <Chart
        v-if="chartData.series && chartData.series.length > 0"
        :type="chartData.chartOptions.chart.type"
        :height="chartData.chartOptions.chart.height"
        :chart-options="chartData.chartOptions"
        :series="chartData.series"
      />
      <EmptyContent v-else />
    </template>
  </Card>
</template>

<script setup lang="ts">
const userAdmin = useUserAdminStore();
//const { amountFormated } = useUtils();

const chartData = computed(() => {
  return {
    series: userAdmin.$dashboardInvoicing?.salesPaymentForms.map((item) =>
      Number(item.total)
    ),
    chartOptions: {
      chart: {
        height: "580",
        type: "donut",
      },
      theme: {
        palette: "palette3",
      },
      stroke: {
        show: false,
      },
      labels: userAdmin.$dashboardInvoicing?.salesPaymentForms.map(
        (item) => item.billingType
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
