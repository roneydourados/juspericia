<template>
  <CardBlur>
    <v-card-title class="text-h6 font-weight-bold text-colorTextPrimary">
      Análise por Fase
    </v-card-title>
    <v-card-text>
      <Chart
        type="line"
        height="300"
        :options="chartOptions"
        :series="chartSeries"
      />

      <v-divider class="my-4" />

      <v-row dense>
        <v-col v-for="phase in byPhase" :key="phase.phase" cols="12" md="6">
          <v-card variant="outlined" rounded="lg" class="pa-3">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey">Fase {{ phase.phase }}</div>
                <div class="text-h6 font-weight-bold">
                  NPS: {{ phase.npsScore }}
                </div>
                <div class="text-caption">
                  Média: {{ phase.averageRating.toFixed(1) }} | Avaliações:
                  {{ phase.totalEvaluations }}
                </div>
              </div>
              <v-icon
                :icon="
                  phase.npsScore >= 50 ? 'mdi-trending-up' : 'mdi-trending-down'
                "
                :color="phase.npsScore >= 50 ? 'green' : 'orange'"
                size="40"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </CardBlur>
</template>

<script setup lang="ts">
interface PhaseData {
  phase: number;
  totalEvaluations: number;
  averageRating: number;
  npsScore: number;
}

const props = defineProps<{
  byPhase: PhaseData[];
}>();

const themeStore = useThemeStore();
const $currentTheme = computed(() => themeStore.$currentTheme);

const chartSeries = computed(() => [
  {
    name: "NPS Score",
    data: props.byPhase.map((p) => p.npsScore),
  },
  {
    name: "Média",
    data: props.byPhase.map((p) => p.averageRating * 20), // Normaliza para mesma escala
  },
]);

const chartOptions = computed(() => {
  const isDark = $currentTheme.value === "mainThemeDark";

  return {
    chart: {
      type: "line",
      background: isDark ? "rgb(var(--v-theme-tabbgcolor))" : "#ffffff",
      foreColor: isDark ? "#d4d4d4" : "#373d3f",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [3, 3],
      curve: "smooth",
    },
    colors: ["#2196f3", "#ff9800"],
    xaxis: {
      categories: props.byPhase.map((p) => `Fase ${p.phase}`),
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Score",
      },
      min: 0,
      max: 100,
    },
    legend: {
      position: "top",
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (value: number, { seriesIndex }: any) => {
          if (seriesIndex === 0) return `${value}`;
          return `${(value / 20).toFixed(1)}`;
        },
      },
    },
  };
});
</script>
