<template>
  <CardBlur>
    <v-card-title class="text-h6 font-weight-bold text-colorTextPrimary">
      Top 10 melhores avaliações
    </v-card-title>
    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Posição</th>
            <th class="text-left">Médico</th>
            <th class="text-center">Rating</th>
            <th class="text-center">Solicitação</th>
            <th>Especialidade</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in topBestEvaluations" :key="index">
            <td>
              <v-chip :color="getRankColor(index)" size="small" label>
                {{ index + 1 }}º
              </v-chip>
            </td>
            <td class="font-weight-medium">
              {{ item.medicName ?? "Usabilidade Geral" }}
            </td>
            <td class="text-center">
              <v-rating
                :model-value="item.rating"
                density="compact"
                half-increments
                readonly
                color="orange"
                size="small"
              />
            </td>
            <td class="text-center">
              <v-chip size="small" variant="outlined">
                {{ item.solicitationId ?? "ND" }}
              </v-chip>
            </td>
            <td class="font-weight-bold">
              {{ item.specialtyName ?? "Usabilidade Geral" }}
            </td>
            <td class="text-caption">
              {{ item.feedbackText }}
            </td>
          </tr>
        </tbody>
      </v-table>

      <div
        v-if="topBestEvaluations?.length === 0"
        class="text-center py-8 text-grey"
      >
        <v-icon icon="mdi-information-outline" size="48" class="mb-2" />
        <div>Nenhum dado disponível</div>
      </div>
    </v-card-text>
  </CardBlur>
</template>

<script setup lang="ts">
interface BestEvaluationData {
  rating: number;
  medicName: string;
  solicitationId: number;
  specialtyName: string;
  feedbackText: string;
}

defineProps<{
  topBestEvaluations: BestEvaluationData[];
}>();

const getRankColor = (index: number) => {
  if (index === 0) return "yellow-darken-2";
  if (index === 1) return "grey-lighten-1";
  if (index === 2) return "orange-darken-2";
  return "grey-lighten-2";
};
</script>
