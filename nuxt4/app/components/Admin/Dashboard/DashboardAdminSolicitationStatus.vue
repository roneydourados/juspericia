<template>
  <CardBlur height="100%">
    <template #title>
      <div class="pa-4">
        <HeaderPage title="Solicitações por status" />
      </div>
    </template>
    <template #content>
      <Chart
        :type="chartData.chartOptions.chart.type"
        :height="chartData.chartOptions.chart.height"
        :chart-options="chartData.chartOptions"
        :series="chartData.series"
      />
    </template>
  </CardBlur>
</template>

<script setup lang="ts">
const dash = useUserAdminStore();
const $dash = computed(() => dash.$dashboard);

const themeStore = useThemeStore();
const $currentTheme = computed(() => themeStore.$currentTheme);

const chartData = computed(() => {
  const isDark = $currentTheme.value === "mainThemeDark";

  return {
    series: $dash.value?.solicitationConsultationStatus.map((item) =>
      Number(item.quantity),
    ),
    chartOptions: {
      chart: {
        height: "480",
        type: "pie",
        background: isDark ? "rgb(var(--v-theme-tabbgcolor))" : "#ffffff",
        foreColor: isDark ? "#d4d4d4" : "#373d3f",
      },
      // theme: {
      //   palette: "palette4",
      // },
      stroke: {
        show: false,
      },
      colors: [
        "#2196F3",
        "#3F51B5",
        "#009688",
        "#775DD0",
        "#FF9800",
        "#546E7A",
      ],
      labels: $dash.value?.solicitationConsultationStatus.map(
        (item) => item.status,
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
