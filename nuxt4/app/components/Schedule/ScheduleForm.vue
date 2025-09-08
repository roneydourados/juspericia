<template>
  <DialogForm
    :show="show"
    title="Agendamento de consulta"
    :width="mobile ? '' : width"
    @dialog="handleDialog"
  >
    <FormCrud :on-submit="submitForm">
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
      <v-divider class="mt-2" :thickness="2" />
      <v-row dense class="mt-4">
        <v-col cols="12" lg="3">
          <DatePicker
            v-model="model.scheduleDate"
            label="Agendar para o dia"
            required
            :min="minDate"
            @click:day="clickDay($event)"
            @update:model-value="datePickerModelValue($event)"
          />
          <div class="mb-4 font-weight-bold">Horários disponíveis</div>
        </v-col>

        <v-col cols="12">
          <ScheduleHours
            :solicitation="solicitation"
            v-model="hours"
            v-model:hour="hour"
          />
        </v-col>
      </v-row>
      <!-- <pre>{{ $doctorScheduleAvailableDays }}</pre> -->
    </FormCrud>
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

const emit = defineEmits(["scheduled"]);
const show = defineModel<boolean>({ default: false });
const scheduleStore = useScheduleStore();
const systemParametersStore = useSystemParametersStore();
const doctorScheduleStore = useDoctorScheduleStore();
const authStore = useAuthStore();
const { mobile } = useDisplay();
const hours = ref<HourProps[]>([]);
const hour = ref<HourProps>({});

const model = ref({
  scheduleDate: dayjs().format("YYYY-MM-DD"),
  medic: undefined as UserProps | undefined,
});

const $currentUser = computed(() => authStore.$currentUser);
const $schedules = computed(() => scheduleStore.$all);
const $systemParameters = computed(() => systemParametersStore.$parameters);
const $doctorScheduleAvailableDays = computed(
  () => doctorScheduleStore.$availableDaysSchedule
);

const minDate = computed(() => {
  if ($currentUser.value?.profile?.type === "ADVOGADO") {
    return dayjs().add(5, "days").format("YYYY-MM-DD");
  }
  return dayjs().format("YYYY-MM-DD");
});

// onMounted(async () => {
// });

watch(
  () => show.value,
  async (value) => {
    if (value) {
      await systemParametersStore.index();
      await doctorScheduleStore.availableDays();

      if ($currentUser.value?.profile?.type === "ADVOGADO") {
        model.value.scheduleDate = dayjs().add(4, "days").format("YYYY-MM-DD");
        console.log("🚀 ~ model.value.scheduleDate:", model.value.scheduleDate);
      }

      await getSchedules();

      generateAvailableTimeSlots();
    }
  }
);

// Gera horários disponíveis baseado no array $doctorScheduleAvailableDays
const generateAvailableTimeSlots = async () => {
  hours.value = [];
  hour.value = {};

  // Obtém o dia da semana (1 = Segunda, 2 = Terça, ..., 7 = Domingo)
  const dayOfWeek = dayjs(model.value.scheduleDate).day();
  const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // Ajusta domingo de 0 para 7

  // Filtra os horários disponíveis para o dia da semana selecionado e especialidade da solicitação
  const availableSchedules =
    $doctorScheduleAvailableDays.value?.filter(
      (schedule: any) =>
        schedule.dayOfWeek === adjustedDayOfWeek &&
        schedule.specialtyId ===
          props.solicitation.medicalSpecialtyId?.toString()
    ) ?? [];

  // Para cada horário disponível, gera os slots de tempo
  for (const schedule of availableSchedules) {
    const startTime = new Date(`1970-01-01T${schedule.startTime}`);
    const endTime = new Date(`1970-01-01T${schedule.endTime}`);
    const interval = Number($systemParameters.value?.medicQueryInterval ?? 15);

    const currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const hourStr = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Conta quantos agendamentos existem nesse horário
      const schedulesAtThisHour =
        $schedules.value?.schedules.filter(
          (s) =>
            s.scheduleDate === model.value.scheduleDate &&
            s.scheduleHour === hourStr
        ) ?? [];

      // Está selecionado se já tem um agendamento para essa solicitação
      const isSelected = schedulesAtThisHour.some(
        (s) => s.patientConsultationId === props.solicitation.id
      );

      const filter = schedulesAtThisHour.find(
        (s) => s.patientConsultationId === props.solicitation.id
      );

      const solicitationId = isSelected ? filter?.id : props.solicitation.id;

      // Conta quantos médicos estão disponíveis nesse horário específico para esta especialidade
      const availableMedicsAtThisHour =
        $doctorScheduleAvailableDays.value?.filter(
          (doctorSchedule: any) =>
            doctorSchedule.dayOfWeek === adjustedDayOfWeek &&
            doctorSchedule.specialtyId ===
              props.solicitation.medicalSpecialtyId?.toString() &&
            doctorSchedule.startTime <= hourStr &&
            doctorSchedule.endTime > hourStr
        ).length ?? 0;

      // ❌ Se já tiver agendamentos ≥ médicos disponíveis, bloqueia
      const isDisabled =
        schedulesAtThisHour.length >= availableMedicsAtThisHour;

      // Verifica se já existe esse horário no array (evita duplicatas)
      const existingHour = hours.value.find((h) => h.scheduleHour === hourStr);

      if (!existingHour) {
        hours.value.push({
          scheduleHour: hourStr,
          patientConsultationId: solicitationId,
          scheduleDate: model.value.scheduleDate,
          isSelected,
          isDisabled,
        });
      }

      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }
  }

  // Ordena os horários em ordem crescente
  hours.value.sort((a, b) =>
    (a.scheduleHour ?? "").localeCompare(b.scheduleHour ?? "")
  );
};

// Mantém o método antigo como fallback (comentado)
// const timeSlots = async () => {
//   hours.value = [];
//   hour.value = {};

//   const start = new Date(`1970-01-01T${$systemParameters.value?.hourInitial}`);
//   const end = new Date(`1970-01-01T${$systemParameters.value?.hourFinal}`);

//   const dayOfWeek = dayjs(model.value.scheduleDate)
//     .format("ddd")
//     .toLowerCase()
//     .slice(0, 3);

//   // Filtra médicos que atendem nesse dia da semana
//   const availableMedics =
//     $schedules.value?.medics.filter((medic: any) => {
//       switch (dayOfWeek) {
//         case "mon":
//           return medic.seg;
//         case "tue":
//           return medic.ter;
//         case "wed":
//           return medic.qua;
//         case "thu":
//           return medic.qui;
//         case "fri":
//           return medic.sex;
//         case "sat":
//           return medic.sab;
//         case "sun":
//           return medic.dom;
//         default:
//           return false;
//       }
//     }) ?? [];

//   while (start <= end) {
//     const hourStr = start.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     // Conta quantos agendamentos existem nesse horário
//     const schedulesAtThisHour =
//       $schedules.value?.schedules.filter(
//         (s) =>
//           s.scheduleDate === model.value.scheduleDate &&
//           s.scheduleHour === hourStr
//       ) ?? [];

//     // Está selecionado se já tem um agendamento para essa solicitação
//     const isSelected = schedulesAtThisHour.some(
//       (s) => s.patientConsultationId === props.solicitation.id
//     );

//     const filter = schedulesAtThisHour.find(
//       (s) => s.patientConsultationId === props.solicitation.id
//     );

//     const solicitationId = isSelected ? filter?.id : props.solicitation.id;

//     // Quantos médicos estão disponíveis nesse horário
//     const availableAtThisHour = availableMedics.filter((medic: UserProps) => {
//       const start = medic.medicHourStart!;
//       const end = medic.medicHourEnd!;

//       // Verifica se hourStr está entre start e end
//       return start <= hourStr && hourStr <= end;
//     });

//     // ❌ Se já tiver agendamentos ≥ médicos disponíveis, bloqueia
//     const isDisabled = schedulesAtThisHour.length >= availableAtThisHour.length;

//     hours.value.push({
//       scheduleHour: hourStr,
//       patientConsultationId: solicitationId,
//       scheduleDate: model.value.scheduleDate,
//       isSelected,
//       isDisabled,
//     });

//     start.setMinutes(
//       start.getMinutes() +
//         Number($systemParameters.value?.medicQueryInterval ?? 15)
//     );
//   }
// };

const submitForm = async () => {
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
    await getSchedules();
  } finally {
    handleDialog();
    emit("scheduled");
  }
};

const handleDialog = () => {
  show.value = false;
  model.value = {
    medic: undefined,
    scheduleDate: dayjs().format("YYYY-MM-DD"),
  };
  hours.value = [];
  scheduleStore.clear();
};

const getSchedules = async () => {
  await scheduleStore.index({
    patientConsultationId: props.solicitation.id,
    initialDate: model.value.scheduleDate,
    finalDate: model.value.scheduleDate,
    medicalSpecialtyId: props.solicitation.medicalSpecialtyId,
  });
};

const clickDay = async (date: string) => {
  if (!date || !dayjs(date).isValid()) {
    return;
  }

  model.value.scheduleDate = date;

  await getSchedules();
  generateAvailableTimeSlots();
};

const datePickerModelValue = async (date: string | null) => {
  if (!date || !dayjs(date).isValid()) {
    return;
  }

  model.value.scheduleDate = date;

  await getSchedules();
  generateAvailableTimeSlots();
};
</script>
