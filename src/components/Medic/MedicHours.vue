<template>
  <v-card flat :disabled="medicId === 0">
    <v-row dense>
      <v-col
        cols="1"
        v-for="(slot, index) in hoursSelected"
        :key="index"
        @click="
          (slot.patientConsultationId === props.solicitation.id ||
            !slot.isSelected) &&
            !isPastHour(slot) &&
            setBlockHour(slot)
        "
        :class="[
          'time-slot',
          {
            booked: isSelectedHour(slot),
            'disabled-slot':
              (slot.isSelected &&
                slot.patientConsultationId !== props.solicitation.id) ||
              isPastHour(slot),
          },
        ]"
      >
        {{ slot.scheduleHour }}
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

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

const hour = defineModel<HourProps>("hour", {
  default: {} as HourProps,
});

// Função para verificar se o horário é no passado para o dia atual
const isPastHour = (slot: HourProps) => {
  // pegar a data e hora atual
  const now = dayjs();
  const nowHour = now.format("HH:mm");
  const nowDate = now.format("YYYY-MM-DD");

  // verificar se a data do slot é igual a data atual
  if (dayjs(slot.scheduleDate).format("YYYY-MM-DD") !== nowDate) {
    return false;
  }

  return dayjs(slot.scheduleHour, "HH:mm").isBefore(dayjs(nowHour, "HH:mm"));
};

// Função para selecionar apenas um horário, desmarcando os demais do mesmo `medicId`, `patientConsultationId`, e `scheduleDate`
const setBlockHour = (selectedHour: HourProps) => {
  hoursSelected.value.forEach((h) => {
    if (
      h.medicId === selectedHour.medicId &&
      h.patientConsultationId === selectedHour.patientConsultationId &&
      h.scheduleDate === selectedHour.scheduleDate
    ) {
      h.isSelected = false;
    }
  });

  const index = hoursSelected.value.findIndex(
    (h) =>
      h.scheduleHour === selectedHour.scheduleHour &&
      h.medicId === selectedHour.medicId &&
      h.patientConsultationId === selectedHour.patientConsultationId &&
      h.scheduleDate === selectedHour.scheduleDate
  );

  if (
    index !== -1 &&
    hoursSelected.value[index].patientConsultationId === props.solicitation.id
  ) {
    hoursSelected.value[index].isSelected = true;
    hour.value = hoursSelected.value[index];
  }
};

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

.disabled-slot {
  background-color: lightgray !important;
  color: darkgray;
  cursor: not-allowed;
}
</style>
