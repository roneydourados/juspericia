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

const $estatistics = computed(() => userLawyer.$estatistics);

const $currentTheme = computed(() => {
  return storeTheme.$theme;
});

const chartConfig = computed(() => {
  const randomNumbers = [] as number[];

  for (let i = 0; i < 12; i++) {
    randomNumbers.push(Math.floor(Math.random() * 100));
  }

  return {
    series: [
      {
        name: "Solicitações enviadas",
        data: $estatistics.value?.laywerSolicitations.map(
          (solicitation) => solicitation.quantity
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
        palette: "palette1",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      title: {
        text: "Solicitações",
        align: "left",
        style: {
          color: $currentTheme.value === MAIN_THEME_DARK ? "#fff" : "",
        },
      },

      labels: $estatistics.value?.laywerSolicitations.map(
        (solicitation) => solicitation.month
      ),
      xaxis: {
        type: "",
        labels: {
          show: true,
          style: {
            colors: $estatistics.value?.laywerSolicitations.map(() => {
              return $currentTheme.value === MAIN_THEME_DARK ? "#fff" : "";
            }),
          },
        },
      },
      yaxis: {
        opposite: true,
        labels: {
          show: true,
          style: {
            colors: $estatistics.value?.laywerSolicitations.map(() => {
              return $currentTheme.value === MAIN_THEME_DARK ? "#fff" : "";
            }),
          },
          formatter: function (val: number) {
            return Math.floor(val).toString();
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
