<template>
  <CardBlur>
    <v-card-title class="text-h6 font-weight-bold text-primary">
      Top Médicos
    </v-card-title>
    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Posição</th>
            <th class="text-left">Médico</th>
            <th class="text-center">Avaliações</th>
            <th class="text-center">Média</th>
            <th class="text-center">Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(medic, index) in topMedics" :key="medic.medicId">
            <td>
              <v-chip :color="getRankColor(index)" size="small" label>
                {{ index + 1 }}º
              </v-chip>
            </td>
            <td class="font-weight-medium">{{ medic.medicName }}</td>
            <td class="text-center">
              <v-chip size="small" variant="outlined">
                {{ medic.count }}
              </v-chip>
            </td>
            <td class="text-center font-weight-bold">
              {{ medic.average.toFixed(1) }}
            </td>
            <td class="text-center">
              <v-rating
                :model-value="medic.average"
                density="compact"
                half-increments
                readonly
                color="orange"
                size="small"
              />
            </td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="topMedics.length === 0" class="text-center py-8 text-grey">
        <v-icon icon="mdi-information-outline" size="48" class="mb-2" />
        <div>Nenhum dado disponível</div>
      </div>
    </v-card-text>
  </CardBlur>
</template>

<script setup lang="ts">
interface MedicData {
  medicId: number;
  medicName: string;
  average: number;
  count: number;
}

defineProps<{
  topMedics: MedicData[];
}>();

const getRankColor = (index: number) => {
  if (index === 0) return "yellow-darken-2";
  if (index === 1) return "grey-lighten-1";
  if (index === 2) return "orange-darken-2";
  return "grey-lighten-2";
};
</script>
