<template>
  <v-container fluid>
    <!-- Filtros -->
    <v-row>
      <v-col cols="12" lg="2">
        <SelectInput
          label="Ano"
          :items="$npsDahsboard?.years || []"
          v-model="filters.year"
          hide-details
        />
      </v-col>
      <v-col cols="12" lg="10">
        <Months @month="handleChangeMonth($event)" />
      </v-col>
    </v-row>

    <div
      v-if="
        $npsDahsboard && ($npsDahsboard?.overview?.totalEvaluations ?? 0) > 0
      "
    >
      <!-- Cards de Visão Geral -->
      <v-row>
        <v-col cols="12">
          <NPSOverviewCards :overview="$npsDahsboard.overview" />
        </v-col>
      </v-row>

      <!-- Distribuição de Avaliações e Evolução Mensal -->
      <v-row>
        <v-col cols="12" md="6">
          <NPSRatingDistribution
            :rating-distribution="$npsDahsboard.overview.ratingDistribution"
          />
        </v-col>
        <v-col cols="12" md="6">
          <NPSByMonth
            v-if="$npsDahsboard.byMonth?.length"
            :by-month="$npsDahsboard.byMonth"
          />
        </v-col>
      </v-row>

      <!-- Análise por Fase -->
      <v-row v-if="$npsDahsboard.byPhase?.length">
        <v-col cols="12">
          <NPSByPhase :by-phase="$npsDahsboard.byPhase" />
        </v-col>
      </v-row>

      <!-- Top Médicos e Especialidades -->
      <v-row>
        <v-col cols="12">
          <NPSTopMedics
            v-if="$npsDahsboard.topMedics?.length"
            :top-medics="$npsDahsboard.topMedics"
          />
        </v-col>
        <v-col cols="12">
          <NPSTopSpecialties
            v-if="$npsDahsboard.topSpecialties?.length"
            :top-specialties="$npsDahsboard.topSpecialties"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Estado Vazio -->
    <v-row v-else class="justify-center align-center" style="min-height: 400px">
      <v-col cols="12" class="text-center">
        <v-icon
          icon="mdi-chart-box-outline"
          size="100"
          color="grey-lighten-1"
        />
        <div class="text-h6 text-grey mt-4">Nenhum dado disponível</div>
        <div class="text-body-2 text-grey">
          Não há avaliações NPS para exibir no momento
        </div>
      </v-col>
    </v-row>
    <DialogLoading :dialog="loading" />
  </v-container>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const npsStore = useNpsStore();

const loading = ref(false);

const filters = ref({
  monthReference: dayjs().startOf("month").format("YYYY-MM"),
  year: dayjs().year(),
});

const $npsDahsboard = computed(() => npsStore.$npsDahsboard);

watch(
  () => filters.value.year,
  async (newYear) => {
    const currentMonth = dayjs(filters.value.monthReference + "-01").month();

    filters.value.monthReference = dayjs(
      new Date(newYear, currentMonth, 1)
    ).format("YYYY-MM");

    await getDashboard();
  }
);

const handleChangeMonth = async (monthIndex: number) => {
  const currentYear = filters.value.year;

  filters.value.monthReference = dayjs(
    new Date(currentYear, monthIndex, 1)
  ).format("YYYY-MM");

  console.log(
    "🚀 ~ handleChangeMonth ~ filters.value.monthReference:",
    filters.value.monthReference
  );

  await getDashboard();
};

const getDashboard = async () => {
  loading.value = true;
  try {
    await npsStore.getNpsDashboard(filters.value);
  } catch (error) {
    console.error("Erro ao carregar dashboard NPS:", error);
  } finally {
    loading.value = false;
  }
};
</script>
