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
        {{ slot.patientConsultationId }}
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

// Variável para armazenar o horário selecionado
const hour = defineModel<HourProps>("hour", {
  default: {} as HourProps,
});

// Função para selecionar apenas um horário, desmarcando os demais do mesmo `medicId`, `patientConsultationId`, e `scheduleDate`
const setBlockHour = (selectedHour: HourProps) => {
  // Desmarcar todos os horários que têm o mesmo `medicId`, `patientConsultationId`, e `scheduleDate`
  hoursSelected.value.forEach((h) => {
    if (
      h.medicId === selectedHour.medicId &&
      h.patientConsultationId === selectedHour.patientConsultationId &&
      h.scheduleDate === selectedHour.scheduleDate
    ) {
      h.isSelected = false;
    }
  });

  // Marcar o horário atual como selecionado e atribuí-lo à variável `hour`
  const index = hoursSelected.value.findIndex(
    (h) =>
      h.scheduleHour === selectedHour.scheduleHour &&
      h.medicId === selectedHour.medicId &&
      h.patientConsultationId === selectedHour.patientConsultationId &&
      h.scheduleDate === selectedHour.scheduleDate
  );

  if (index !== -1) {
    hoursSelected.value[index].isSelected = true;
    hour.value = hoursSelected.value[index]; // Atribuir o horário selecionado a `hour`
  } else {
    const newHour = { ...selectedHour, isSelected: true };
    hoursSelected.value.push(newHour);
    hour.value = newHour; // Atribuir o novo horário selecionado a `hour`
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
  background-color: #bdbdbd;
}

.booked {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white;
  font-weight: bold;
}
</style>
