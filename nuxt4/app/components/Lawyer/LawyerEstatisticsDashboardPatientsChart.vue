<template>
  <CardBlur height="450">
    <div class="pa-4">
      <HeaderPage title="Pacientes cadastrados" />
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
  const isDark = $currentTheme.value === "mainThemeDark";

  return {
    series: [
      {
        name: "Pacientes cadastrados",
        data: $estatistics.value?.laywerPatientsRegistered.map(
          (patient) => patient.quantity,
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
      // grid: {
      //   show: false,
      // },
      theme: {
        palette: "palette4",
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      // title: {
      //   text: "Pacientes cadastrados",
      //   align: "left",
      //   style: {
      //     color: $currentTheme.value === MAIN_THEME_DARK ? "#fff" : "",
      //   },
      // },

      labels: $estatistics.value?.laywerPatientsRegistered.map(
        (patient) => patient.month,
      ),
      xaxis: {
        type: "",
        labels: {
          show: true,
          style: {
            colors: $estatistics.value?.laywerPatientsRegistered.map(() => {
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
            return Math.floor(val).toString();
          },

          style: {
            colors: $estatistics.value?.laywerPatientsRegistered.map(() => {
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
