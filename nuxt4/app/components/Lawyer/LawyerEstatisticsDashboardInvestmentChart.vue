<template>
  <CardBlur height="450">
    <div class="pa-4">
      <HeaderPage title="Investimentos" />
    </div>

    <Chart
      :series="chartConfig.series"
      :chart-options="chartConfig.chartOptions"
    />
  </CardBlur>
</template>

<script setup lang="ts">
const userLawyer = useUserLawyerStore();
const { amountFormated } = useUtils();

const $estatistics = computed(() => userLawyer.$estatistics);
const themeStore = useThemeStore();
const $currentTheme = computed(() => themeStore.$currentTheme);

const chartConfig = computed(() => {
  const isDark = $currentTheme.value === "mainThemeDark";

  return {
    series: [
      {
        name: "Total investido",
        data: $estatistics.value?.laywerInvestment.map(
          (investment) => investment.quantity,
        ),
      },
    ],
    chartOptions: {
      chart: {
        type: "area",
        background: isDark ? "rgb(var(--v-theme-tabbgcolor))" : "#ffffff",
        foreColor: isDark ? "#d4d4d4" : "#373d3f",
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
        curve: "smooth",
      },

      // title: {
      //   text: "Investimento",
      //   align: "left",
      //   style: {
      //     color: $currentTheme.value === MAIN_THEME_DARK ? "#fff" : "",
      //   },
      // },

      labels: $estatistics.value?.laywerInvestment.map(
        (investment) => investment.month,
      ),
      xaxis: {
        type: "",
        labels: {
          show: true,
          style: {
            colors: $estatistics.value?.laywerInvestment.map(() => {
              return isDark ? "#fff" : "";
            }),
          },
        },
      },
      yaxis: {
        opposite: true,
        labels: {
          show: true,
          formatter: function (val: number) {
            return amountFormated(val, true);
          },
          style: {
            colors: $estatistics.value?.laywerInvestment.map(() => {
              return isDark ? "#fff" : "";
            }),
          },
        },
      },
      legend: {
        horizontalAlign: "left",
      },
      tooltip: {
        show: true,
        theme: "dark",
        style: {
          fontSize: "16px",
        },
      },
    },
  };
});
</script>
