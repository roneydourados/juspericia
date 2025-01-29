<template>
  <v-card flat rounded="lg" class="pa-2">
    <Chart
      :series="chartConfig.series"
      :chart-options="chartConfig.chartOptions"
    />
  </v-card>
</template>

<script setup lang="ts">
const userLawyer = useUserLawyerStore();
const storeTheme = useThemeStore();
const { amountFormated } = useUtils();

const $estatistics = computed(() => userLawyer.$estatistics);

const $currentTheme = computed(() => {
  return storeTheme.$theme;
});

const chartConfig = computed(() => {
  return {
    series: [
      {
        name: "Total investido",
        data: $estatistics.value?.laywerInvestment.map(
          (investment) => investment.quantity
        ),
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
        curve: "smooth",
      },

      title: {
        text: "Investimento",
        align: "left",
        style: {
          color: $currentTheme.value === MAIN_THEME_DARK ? "#fff" : "",
        },
      },

      labels: $estatistics.value?.laywerInvestment.map(
        (investment) => investment.month
      ),
      xaxis: {
        type: "",
        labels: {
          show: true,
          style: {
            colors: $estatistics.value?.laywerInvestment.map(() => {
              return $currentTheme.value === MAIN_THEME_DARK ? "#fff" : "";
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
              return $currentTheme.value === MAIN_THEME_DARK ? "#fff" : "";
            }),
          },
        },
      },
      legend: {
        horizontalAlign: "left",
      },
      tooltip: {
        show: true,
        theme: $currentTheme.value === MAIN_THEME_DARK ? "dark" : "light",
        style: {
          fontSize: "16px",
        },
      },
    },
  };
});
</script>
