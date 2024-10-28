<template>
  <v-card flat :disabled="medicId === 0">
    <v-row dense>
      <v-col
        cols="1"
        v-for="(slot, index) in hoursSelected"
        :key="index"
        @click="setBlockHour(slot)"
        :class="['time-slot', { booked: isSelectedHour(slot) }]"
      >
        {{ slot.scheduleHour }}
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps({
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => ({}),
  },
  medicId: {
    type: Number,
    default: 0,
  },
});

const hoursSelected = defineModel<HourProps[]>({
  default: [],
});

// Função para marcar ou desmarcar um horário visualmente
const setBlockHour = (hour: HourProps) => {
  const index = hoursSelected.value.findIndex(
    (h) =>
      h.scheduleHour === hour.scheduleHour &&
      h.medicId === hour.medicId &&
      h.patientConsultationId === hour.patientConsultationId &&
      h.scheduleDate === hour.scheduleDate
  );

  if (index !== -1) {
    // Alterna o valor `isSelected` se o horário já estiver na lista
    hoursSelected.value[index].isSelected =
      !hoursSelected.value[index].isSelected;
  } else {
    // Adiciona o horário à lista com `isSelected` como true
    hoursSelected.value.push({ ...hour, isSelected: true });
  }
};

// Verifica se o horário já está selecionado para aplicar a classe `booked`
const isSelectedHour = (hour: HourProps) => {
  return hoursSelected.value.some(
    (h) =>
      h.scheduleHour === hour.scheduleHour &&
      h.medicId === hour.medicId &&
      h.patientConsultationId === hour.patientConsultationId &&
      h.scheduleDate === hour.scheduleDate &&
      h.isSelected
  );
};
</script>

<style scoped>
.time-slot {
  padding: 10px;
  margin: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}

.time-slot:hover {
  background-color: #bdbdbd; /*rgb(var(--v-theme-primary)) !important;*/
}

.booked {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white;
  font-weight: bold;
}
</style>
