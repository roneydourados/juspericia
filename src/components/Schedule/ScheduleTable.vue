<template>
  <div>
    <v-row dense>
      <v-col cols="12" lg="8">
        <v-card flat rounded="lg">
          <v-card-title class="d-flex flex-column py-8" style="gap: 0.5rem">
            <span class="text-h5 font-weight-bold"> Horários agendados </span>
            <span class="text-grey-darken-1">{{ formattedDate }}</span>
            <v-row dense v-if="$currentUser?.profile?.type === 'ADMIN'">
              <v-col cols="12" lg="6">
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
          <v-card-subtitle>
            <span>
              Encontrado um total de
              {{ $shedules.length }} agendamento(s)
            </span>
          </v-card-subtitle>
          <v-cad-text>
            <div class="w-100 px-4">
              <v-list density="compact">
                <v-list-subheader>Consultas</v-list-subheader>
                <v-list-item
                  v-for="item in $shedules"
                  :key="item.id"
                  :value="item.id"
                >
                  <template v-slot:prepend>
                    <v-avatar variant="flat" color="primary">
                      <span>
                        {{
                          getInitials(
                            `${item.PatientConsultation?.Patient?.name} ${item.PatientConsultation?.Patient?.surname}`
                          )
                        }}
                      </span>
                    </v-avatar>
                  </template>
                  <template v-slot:append>
                    <v-btn
                      color="purple-darken-2"
                      icon
                      variant="text"
                      @click="
                        item.PatientConsultation?.status === 'scheduled'
                          ? handleServiceDetails(item)
                          : handleShowMedicalReportForm(item)
                      "
                    >
                      <v-icon
                        :icon="
                          item.PatientConsultation?.status === 'scheduled'
                            ? 'mdi-stethoscope'
                            : 'mdi-file-document-edit-outline'
                        "
                        size="25"
                        :color="
                          item.PatientConsultation?.status === 'scheduled'
                            ? 'purple-darken-2'
                            : 'info'
                        "
                      />
                      <v-tooltip
                        activator="parent"
                        location="top center"
                        content-class="tooltip-background"
                      >
                        {{
                          item.PatientConsultation?.status === "scheduled"
                            ? "Iniciar consulta"
                            : "Redigir laudo"
                        }}
                      </v-tooltip>
                    </v-btn>
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
                        {{ dayjs(item.scheduleDate).format("DD/MM/YYYY") }} ás
                        {{ item.scheduleHour }}
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
                      v-if="$currentUser?.profile?.type === 'ADMIN'"
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
            hide-actions
            hide-title
            hide-header
            elevation="8"
            rounded="lg"
            color="primary"
            @update:model-value="getSchedules"
          />
        </v-locale-provider>
      </v-col>
    </v-row>
    <DialogLoading :dialog="loading" />
    <ScheduleServiceDetails
      v-model="serviceDetails"
      @start-query="getSchedules"
    />
    <MedicalReport v-model="showMedicalReportForm" />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const auth = useAuthStore();
const scheduleStore = useScheduleStore();
const solicitationStore = useSolicitationConsultationStore();
const { getInitials } = useUtils();

const serviceDetails = ref(false);
const showMedicalReportForm = ref(false);
const model = reactive({
  date: new Date(),
  medic: undefined as UserProps | undefined,
  patient: undefined as PatientProps | undefined,
});

const loading = ref(false);

const $currentUser = computed(() => auth.$currentUser);
const $shedules = computed(() => scheduleStore.$schedulesForMedics || []);

const formattedDate = computed(() => {
  const data = new Date();

  const diaSemana = daysOfWeek[data.getDay()];
  const dia = data.getDate();
  const mes = months[data.getMonth()];
  const ano = data.getFullYear();

  return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
});

// const allowedDates = (val: any) => {
//   const today = dayjs().add(-1, "days");
//   const date = dayjs(val as Date);

//   if (dayjs(date).isBefore(today)) {
//     return false;
//   }

//   return true;
// };

const getSchedules = async () => {
  if (!model.date) return;

  loading.value = true;
  try {
    await scheduleStore.indexForMedic({
      scheduleDate: dayjs(model.date).format("YYYY-MM-DD"),
      medicId: model.medic?.id,
      patientId: model.patient?.id,
    });
  } finally {
    loading.value = false;
  }
};

const handleServiceDetails = async (item: ScheduleProps) => {
  await scheduleStore.show(item.publicId!);
  serviceDetails.value = true;
};

const handleShowMedicalReportForm = async (item: ScheduleProps) => {
  if (item.status === "completed") {
    push.warning(
      "Consulta já finalizada, con laudo médico informado, acesse módulo de laudos para mais detalhes"
    );
    return;
  }

  await scheduleStore.show(item.publicId!);
  await solicitationStore.show(item.PatientConsultation?.publicId!);
  showMedicalReportForm.value = true;
};
</script>
