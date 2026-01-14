<template>
  <v-row>
    <v-col cols="12" md="6" lg="3">
      <DashboardCard
        title="Total de Avaliações"
        icon="mdi-chart-bar"
        :value="overview.totalEvaluations.toString()"
        icon-color="blue"
      />
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <DashboardCard
        title="Média Geral"
        icon="mdi-star"
        :value="overview.averageRating.toFixed(1)"
        icon-color="orange"
      />
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <DashboardCard
        title="NPS Score"
        icon="mdi-chart-line"
        :value="overview.npsScore.toString()"
        :icon-color="npsColor"
      />
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <DashboardCard
        title="Classificação"
        icon="mdi-trophy"
        :value="npsClassification"
        :icon-color="npsColor"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
interface OverviewProps {
  totalEvaluations: number;
  averageRating: number;
  npsScore: number;
  ratingDistribution: Record<string, number>;
}

const props = defineProps<{
  overview: OverviewProps;
}>();

const npsClassification = computed(() => {
  const score = props.overview.npsScore;
  if (score >= 75) return "Excelente";
  if (score >= 50) return "Muito Bom";
  if (score >= 0) return "Razoável";
  return "Crítico";
});

const npsColor = computed(() => {
  const score = props.overview.npsScore;
  if (score >= 75) return "green";
  if (score >= 50) return "blue";
  if (score >= 0) return "orange";
  return "red";
});
</script>
