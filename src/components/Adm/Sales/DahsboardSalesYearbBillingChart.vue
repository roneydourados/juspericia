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
          10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000,
          110000, 120000,
        ],
      },
    ],
    chartOptions: {
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val + "%";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"],
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
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
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
          show: false,
          formatter: function (val: number) {
            return val + "%";
          },
        },
      },

      title: {
        text: "Faturamento",
        align: "left",
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: "18px",
          fontWeight: "bold",
          color: "#000",
        },
      },
      tooltip: {
        show: false,
        theme: "dark",
        style: {
          fontSize: "16px",
        },
      },
    },
  };
});
</script>
