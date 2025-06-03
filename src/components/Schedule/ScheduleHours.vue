<template>
  <v-row dense class="px-4">
    <v-col
      cols="3"
      lg="1"
      v-for="(item, index) in hoursSelected"
      :key="index"
      @click="
        (item.patientConsultationId === props.solicitation.id ||
          !item.isSelected) &&
          !isPastHour(item) &&
          setBlockHour(item)
      "
      :class="[
        'time-slot',
        {
          booked: isSelectedHour(item),
          'disabled-slot':
            item.isDisabled ||
            (item.isSelected &&
              item.patientConsultationId !== props.solicitation.id) ||
            isPastHour(item),
        },
      ]"
    >
      {{ item.scheduleHour }}
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const props = defineProps({
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => ({}),
  },
});

//const systemParametersStore = useSystemParametersStore();
//const scheduleStore = useScheduleStore();

const hoursSelected = defineModel<HourProps[]>({
  default: [],
});

const hour = defineModel<HourProps>("hour", {
  default: {} as HourProps,
});

// const model = ref({
//   scheduleDate: dayjs().format("YYYY-MM-DD"),
//   scheduleHour: "",
// });

// Função para verificar se o horário é no passado para o dia atual
const isPastHour = (slot: HourProps) => {
  const slotDateTime = dayjs(
    `${slot.scheduleDate} ${slot.scheduleHour}`,
    "YYYY-MM-DD HH:mm"
  );
  const now = dayjs();

  return slotDateTime.isBefore(now);
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
