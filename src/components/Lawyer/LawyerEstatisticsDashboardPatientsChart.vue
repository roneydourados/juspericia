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
  return {
    series: [
      {
        name: "Pacientes cadastrados",
        data: $estatistics.value?.laywerPatientsRegistered.map(
          (patient) => patient.quantity
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

      title: {
        text: "Pacientes cadastrados",
        align: "left",
        style: {
          color: $currentTheme.value === MAIN_THEME_DARK ? "#fff" : "",
        },
      },

      labels: $estatistics.value?.laywerPatientsRegistered.map(
        (patient) => patient.month
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
