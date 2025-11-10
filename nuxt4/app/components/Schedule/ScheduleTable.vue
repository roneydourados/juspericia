<template>
  <v-card color="transparent" elevation="0">
    <v-card-title class="d-flex flex-column py-8" style="gap: 0.5rem">
      <HeaderPage title="Fluxo Agenda" font-size="1.8rem" />
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
          <SelectInput
            label="Status"
            v-model="model.status"
            item-title="title"
            item-value="value"
            :items="[
              { title: 'Ativo', value: 'active' },
              { title: 'Concluído', value: 'completed' },
            ]"
            @update:model-value="getSchedules"
          />
        </v-col>

        <v-col cols="12">
          <div class="d-flex align-center justify-space-between w-100">
            <Button color="primary" @click="getSchedules" size="small">
              <v-icon icon="mdi-filter-outline" color="colorIcon" />
              <span class="text-caption"> Filtrar </span>
            </Button>

            <div
              class="d-flex align-center"
              v-if="isTimerActive"
              style="gap: 0.5rem"
            >
              <span class="text-primary font-weight-bold">
                Agenda será atualizada em
              </span>
              <v-progress-circular
                :model-value="
                  ((countDownDefaultValue - countdown) /
                    countDownDefaultValue) *
                  100
                "
                size="30"
                width="3"
                color="primary"
              >
                <span class="text-caption">{{ countdown }}</span>
              </v-progress-circular>
            </div>
          </div>
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
      <Table
        v-if="!mobile"
        title=""
        :headers="headers"
        :items="$shedules"
        :show-crud="false"
      >
        <template v-slot:item.PatientConsultation.Patient="{ item }">
          <span
            :class="`${
              item.Medic
                ? ''
                : $currentUser?.profile?.type !== 'MEDICO'
                ? 'text-red font-weight-bold'
                : ''
            }`"
          >
            {{ item.PatientConsultation?.Patient?.name }}
          </span>
        </template>
        <template v-slot:item.Medic="{ item }">
          <span v-if="item.Medic">
            {{ item.Medic ? item.Medic.name : "Não vinculado" }}
          </span>
          <Button
            v-else
            variant="text"
            @click="handleLinkMedic(item.PatientConsultation)"
          >
            <v-icon icon="mdi-stethoscope" start color="red" />
            <span
              :class="`text-caption ${
                item.Medic ? 'text-primary' : 'text-red'
              }`"
            >
              Vincular médico
            </span>
          </Button>
        </template>
        <template v-slot:item.scheduleDate="{ item }">
          <span
            :class="`${
              item.Medic
                ? ''
                : $currentUser?.profile?.type !== 'MEDICO'
                ? 'text-red font-weight-bold'
                : ''
            }`"
          >
            {{ dayjs(item.scheduleDate).format("DD/MM/YYYY") }} as
            {{ item.scheduleHour }}
            ({{ getWeekdayShort(item.scheduleDate) }})
          </span>
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
          <div class="d-flex align-center w-100">
            <div v-if="item.status === 'active'" class="d-flex">
              <v-btn
                color="primary"
                icon
                variant="text"
                @click="handleCancelSchedule(item.publicId)"
                size="x-small"
              >
                <v-icon icon="mdi-account-off-outline" color="red" />
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                >
                  Paciente não compareceu a consulta
                </v-tooltip>
              </v-btn>
              <v-btn
                color="primary"
                icon
                variant="text"
                @click="handleFinalizeSchedule(item)"
                :disabled="
                  (!item.medicId || !item.nuvidioCallId) &&
                  $currentUser?.profile?.type !== 'ADMIN'
                "
                size="x-small"
              >
                <v-icon icon="mdi-clock-check-outline" color="colorIcon" />
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                >
                  Finalizar atendiento
                </v-tooltip>
              </v-btn>
              <v-btn
                color="purple-darken-2"
                icon
                variant="text"
                @click="handleServiceDetails(item)"
                size="x-small"
              >
                <v-icon icon="mdi-stethoscope" size="20" color="purple" />
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                >
                  Iniciar teleatendimento
                </v-tooltip>
              </v-btn>
            </div>
            <v-btn
              v-if="item.status === 'completed' && item.nuvidioCallId"
              color="purple-darken-2"
              icon
              variant="text"
              @click="handleDownloadRecord(item)"
              size="x-small"
            >
              <v-icon icon="mdi-video-outline" size="20" color="purple" />
              <v-tooltip
                activator="parent"
                location="top center"
                content-class="tooltip-background"
              >
                Baixar gravação do atendimento
              </v-tooltip>
            </v-btn>
            <v-btn
              v-if="
                item.status === 'completed' &&
                item.PatientConsultation?.PatientConsultationReport
              "
              color="primary"
              icon
              variant="text"
              @click="handleReportDetails(item)"
              size="x-small"
            >
              <v-icon
                icon="mdi-file-document-arrow-right-outline"
                color="info"
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
              v-if="
                item.status === 'completed' &&
                !item.PatientConsultation?.PatientConsultationReport
              "
              color="primary"
              icon
              variant="text"
              @click="handleShowMedicalReportForm(item)"
              size="x-small"
            >
              <v-icon icon="mdi-file-document-edit-outline" color="colorIcon" />
              <v-tooltip
                activator="parent"
                location="top center"
                content-class="tooltip-background"
              >
                Escrever laudo
              </v-tooltip>
            </v-btn>
          </div>
        </template>
      </Table>
      <ScheduleTableMobile
        v-else
        @medical-report-form="handleShowMedicalReportForm($event)"
        @service-details="handleServiceDetails($event)"
        @finish="handleFinalizeSchedule($event)"
        @report-details="handleReportDetails($event)"
        @download-media="handleDownloadRecord($event)"
      />
    </v-cad-text>
  </v-card>

  <!-- <pre>{{ $shedules }}</pre> -->
  <DialogLoading :dialog="loading" />
  <ScheduleServiceDetails
    v-model="serviceDetails"
    @start-query="getSchedules"
  />
  <MedicalReport v-model="showMedicalReportForm" @close="getSchedules" />
  <MedicalReportDetails v-model="showReportDetails" />
  <SolicitatiomSetScheduleMedic
    v-model:show="showSetMedicSchedule"
    :solicitation="$solicitation"
    @close="getSchedules"
  />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";
const auth = useAuthStore();
const scheduleStore = useScheduleStore();
const solicitationStore = useSolicitationConsultationStore();
const consultationReport = usePatientConsultationReportStore();
const nuvidioStore = useNuvidioStore();

//const { getInitials } = useUtils();
const router = useRouter();
const { mobile } = useDisplay();

const countDownDefaultValue = 90;

const autoRefreshInterval = ref<NodeJS.Timeout | null>(null);
const countdown = ref(countDownDefaultValue);
const isTimerActive = ref(false);
const countdownInterval = ref<NodeJS.Timeout | null>(null);
const serviceDetails = ref(false);
const showMedicalReportForm = ref(false);
const showSetMedicSchedule = ref(false);

const model = reactive({
  date: new Date(),
  medic: undefined as UserProps | undefined,
  patient: undefined as PatientProps | undefined,
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  status: "active",
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
        title: "Especialidade",
        key: "PatientConsultation.medicalSpecialty.medicalSpecialty",
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
const $scheduleSingle = computed(() => scheduleStore.$single);

const formattedDate = computed(() => {
  const data = new Date();

  const diaSemana = daysOfWeek[data.getDay()];
  const dia = data.getDate();
  const mes = months[data.getMonth()];
  const ano = data.getFullYear();

  return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
});

onMounted(async () => {
  await getSchedules();
  startAutoRefresh();
  startCountdown(); // Start initial countdown
});

// Clean up interval when component is unmounted
onUnmounted(() => {
  stopAutoRefresh();
});

const getSchedules = async () => {
  // if (!model.date) return;
  // Para a contagem antes de executar a busca
  stopCountdown();

  loading.value = true;
  try {
    if ($currentUser.value?.profile?.type !== "MEDICO") {
      await scheduleStore.index({
        initialDate: model.initialDate,
        finalDate: model.finalDate,
        patientId: model.patient?.id,
        medicId: model.medic?.id,
        status: model.status,
      });
    } else {
      await scheduleStore.indexForMedic({
        initialDate: model.initialDate,
        finalDate: model.finalDate,
        patientId: model.patient?.id,
        status: model.status,
      });
    }
  } finally {
    loading.value = false;
    // Reinicia a contagem regressiva após executar getSchedules
    startCountdown();
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
    if (dayjs(item.scheduleDate).isAfter(dayjs())) {
      push.warning("Consulta fora do prazo de visualização!");
      return;
    }

    await scheduleStore.show(item.publicId!);

    if (
      $scheduleSingle.value?.medicId &&
      $scheduleSingle.value?.medicId !== $currentUser.value?.id
    ) {
      push.error(
        "Outro profissional selcionou este agendamento a tela será atualizada!"
      );

      await getSchedules();
      return;
    }

    await solicitationStore.show(item.PatientConsultation?.publicId!);
    serviceDetails.value = true;
  } finally {
    loading.value = false;
  }
};

const handleShowMedicalReportForm = async (item: ScheduleProps) => {
  if (
    item.status === "completed" &&
    item.PatientConsultation?.PatientConsultationReport
  ) {
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

const handleFinalizeSchedule = async (item: ScheduleProps) => {
  push.info({
    title: "Finalizar atendimento",
    message: "Confirma finalizar o atendimento?",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Finalizar",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            try {
              //finalizar agenda
              await scheduleStore.finalizeSchedule(item.patientConsultationId!);

              //setar finalizado para solicitação, deixando pronta para digitação de laudo
              const payload = {
                publicId: item.PatientConsultation?.publicId,
                isTelemedicine: false,
                status: "finished",
                dateClose: dayjs().format("YYYY-MM-DD"),
              };

              //desativar teleconsulta
              await solicitationStore.update(payload);
              await getSchedules();
            } catch (error) {
              console.log("🚀 ~ handleFinalizeSchedule ~ error:", error);
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

const handleCancelSchedule = async (publicId: string) => {
  push.info({
    title: "Cancelar atendimento",
    message: "Confirma o cancelamento do atendimento?",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Confirmar",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            loading.value = true;
            try {
              await scheduleStore.cancelSchedule(publicId);
              await getSchedules();
            } catch (error) {
              console.log("🚀 ~ handleCancelSchedule ~ error:", error);
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

// Start the countdown timer
const startCountdown = () => {
  // Limpa qualquer countdown anterior para evitar múltiplos intervalos
  stopCountdown();

  countdown.value = countDownDefaultValue;
  isTimerActive.value = true;

  countdownInterval.value = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      stopCountdown();
      // Quando o countdown termina, executa o refresh e reinicia
      refreshAndRestart();
    }
  }, 1000);
};

// Stop the countdown timer
const stopCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
    countdownInterval.value = null;
  }
  isTimerActive.value = false;
};

// Função para fazer refresh e reiniciar o countdown
const refreshAndRestart = async () => {
  await getSchedules();
  startCountdown();
};

// Start the auto-refresh interval (agora usa intervalo fixo)
const startAutoRefresh = () => {
  // Limpa qualquer intervalo anterior
  stopAutoRefresh();

  // Usa intervalo fixo baseado no valor padrão do countdown
  autoRefreshInterval.value = setInterval(async () => {
    await refreshAndRestart();
  }, countDownDefaultValue * 1000);
};

// Stop the auto-refresh interval
const stopAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value);
    autoRefreshInterval.value = null;
  }
  stopCountdown(); // Also stop countdown when stopping auto refresh
};

const handleDownloadRecord = async (item: ScheduleProps) => {
  if (!item.nuvidioCallId) {
    push.warning(
      "Agendamento ainda não possui uma chamada de vídeo totalmente finalizada."
    );
    return;
  }

  loading.value = true;
  try {
    const { file, fileName } = await nuvidioStore.getRecordCall(
      item.nuvidioCallId
    );

    // Exemplo: Se o fileStore.download retornar um blob com metadados do nome do arquivo
    const url = window.URL.createObjectURL(file);

    // Cria um link temporário
    const link = document.createElement("a");
    link.href = url;

    // Define o nome do arquivo
    link.download = `${fileName}`;

    // Adiciona e clica no link
    document.body.appendChild(link);
    link.click();

    // Remove o link temporário
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log("🚀 ~ handleDownloadRecord ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const getWeekdayShort = (date: string): string => {
  const day = dayjs(date).day();
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return weekdays[day] ?? "";
};

const handleLinkMedic = async (item: SolicitationConsultationProps) => {
  loading.value = true;
  try {
    await solicitationStore.show(item.publicId!);
    showSetMedicSchedule.value = true;
  } catch (error) {
    console.log("🚀 ~ handleLinkMedic ~ error:", error);
  } finally {
    loading.value = false;
  }
};
</script>
