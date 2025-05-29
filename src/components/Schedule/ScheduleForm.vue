<template>
  <DialogForm
    :show="show"
    title="Agendamento de consulta"
    :width="mobile ? '' : width"
    @dialog="handleDialog"
  >
    <FormCrud :on-submit="submitForm">
      <v-row dense>
        <v-col cols="12" lg="9">
          <SelectSearchMedic
            v-model="model.medic"
            label="Médico"
            required
            clearable
            @update:model-value="handleEnabledDisabledHours"
          />
        </v-col>
        <v-col cols="12" lg="3">
          <DatePicker
            v-model="model.scheduleDate"
            label="Agendar para o dia"
            required
            @click:day="clickDay($event)"
            @update:model-value="datePickerModelValue($event)"
            :disabled="!model.medic"
          />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12">
          <strong>Dados da solicitação de consulta</strong>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="6" class="d-flex align-center" style="gap: 0.5rem">
          <span>Solicitado:</span>
          <span class="font-weight-bold">
            {{ dayjs(solicitation.dateOpen).format("DD/MM/YYYY") }}
          </span>
        </v-col>
        <v-col cols="12" lg="4" class="d-flex align-center" style="gap: 0.5rem">
          <span>Tipo benefício:</span>
          <span class="font-weight-bold">
            {{ solicitation.BenefitType?.name }}
          </span>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="4" class="d-flex align-center" style="gap: 0.5rem">
          <span>Finalidade:</span>
          <span class="font-weight-bold">
            {{ solicitation.ReportPurpose?.name }}
            {{
              solicitation.processSituation
                ? solicitation.processSituation === "PD"
                  ? "Processo distribuido"
                  : "Processo andamento"
                : ""
            }}
          </span>
        </v-col>

        <v-col
          v-if="solicitation.proccessNumber"
          cols="12"
          lg="4"
          class="d-flex align-center"
          style="gap: 0.5rem"
        >
          <span>Nº Processo:</span>
          <span class="font-weight-bold">
            {{ solicitation.proccessNumber }}
          </span>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="6" class="d-flex align-center" style="gap: 0.5rem">
          <span>Solicitante:</span>
          <span class="font-weight-bold">
            {{ solicitation.Patient?.User?.name }}
          </span>
        </v-col>
        <v-col cols="12" lg="6" class="d-flex align-center" style="gap: 0.5rem">
          <span>Escritório:</span>
          <strong>
            {{ solicitation.Patient?.User?.officeName }}
          </strong>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" class="d-flex align-center" style="gap: 0.5rem">
          <span>Paciente:</span>
          <span class="font-weight-bold">
            {{ solicitation.Patient?.name }}
            {{ solicitation.Patient?.surname }}
          </span>
        </v-col>
      </v-row>
      <v-row dense class="mt-4">
        <v-col cols="12">
          <strong>Horários disponíveis</strong>
        </v-col>
        <v-col cols="12">
          <MedicHours
            :solicitation="solicitation"
            :medic-id="model.medic?.id"
            v-model="hours"
            v-model:hour="hour"
          />
        </v-col>
      </v-row>
    </FormCrud>
    <DialogLoading :dialog="loading" />
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";

const props = defineProps({
  width: {
    type: String,
    default: "750",
  },
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => ({}),
  },
  data: {
    type: Object as PropType<ScheduleProps>,
    default: () => ({}),
  },
});

// const startTime = ref("08:00");
// const endTime = ref("22:00");

const emit = defineEmits(["scheduled"]);
const show = defineModel<boolean>({ default: false });
const scheduleStore = useScheduleStore();
const { mobile } = useDisplay();
const hours = ref<HourProps[]>([]);
const hour = ref<HourProps>({});

const loading = ref(false);
const model = ref({
  medic: undefined as UserProps | undefined,
  scheduleDate: dayjs().format("YYYY-MM-DD"),
  scheduleHour: "",
});

const $schedules = computed(() => scheduleStore.$all);

watch(
  () => show.value,
  (value) => {
    if (value) {
      timeSlots();
    }
  }
);

// Computa os horários com intervalo de 15 minutos entre 08:00 e 22:00
const timeSlots = async () => {
  hours.value = [];
  hour.value = {};

  if (!model.value.medic) {
    return;
  }

  const start = new Date(`1970-01-01T${model.value.medic.medicHourStart}`);
  const end = new Date(`1970-01-01T${model.value.medic.medicHourEnd}`);

  while (start <= end) {
    const isSelected = $schedules.value.some(
      (s) =>
        s.medicId === model.value.medic?.id &&
        s.scheduleDate === model.value.scheduleDate &&
        s.scheduleHour ===
          start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
    );

    const filter = $schedules.value.find(
      (s) =>
        s.medicId === model.value.medic?.id &&
        s.scheduleDate === model.value.scheduleDate &&
        s.scheduleHour ===
          start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
    );

    const solicitationId = isSelected ? filter?.id : props.solicitation.id;

    hours.value.push({
      scheduleHour: start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      medicId: model.value.medic?.id,
      patientConsultationId: solicitationId,
      scheduleDate: model.value.scheduleDate,
      isSelected,
    });
    start.setMinutes(
      start.getMinutes() + Number(model.value.medic.medicQueryInterval ?? 15)
    );
  }
};

const submitForm = async () => {
  if (!hour.value.medicId) {
    push.warning("Selecione um horário para agendar a consulta");
    return;
  }

  loading.value = true;
  try {
    const schedule = {
      title: `Agendamento de consulta referente a solicitação de ${props.solicitation.Patient?.name} ${props.solicitation.Patient?.surname}`,
      medicId: hour.value.medicId,
      scheduleDate: hour.value.scheduleDate,
      scheduleHour: hour.value.scheduleHour,
      patientConsultationId: hour.value.patientConsultationId,
    };

    if (props.data.id) {
      await scheduleStore.update({ ...schedule, id: props.data.id });
    } else {
      await scheduleStore.create(schedule);
    }
  } finally {
    loading.value = false;
    handleDialog();
    emit("scheduled");
  }
};

const handleEnabledDisabledHours = async () => {
  await getSchedules();
  timeSlots();
};

const handleDialog = () => {
  show.value = false;
  model.value = {
    medic: undefined,
    scheduleDate: dayjs().format("YYYY-MM-DD"),
    scheduleHour: "",
  };
  hours.value = [];
  scheduleStore.clear();
};

const getSchedules = async () => {
  loading.value = true;
  try {
    await scheduleStore.index({
      medicId: model.value.medic?.id,
      scheduleDate: model.value.scheduleDate,
    });
  } finally {
    loading.value = false;
  }
};

const clickDay = async (date: string) => {
  if (!date || !dayjs(date).isValid()) {
    return;
  }

  model.value.scheduleDate = date;

  await getSchedules();
  timeSlots();
};

const datePickerModelValue = async (date: string) => {
  if (!date || !dayjs(date).isValid()) {
    return;
  }

  model.value.scheduleDate = date;

  await getSchedules();
  timeSlots();
};
</script>
