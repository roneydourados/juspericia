<template>
  <v-card color="transparent" elevation="0">
    <v-card-title class="d-flex flex-column py-8" style="gap: 0.5rem">
      <HeaderPage title="Horários agendados" font-size="1.8rem" />

      <span class="text-grey-darken-1">{{ formattedDate }}</span>
      <v-row dense>
        <v-col cols="12" lg="3" v-if="$currentUser?.profile?.type === 'ADMIN'">
          <SelectSearchMedic
            v-model="model.medic"
            @update:model-value="getSchedules"
            clearable
          />
        </v-col>
        <v-col cols="12" lg="4">
          <SelectSearchPatient
            v-model="model.patient"
            @update:model-value="getSchedules"
            clearable
          />
        </v-col>
        <v-col cols="12" lg="3" class="d-flex flex-wrap" style="gap: 0.5rem">
          <DatePicker label="Data inicial" v-model="model.initialDate" />
          <DatePicker label="Data final" v-model="model.finalDate" />
        </v-col>

        <v-col cols="12" lg="2">
          <Button color="primary" @click="getSchedules" size="small">
            <v-icon icon="mdi-filter-outline" color="colorIcon" />
            <span class="text-caption"> Filtrar </span>
          </Button>
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
      <Table title="" :headers="headers" :items="$shedules" :show-crud="false">
        <template v-slot:item.PatientConsultation.Patient="{ item }">
          {{ item.PatientConsultation?.Patient?.name }}
        </template>
        <template v-slot:item.Medic="{ item }">
          {{ item.Medic ? item.Medic.name : "Não informado" }}
        </template>
        <template v-slot:item.scheduleDate="{ item }">
          {{ dayjs(item.scheduleDate).format("DD/MM/YYYY") }} as
          {{ item.scheduleHour }}
        </template>
        <template v-slot:item.patientConsultationId="{ item }">
          <Button
            variant="outlined"
            size="small"
            color="grey"
            @click="handleGoSolicitation(item)"
          >
            <v-icon
              icon="mdi-file-document-edit-outline"
              color="colorIcon"
              start
            />
            <strong class="text-primary">
              {{ item.patientConsultationId }}
            </strong>
          </Button>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusProps(item.status).color"
            :prepend-icon="getStatusProps(item.status).icon"
          >
            <span class="text-caption">
              {{ getStatusProps(item.status).text }}
            </span>
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            v-if="item.status === 'completed'"
            color="primary"
            icon
            variant="text"
            @click="handleReportDetails(item)"
          >
            <v-icon
              icon="mdi-file-document-arrow-right-outline"
              color="colorIcon"
            />
            <v-tooltip
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Detalhes do laudo gerado
            </v-tooltip>
          </v-btn>
          <v-btn
            v-else
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
      </Table>
    </v-cad-text>
  </v-card>

  <!-- <pre>{{ $shedules }}</pre> -->
  <DialogLoading :dialog="loading" />
  <ScheduleServiceDetails
    v-model="serviceDetails"
    @start-query="getSchedules"
  />
  <MedicalReport v-model="showMedicalReportForm" />
  <MedicalReportDetails v-model="showReportDetails" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";
const auth = useAuthStore();
const scheduleStore = useScheduleStore();
const solicitationStore = useSolicitationConsultationStore();
const consultationReport = usePatientConsultationReportStore();

const { getInitials } = useUtils();
const router = useRouter();
// const { mobile } = useDisplay();

const serviceDetails = ref(false);
const showMedicalReportForm = ref(false);
const model = reactive({
  date: new Date(),
  medic: undefined as UserProps | undefined,
  patient: undefined as PatientProps | undefined,
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
});
const loading = ref(false);
const showReportDetails = ref(false);
const headers = computed(() => {
  if ($currentUser.value?.profile?.type === "MEDICO") {
    return [
      {
        title: "Paciente",
        key: "PatientConsultation.Patient",
      },
      {
        title: "Agendamento",
        key: "scheduleDate",
      },
      {
        title: "Status",
        key: "status",
      },
      {
        title: "Ações",
        key: "actions",
      },
    ];
  }

  return [
    {
      title: "Paciente",
      key: "PatientConsultation.Patient",
    },
    {
      title: "Médico",
      key: "Medic",
    },
    {
      title: "Agendamento",
      key: "scheduleDate",
    },
    {
      title: "Nº Solicitação",
      key: "patientConsultationId",
    },
    {
      title: "Status",
      key: "status",
    },
    {
      title: "Ações",
      key: "actions",
    },
  ];
});

const $currentUser = computed(() => auth.$currentUser);
const $shedules = computed(() => scheduleStore.$all?.schedules || []);
const $solicitation = computed(() => solicitationStore.$single);

const formattedDate = computed(() => {
  const data = new Date();

  const diaSemana = daysOfWeek[data.getDay()];
  const dia = data.getDate();
  const mes = months[data.getMonth()];
  const ano = data.getFullYear();

  return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
});

const getSchedules = async () => {
  if (!model.date) return;

  loading.value = true;
  try {
    if ($currentUser.value?.profile?.type !== "MEDICO") {
      await scheduleStore.index({
        initialDate: model.initialDate,
        finalDate: model.finalDate,
        patientId: model.patient?.id,
        medicId: model.medic?.id,
      });
    } else {
      await scheduleStore.indexForMedic({
        initialDate: model.initialDate,
        finalDate: model.finalDate,
        patientId: model.patient?.id,
      });
    }
  } finally {
    loading.value = false;
  }
};

const handleGoSolicitation = (item: ScheduleProps) => {
  router.push(`/solicitations/${item.PatientConsultation?.publicId}`);
};

const getStatusProps = (status: string) => {
  switch (status) {
    case "completed":
      return {
        color: "green",
        text: "Concluído",
        icon: "mdi-check",
      };
    case "cancelled":
      return {
        color: "red",
        text: "Cancelado",
        icon: "mdi-close",
      };
    case "pending":
      return {
        color: "orange",
        text: "Pendente",
        icon: "mdi-clock-outline",
      };
    default:
      return {
        color: "blue",
        text: "Agendado",
        icon: "mdi-calendar-month",
      };
  }
};

const handleServiceDetails = async (item: ScheduleProps) => {
  loading.value = true;
  try {
    await scheduleStore.show(item.publicId!);
    await solicitationStore.show(item.PatientConsultation?.publicId!);
    serviceDetails.value = true;
  } finally {
    loading.value = false;
  }
};

const handleShowMedicalReportForm = async (item: ScheduleProps) => {
  if (item.status === "completed") {
    push.warning(
      "Consulta já finalizada, con laudo médico informado, acesse módulo de laudos para mais detalhes"
    );
    return;
  }

  loading.value = true;
  try {
    await scheduleStore.show(item.publicId!);
    await solicitationStore.show(item.PatientConsultation?.publicId!);
    showMedicalReportForm.value = true;
  } finally {
    loading.value = false;
  }
};

const handleReportDetails = async (item: ScheduleProps) => {
  loading.value = true;
  try {
    await solicitationStore.show(item.PatientConsultation?.publicId!);

    if ($solicitation.value?.PatientConsultationReport?.publicId) {
      await consultationReport.show(
        $solicitation.value?.PatientConsultationReport?.publicId!
      );

      await consultationReport.show(
        $solicitation.value?.PatientConsultationReport?.publicId!
      );

      showReportDetails.value = true;
    }
  } finally {
    loading.value = false;
  }
};
</script>
