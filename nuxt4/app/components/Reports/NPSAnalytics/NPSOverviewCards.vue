<template>
  <v-row>
    <v-col cols="12" md="6" lg="3">
      <DashboardCard
        title="Total de Avaliações"
        icon="mdi-chart-bar"
        icon-color="blue"
      >
        <div class="d-flex justify-center w-100">
          <span class="text-primary" style="font-size: 2rem">
            {{ overview.totalEvaluations }}
          </span>
        </div>
      </DashboardCard>
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <DashboardCard title="Média Geral" icon="mdi-star" icon-color="orange">
        <div class="d-flex justify-center w-100">
          <span class="text-primary" style="font-size: 2rem">
            {{ overview.averageRating }}
          </span>
        </div>
      </DashboardCard>
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <DashboardCard
        title="NPS Score"
        icon="mdi-chart-line"
        :icon-color="npsColor"
      >
        <div class="d-flex justify-center w-100">
          <span class="text-primary" style="font-size: 2rem">
            {{ overview.npsScore }}
          </span>
        </div>
      </DashboardCard>
    </v-col>
    <v-col cols="12" md="6" lg="3">
      <DashboardCard
        title="Classificação"
        icon="mdi-trophy"
        :icon-color="npsColor"
      >
        <div class="d-flex justify-center w-100">
          <span class="text-primary" style="font-size: 1.8rem">
            {{ npsClassification }}
          </span>
        </div>
      </DashboardCard>
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
