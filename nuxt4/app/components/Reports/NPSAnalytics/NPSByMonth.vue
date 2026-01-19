<template>
  <CardBlur height="100%">
    <v-card-title class="text-h6 font-weight-bold text-colorTextPrimary">
      Evolução Mensal
    </v-card-title>
    <v-card-text>
      <Chart
        type="area"
        height="350"
        :options="chartOptions"
        :series="chartSeries"
      />
    </v-card-text>
  </CardBlur>
</template>

<script setup lang="ts">
interface MonthData {
  month: string;
  totalEvaluations: number;
  averageRating: number;
  npsScore: number;
}

const props = defineProps<{
  byMonth: MonthData[];
}>();

const formatMonth = (monthStr: string) => {
  const [year, month] = monthStr.split("-");
  const months = [
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
  ];
  return `${months[parseInt(month || "1") - 1]}/${year}`;
};

const chartSeries = computed(() => [
  {
    name: "NPS Score",
    data: props.byMonth.map((m) => m.npsScore),
  },
  {
    name: "Avaliações",
    data: props.byMonth.map((m) => m.totalEvaluations),
  },
]);

const chartOptions = computed(() => ({
  chart: {
    type: "area",
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 90, 100],
    },
  },
  colors: ["#2196f3", "#4caf50"],
  xaxis: {
    categories: props.byMonth.map((m) => formatMonth(m.month)),
    labels: {
      style: {
        fontSize: "12px",
      },
    },
  },
  yaxis: [
    {
      title: {
        text: "NPS Score",
      },
      min: 0,
      max: 100,
    },
    {
      opposite: true,
      title: {
        text: "Avaliações",
      },
    },
  ],
  legend: {
    position: "top",
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (value: number) => `${value}`,
    },
  },
}));
</script>
