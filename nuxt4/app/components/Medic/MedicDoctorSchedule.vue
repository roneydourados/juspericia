<template>
  <v-row class="px-8 pa-8">
    <v-col cols="12">
      <HeaderPage title="Parametrização de agenda" font-size="1.5rem" />
    </v-col>
    <v-col cols="12" lg="4">
      <SelectSearchMedic
        v-model="model.doctor"
        @update:modelValue="getSchedules"
      />
    </v-col>
    <v-col cols="12">
      <v-divider />
    </v-col>
    <v-col cols="12">
      <HeaderPage title="Configurar agendamento" font-size="1rem" />
    </v-col>
    <v-col cols="12">
      <FormCrud ref="form" :on-submit="addSchedule" :showSubmitButton="false">
        <v-row dense>
          <v-col cols="12" lg="2">
            <SelectInput
              v-model="model.dayOfWeek"
              :items="daysOfWeekList"
              label="Dia da semana"
              item-value="value"
              item-title="label"
              required
            />
          </v-col>
          <v-col cols="12" lg="2">
            <TimeInput
              v-model="model.medicHourStart"
              label="Hora de início"
              placeholder="08:00"
              required
            />
          </v-col>
          <v-col cols="12" lg="2">
            <TimeInput
              v-model="model.medicHourEnd"
              label="Hora de fim"
              placeholder="20:00"
              required
            />
          </v-col>
          <v-col cols="12" lg="3">
            <SelectSearchMedicalSpecialty
              v-model="model.medicalSpecialty"
              required
            />
          </v-col>
          <v-col cols="12" lg="2">
            <Button
              color="grey"
              variant="outlined"
              size="small"
              type="submit"
              :disabled="loading"
            >
              <div v-if="!loading" class="d-flex align-center">
                <v-icon icon="mdi-clock-out " start color="colorIcon" />
                <span class="text-caption text-primary"> Adiocionar </span>
              </div>
            </Button>
          </v-col>
        </v-row>
      </FormCrud>
    </v-col>
    <v-col cols="12">
      <Table
        title="Horários"
        :items="$all"
        :headers="headers"
        :show-crud="false"
      >
        <template v-slot:item.dayOfWeek="{ item }">
          <strong>
            {{ getWeekDay(item.dayOfWeek) }}
          </strong>
        </template>
        <template v-slot:item.startTime="{ item }">
          <v-icon icon="mdi-clock-time-eight-outline" color="colorIcon" start />
          <strong>
            {{ item.startTime }}
          </strong>
        </template>
        <template v-slot:item.endTime="{ item }">
          <v-icon icon="mdi-clock-time-eight-outline" color="colorIcon" start />
          <strong>
            {{ item.endTime }}
          </strong>
        </template>
        <template v-slot:item.specialty="{ item }">
          <v-icon icon="mdi-medical-bag" start color="colorIcon" />
          <strong>{{ item.specialty.medicalSpecialty }}</strong>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            variant="text"
            icon
            color="danger"
            size="small"
            @click="handleDelete(item)"
          >
            <v-icon icon="mdi-delete-outline" />
          </v-btn>
        </template>
      </Table>
    </v-col>
  </v-row>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const doctorScheduleStore = useDoctorScheduleStore();

const $all = computed(() => doctorScheduleStore.$all);
// const $availableDaysSchedule = computed(
//   () => doctorScheduleStore.$availableDaysSchedule
// );

const form = ref();
const loading = ref(false);
const model = ref({
  doctor: undefined as UserProps | undefined,
  medicalSpecialty: undefined as MedicalSpecialtyProps | undefined,
  medicHourStart: "",
  medicHourEnd: "",
  dayOfWeek: dayjs().day(),
});

const headers = ref([
  {
    title: "Dia da semana",
    key: "dayOfWeek",
  },
  {
    title: "Início",
    key: "startTime",
  },
  {
    title: "Fim",
    key: "endTime",
  },
  {
    title: "Especialidade",
    key: "specialty",
  },
  {
    title: "Ações",
    key: "actions",
  },
]);
const daysOfWeekList = [
  {
    label: "Domingo",
    value: 0,
  },
  {
    label: "Segunda-feira",
    value: 1,
  },
  {
    label: "Terça-feira",
    value: 2,
  },
  {
    label: "Quarta-feira",
    value: 3,
  },
  {
    label: "Quinta-feira",
    value: 4,
  },
  {
    label: "Sexta-feira",
    value: 5,
  },
  {
    label: "Sábado",
    value: 6,
  },
];

const clearForm = () => {
  model.value = {
    ...model.value,
    medicHourStart: "",
    medicHourEnd: "",
  };
};

const getWeekDay = (day: number) => {
  return daysOfWeekList.find((item) => item.value === day)?.label;
};

const getSchedules = async () => {
  loading.value = true;

  try {
    if (!model.value.doctor) {
      return;
    }

    await doctorScheduleStore.index(String(model.value.doctor.id));
    //await doctorScheduleStore.availableDays();
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

const addSchedule = async () => {
  try {
    if (!model.value.doctor) {
      push.warning("Selecione um médico");
      return;
    }

    if (!model.value.medicalSpecialty) {
      push.warning("Selecione uma especialidade");
      return;
    }

    if (!model.value.dayOfWeek) {
      push.warning("Selecione um dia da semana");
      return;
    }

    // if (existingSchedule) {
    //   push.warning(
    //     "Já existe um horário cadastrado para este dia, intervalo e especialidade"
    //   );
    //   return;
    // }

    const payload = {
      userId: model.value.doctor.id,
      specialtyId: model.value.medicalSpecialty.id,
      dayOfWeek: model.value.dayOfWeek,
      startTime: model.value.medicHourStart,
      endTime: model.value.medicHourEnd,
    };

    await doctorScheduleStore.create(payload);
    await getSchedules();

    clearForm();
    form.value?.resetForm();
  } catch (error) {}
};

// // Check if schedule already exists for same weekday, time range and specialty
// const existingSchedule = $all.value.find(
//   (schedule) =>
//     schedule.dayOfWeek === model.value.dayOfWeek &&
//     schedule.specialty?.id === model.value.medicalSpecialty?.id &&
//     ((model.value.medicHourStart >= schedule.startTime ??  &&
//       model.value.medicHourStart <= schedule.endTime) ||
//       (model.value.medicHourEnd >= schedule.startTime &&
//         model.value.medicHourEnd <= schedule.endTime) ||
//       (model.value.medicHourStart <= schedule.startTime &&
//         model.value.medicHourEnd >= schedule.endTime))
// );

const handleDelete = (item: DoctorScheduleProps) => {
  push.info({
    title: "Apagar Horário",
    message: "Tem certeza que deseja apagar horário ?",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Apagar",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            loading.value = true;
            try {
              if (!item.publicId) {
                return;
              }
              await doctorScheduleStore.destroy(item.publicId);
              await getSchedules();
            } catch (error) {
              push.error("Erro ao apagar horário");
            } finally {
              loading.value = false;
            }
          },
        },
        {
          label: "Cancelar",
          variant: "secondary",
          icon: "mdi-close",
          iconColor: "red",
          handler: () => {},
        },
      ],
    },
  });
};
</script>
