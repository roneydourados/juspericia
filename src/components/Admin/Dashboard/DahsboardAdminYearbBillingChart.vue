<template>
  <Card flat rounded="lg" class="pa-4">
    <template #title>
      <span> Faturamento - {{ currentYear }} </span>
    </template>
    <template #content>
      <Chart
        type="bar"
        height="380"
        :chart-options="chartData.chartOptions"
        :series="chartData.series"
      />
    </template>
  </Card>
</template>

<script setup lang="ts">
import moment from "moment";

const { amountFormated } = useUtils();
const dash = useAdminDashboardSalesStore();

const $dash = computed(() => dash.$dashboard);
const currentYear = computed(() => moment().year());

const chartData = computed(() => {
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
          show: true,
          formatter: function (val: number) {
            return amountFormated(val ?? 0, true);
          },
        },
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
        theme: "dark",
        style: {
          fontSize: "16px",
        },
      },
    },
  };
});
</script>
