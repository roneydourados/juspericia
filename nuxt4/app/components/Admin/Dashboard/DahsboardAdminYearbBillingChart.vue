<template>
  <CardBlur>
    <template #title>
      <div class="pa-4">
        <HeaderPage>
          <div class="d-flex align-center">
            <span
              class="text-colorTextPrimary"
              :style="`font-size: 1rem; font-weight: 600`"
            >
              Faturamento - {{ currentYear }}
            </span>
          </div>
        </HeaderPage>
      </div>
    </template>
    <template #content>
      <Chart
        type="bar"
        height="380"
        :chart-options="chartData.chartOptions"
        :series="chartData.series"
      />
    </template>
  </CardBlur>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const { amountFormated } = useUtils();
const dash = useUserAdminStore();

const $dash = computed(() => dash.$dashboard);
const themeStore = useThemeStore();
const $currentTheme = computed(() => themeStore.$currentTheme);

const currentYear = defineModel({
  default: dayjs().year(),
});

const chartData = computed(() => {
  const isDark = $currentTheme.value === "mainThemeDark";

  return {
    series: [
      {
        name: "",
        data: $dash.value?.invoicingYear?.map((item) => item.total) || [],
      },
    ],
    chartOptions: {
      chart: {
        height: 350,
        type: "bar",
        background: isDark ? "rgb(var(--v-theme-tabbgcolor))" : "#ffffff",
        foreColor: isDark ? "#d4d4d4" : "#373d3f",
      },
      plotOptions: {
        bar: {
          borderRadius: 2,
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: false,
        // formatter: function (val: number) {
        //   return amountFormated(val ?? 0, true);
        // },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: [isDark ? "#d4d4d4" : "#304758"],
        },
      },

      xaxis: {
        categories: months,
        position: "top",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: isDark ? "#2d2d30" : "#D8E3F0",
              colorTo: isDark ? "#404040" : "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
        labels: {
          style: {
            colors: isDark ? "#d4d4d4" : "#373d3f",
          },
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: true,
          formatter: function (val: number) {
            return amountFormated(val ?? 0, true);
          },
          style: {
            colors: isDark ? "#d4d4d4" : "#373d3f",
          },
        },
      },
      grid: {
        borderColor: isDark ? "#404040" : "#e0e0e0",
      },
      // title: {
      //   text: "Faturamento",
      //   align: "left",
      //   margin: 10,
      //   offsetX: 0,
      //   offsetY: 0,
      //   floating: false,
      //   style: {
      //     fontSize: "18px",
      //     fontWeight: "bold",
      //     color: "#000",
      //   },
      // },
      tooltip: {
        show: false,
        theme: isDark ? "dark" : "light",
        style: {
          fontSize: "16px",
        },
      },
    },
  };
});
</script>
