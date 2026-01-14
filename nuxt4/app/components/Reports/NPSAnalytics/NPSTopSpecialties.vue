<template>
  <CardBlur>
    <v-card-title class="text-h6 font-weight-bold text-primary">
      Top Especialidades
    </v-card-title>
    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Posição</th>
            <th class="text-left">Especialidade</th>
            <th class="text-center">Avaliações</th>
            <th class="text-center">Média</th>
            <th class="text-center">Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(specialty, index) in topSpecialties"
            :key="specialty.specialtyId"
          >
            <td>
              <v-chip :color="getRankColor(index)" size="small" label>
                {{ index + 1 }}º
              </v-chip>
            </td>
            <td class="font-weight-medium">{{ specialty.specialtyName }}</td>
            <td class="text-center">
              <v-chip size="small" variant="outlined">
                {{ specialty.count }}
              </v-chip>
            </td>
            <td class="text-center font-weight-bold">
              {{ specialty.average.toFixed(1) }}
            </td>
            <td class="text-center">
              <v-rating
                :model-value="specialty.average"
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

      <div
        v-if="topSpecialties.length === 0"
        class="text-center py-8 text-grey"
      >
        <v-icon icon="mdi-information-outline" size="48" class="mb-2" />
        <div>Nenhum dado disponível</div>
      </div>
    </v-card-text>
  </CardBlur>
</template>

<script setup lang="ts">
interface SpecialtyData {
  specialtyId: number;
  specialtyName: string;
  average: number;
  count: number;
}

defineProps<{
  topSpecialties: SpecialtyData[];
}>();

const getRankColor = (index: number) => {
  if (index === 0) return "yellow-darken-2";
  if (index === 1) return "grey-lighten-1";
  if (index === 2) return "orange-darken-2";
  return "grey-lighten-2";
};
</script>
