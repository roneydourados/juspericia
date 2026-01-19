<template>
  <CardBlur height="450">
    <div class="pa-4">
      <HeaderPage title="Solicitações" />
    </div>
    <Chart
      :series="chartConfig.series"
      :chart-options="chartConfig.chartOptions"
    />
  </CardBlur>
</template>

<script setup lang="ts">
const userLawyer = useUserLawyerStore();

const $estatistics = computed(() => userLawyer.$estatistics);

const themeStore = useThemeStore();
const $currentTheme = computed(() => themeStore.$currentTheme);

const chartConfig = computed(() => {
  const randomNumbers = [] as number[];

  for (let i = 0; i < 12; i++) {
    randomNumbers.push(Math.floor(Math.random() * 100));
  }

  const isDark = $currentTheme.value === "mainThemeDark";

  return {
    series: [
      {
        name: "Solicitações enviadas",
        data: $estatistics.value?.laywerSolicitations.map(
          (solicitation) => solicitation.quantity,
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
        palette: "palette1",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      // title: {
      //   text: "Solicitações",
      //   align: "left",
      //   style: {
      //     color: $currentTheme.value === MAIN_THEME_DARK ? "#fff" : "",
      //   },
      // },

      labels: $estatistics.value?.laywerSolicitations.map(
        (solicitation) => solicitation.month,
      ),
      xaxis: {
        type: "",
        labels: {
          show: true,
          style: {
            colors: $estatistics.value?.laywerSolicitations.map(() => {
              return isDark ? "#fff" : "";
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
        theme: "dark",
        style: {
          fontSize: "16px",
        },
      },
    },
  };
});
</script>
