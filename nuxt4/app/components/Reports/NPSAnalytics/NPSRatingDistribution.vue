<template>
  <CardBlur height="100%">
    <v-card-title class="text-h6 font-weight-bold text-primary">
      Distribuição de Avaliações
    </v-card-title>
    <v-card-text>
      <Chart
        type="bar"
        height="300"
        :options="chartOptions"
        :series="chartSeries"
      />
    </v-card-text>
  </CardBlur>
</template>

<script setup lang="ts">
const props = defineProps<{
  ratingDistribution: Record<string, number>;
}>();

const chartSeries = computed(() => [
  {
    name: "Avaliações",
    data: [
      props.ratingDistribution["1"] || 0,
      props.ratingDistribution["2"] || 0,
      props.ratingDistribution["3"] || 0,
      props.ratingDistribution["4"] || 0,
      props.ratingDistribution["5"] || 0,
    ],
  },
]);

const chartOptions = computed(() => ({
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      distributed: true,
      horizontal: false,
      columnWidth: "60%",
    },
  },
  colors: ["#f44336", "#ff9800", "#ffc107", "#4caf50", "#2e7d32"],
  dataLabels: {
    enabled: true,
  },
  xaxis: {
    categories: [
      "1 Estrela",
      "2 Estrelas",
      "3 Estrelas",
      "4 Estrelas",
      "5 Estrelas",
    ],
    labels: {
      style: {
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    title: {
      text: "Quantidade",
    },
  },
  legend: {
    show: false,
  },
  tooltip: {
    y: {
      formatter: (value: number) => `${value} avaliações`,
    },
  },
}));
</script>
