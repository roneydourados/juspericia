<template>
  <div>
    <v-row dense>
      <v-col cols="12" lg="8">
        <v-card flat rounded="lg">
          <v-card-title class="d-flex flex-column py-8" style="gap: 0.5rem">
            <span class="text-h5 font-weight-bold"> Horários agendados </span>
            <span class="text-grey-darken-1">{{ formattedDate }}</span>
            <v-row dense>
              <v-col
                v-if="$currentUser?.Profile.type === 'ADMIN'"
                cols="12"
                lg="6"
              >
                <SelectSearchMedic
                  v-model="model.medic"
                  @update:model-value="getSchedules"
                  clearable
                />
              </v-col>
              <v-col cols="12" lg="6">
                <SelectSearchPatient
                  v-model="model.patient"
                  @update:model-value="getSchedules"
                  clearable
                />
              </v-col>
            </v-row>
          </v-card-title>
          <v-cad-text>
            <div class="w-100 px-4">
              <v-list density="compact">
                <v-list-subheader>Consultas</v-list-subheader>
                <v-list-item
                  v-for="(item, index) in $shedules"
                  :key="item.id"
                  :value="item"
                >
                  <template v-slot:prepend>
                    <v-avatar variant="flat" color="primary">
                      <span>{{
                        getInitials(
                          `${item.PatientConsultation?.Patient?.name} ${item.PatientConsultation?.Patient?.surname}`
                        )
                      }}</span>
                    </v-avatar>
                  </template>
                  <v-list-item-title>
                    <span>{{ item.title }}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <div class="d-flex w-100" style="gap: 0.5rem">
                      <span style="font-size: 0.8rem">
                        Paciente:
                        {{ item.PatientConsultation?.Patient?.name }}
                        {{ item.PatientConsultation?.Patient?.surname }}
                      </span>
                      <span style="font-size: 0.8rem">
                        ás {{ item.scheduleHour }}
                      </span>
                    </div>
                    <div class="d-flex w-100" style="gap: 0.5rem">
                      <span style="font-size: 0.8rem">
                        Benefício
                        {{ item.PatientConsultation?.BenefitType?.name }}
                      </span>
                      <span style="font-size: 0.8rem">
                        Finalidade
                        {{ item.PatientConsultation?.ReportPurpose?.name }}
                      </span>
                    </div>
                    <div
                      v-if="$currentUser?.Profile.type === 'ADMIN'"
                      class="d-flex w-100"
                      style="gap: 0.5rem"
                    >
                      <span style="font-size: 0.8rem">
                        Dr(a)
                        {{ item.Medic?.name }}
                      </span>
                    </div>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
          </v-cad-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-locale-provider locale="pt">
          <v-date-picker
            v-model="model.date"
            :allowed-dates="allowedDates"
            hide-actions
            hide-title
            hide-header
            elevation="8"
            rounded="lg"
            @update:model-value="getSchedules"
          />
        </v-locale-provider>
      </v-col>
    </v-row>
    <!-- <pre>{{ $shedules }}</pre> -->
    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
import moment from "moment";

const auth = useAuthStore();
const scheduleStore = useScheduleStore();
const { getInitials } = useUtils();

const model = reactive({
  date: new Date(),
  medic: undefined as UserProps | undefined,
  patient: undefined as PatientProps | undefined,
});

const items = ref([
  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
    title: "Paciente: Roger Campos",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().format("DD/MM/YYYY HH:mm")}`,
  },

  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
    title: "Paciente: Samuel Medeiros",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().format("DD/MM/YYYY HH:mm")}`,
  },

  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
    title: "Paciente: Jessica Firmino",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().add(4, "day").format("DD/MM/YYYY HH:mm")}`,
  },

  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
    title: "Paciente: Editi Oliveira",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().add(1, "day").format("DD/MM/YYYY HH:mm")}`,
  },

  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
    title: "Paciente: Alice Katrine",
    subtitle: "Detalhes do agendamento do médico será descrito aqui",
    date: `Agendando para ${moment().add(2, "day").format("DD/MM/YYYY HH:mm")}`,
  },
]);
const loading = ref(false);

const $currentUser = computed(() => auth.$currentUser);
const $shedules = computed(() => scheduleStore.$all);

const formattedDate = computed(() => {
  const data = new Date();

  const diaSemana = daysOfWeek[data.getDay()];
  const dia = data.getDate();
  const mes = months[data.getMonth()];
  const ano = data.getFullYear();

  return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
});

const allowedDates = (val: any) => {
  const today = moment().add(-1, "days");
  const date = moment(val as Date);

  if (moment(date).isBefore(today)) {
    return false;
  }

  return true;
};

const getSchedules = async () => {
  if (!model.date) return;

  loading.value = true;
  try {
    await scheduleStore.index({
      scheduleDate: moment(model.date).format("YYYY-MM-DD"),
      medicId: model.medic?.id,
      patientId: model.patient?.id,
    });
  } finally {
    loading.value = false;
  }
};
</script>
