<template>
  <v-card flat rounded="lg" class="pa-4">
    <Chart
      type="bar"
      height="380"
      :chart-options="chartData.chartOptions"
      :series="chartData.series"
    />
  </v-card>
</template>

<script setup lang="ts">
import moment from "moment";

const { amountFormated } = useUtils();

const chartData = computed(() => {
  return {
    series: [
      {
        name: "",
        data: [
          {
            x: "Jan",
            y: Math.floor(Math.random() * 1000),
          },
          {
            x: "Fev",
            y: Math.floor(Math.random() * 1000),
          },
          {
            x: "Mar",
            y: Math.floor(Math.random() * 1000),
          },
          {
            x: "Abr",
            y: Math.floor(Math.random() * 1000),
          },
          {
            x: "Mai",
            y: Math.floor(Math.random() * 1000),
          },
          {
            x: "Jun",
            y: Math.floor(Math.random() * 1000),
          },
          {
            x: "Jul",
            y: Math.floor(Math.random() * 1000),
          },
          {
            x: "Ago",
            y: Math.floor(Math.random() * 1000),
          },
          {
            x: "Set",
            y: Math.floor(Math.random() * 1000),
          },
          {
            x: "Out",
            y: Math.floor(Math.random() * 1000),
          },
          {
            x: "Nov",
            y: Math.floor(Math.random() * 1000),
          },
          {
            x: "Dez",
            y: Math.floor(Math.random() * 1000),
          },
        ],
      },
    ],

    chartOptions: {
      grid: {
        yaxis: {
          lines: {
            show: true,
          },
        },
        strokeDashArray: 1, // serve para montar um traçado nas linhas
      },
      plotOptions: {
        bar: {
          borderRadius: 3,
          distributed: false,
          dataLabels: {
            position: "bottom", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ],
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
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: false,
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
            return amountFormated(val, true);
          },
        },
      },
      title: {
        text: `Faturamento ${moment().format("YYYY")}`,
        align: "left",
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
      },
    },
  };
});
</script>
