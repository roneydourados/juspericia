<template>
  <v-card flat elevation="8" rounded="lg">
    <v-card-title
      class="d-flex align-center justify-space-between pa-6"
      style="gap: 1rem; font-size: 1rem"
    >
      <div class="d-flex align-center" style="gap: 1rem">
        <!-- <span class="text-blue font-weight-bold">#{{ solicitation.id }}</span> -->
        <span class="text-truncate font-weight-bold">
          Solicitação {{ solicitation.Consultation?.consultationName }}
        </span>
        <div
          class="d-flex align-center flex-wrap text-deep-purple"
          style="gap: 0.5rem"
          v-if="solicitation.Schedule && solicitation.Schedule.length > 0"
        >
          <span> Agendado: </span>
          <strong>
            {{
              moment(solicitation.Schedule[0].scheduleDate).format("DD/MM/YYYY")
            }}
            as
            {{ solicitation.Schedule[0].scheduleHour }}
          </strong>

          Dr(a):
          <strong>
            {{ solicitation.Schedule[0].Medic?.name }}
          </strong>
        </div>
      </div>

      <div class="d-flex align-center" style="gap: 1rem">
        <v-btn
          v-if="
            $currentUser?.Profile.type === 'ADMIN' &&
            (solicitation.status === 'open' ||
              solicitation.status === 'scheduled')
          "
          :color="solicitation.status === 'open' ? 'success' : 'warning'"
          size="small"
          variant="flat"
          class="text-none text-white"
          @click="handleSchedule(solicitation)"
        >
          <v-icon icon="mdi-calendar-clock" start color="white"></v-icon>
          <span class="text-white">
            {{ solicitation.status === "open" ? "Agendar" : "Reagendar" }}
          </span>
        </v-btn>

        <v-btn
          prepend-icon="mdi-cancel"
          color="error"
          size="small"
          variant="outlined"
          class="text-none text-white"
          @click="getItemCancel(solicitation)"
          :disabled="solicitation.status !== 'open'"
        >
          Cancelar
        </v-btn>
        <v-btn
          prepend-icon="mdi-pencil-outline"
          color="orange"
          size="small"
          variant="outlined"
          class="text-none text-white"
          @click="editItem(solicitation)"
          :disabled="solicitation.status !== 'open'"
        >
          Editar
        </v-btn>
        <v-chip
          label
          :color="solicitationStatusColor(solicitation.status ?? 'open')"
        >
          <div class="d-flex" style="gap: 0.5rem">
            <span>Status: </span>
            <span class="font-weight-bold">
              {{ solicitationStatusName(solicitation.status ?? "open") }}
            </span>
          </div>
        </v-chip>
      </div>
    </v-card-title>
    <v-card-text class="px-8">
      <v-row dense>
        <v-col cols="12" lg="2" class="d-flex align-center" style="gap: 0.5rem">
          <span>Solicitado:</span>
          <span class="font-weight-bold">
            {{ moment(solicitation.dateOpen).format("DD/MM/YYYY") }}
          </span>
        </v-col>
        <v-col cols="12" lg="3" class="d-flex align-center" style="gap: 0.5rem">
          <span>Solicitante:</span>
          <span class="font-weight-bold">
            {{ solicitation.Patient?.User?.name }}
          </span>
        </v-col>
        <v-col cols="12" lg="3" class="d-flex align-center" style="gap: 0.5rem">
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
        <v-col cols="12" lg="4" class="d-flex align-center" style="gap: 0.5rem">
          <span>Nº Processo:</span>
          <span class="font-weight-bold">
            {{ solicitation.proccessNumber }}
          </span>
        </v-col>
      </v-row>
      <v-row v-if="$currentUser?.Profile.type !== 'MEDICO'" dense>
        <v-col cols="12" lg="2" class="d-flex align-center" style="gap: 0.5rem">
          <span>Valor:</span>
          <span class="font-weight-bold">{{
            amountFormated(solicitation.consultationValue ?? 0, true)
          }}</span>
        </v-col>
        <v-col cols="12" lg="3" class="d-flex align-center" style="gap: 0.5rem">
          <span>Valor atencipação:</span>
          <span class="font-weight-bold">
            {{ amountFormated(solicitation.antecipationValue ?? 0, true) }}
          </span>
        </v-col>
        <v-col cols="12" lg="3" class="d-flex align-center" style="gap: 0.5rem">
          <span>Tipo benefício:</span>
          <span class="font-weight-bold">
            {{ solicitation.BenefitType?.name }}
          </span>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="6" class="d-flex align-center" style="gap: 0.5rem">
          <span>Paciente:</span>
          <span class="font-weight-bold">
            {{ solicitation.Patient?.name }}
            {{ solicitation.Patient?.surname }}
          </span>
        </v-col>
        <v-col
          v-if="solicitation.Medic"
          cols="12"
          lg="6"
          class="d-flex align-center"
          style="gap: 0.5rem"
        >
          <span>Médico:</span>
          <span class="font-weight-bold">{{ solicitation.Medic?.name }}</span>
          <span>CRM:</span>
          <span class="font-weight-bold">
            {{ solicitation.Medic?.crm }}/{{ solicitation.Medic?.crmUf }}
          </span>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col
          cols="12"
          lg="10"
          class="d-flex align-center"
          style="gap: 0.5rem"
        >
          <span>Data limite para solicitar correção:</span>
          <span class="font-weight-bold">
            {{ moment(solicitation.deadline).format("DD/MM/YYYY") }}
          </span>

          <span>Data de solicitação de correção:</span>
          <span class="font-weight-bold">
            {{
              solicitation.dateCorrection
                ? moment(solicitation.dateCorrection).format("DD/MM/YYYY")
                : "Não solicitado"
            }}
          </span>
          <span>Data de solicitação de atencipação:</span>
          <span class="font-weight-bold">
            {{
              solicitation.dateAntecipation
                ? moment(solicitation.dateAntecipation).format("DD/MM/YYYY")
                : "Não solicitado"
            }}
          </span>
        </v-col>
        <v-col
          v-if="$currentUser?.Profile.type !== 'MEDICO'"
          cols="12"
          lg="2"
          class="d-flex align-center justify-end"
          style="gap: 0.5rem"
        >
          <span class="text-grey-darken-1">Total:</span>
          <span
            class="font-weight-bold text-blue-darken-3"
            style="font-size: 1.3rem"
          >
            {{
              amountFormated(
                Number(solicitation.consultationValue ?? 0) +
                  Number(solicitation.antecipationValue ?? 0),
                true
              )
            }}
          </span>
        </v-col>
      </v-row>
      <v-divider class="mt-2" />
    </v-card-text>
    <v-card-actions v-if="$currentUser?.Profile.type !== 'MEDICO'" class="px-8">
      <v-row dense align="center">
        <v-col cols="12" lg="2">
          <v-btn
            class="text-none font-weight-bold"
            prepend-icon="mdi-file-document-refresh-outline"
            color="indigo"
            @click="showDateCorrection = true"
            :disabled="
              !solicitation.isSolicitationCorrection ||
              solicitation.status === 'canceled' ||
              solicitation.status === 'finished'
            "
          >
            Solicitar correção
          </v-btn>
        </v-col>
        <v-col cols="12" lg="2">
          <v-btn
            class="text-none font-weight-bold"
            prepend-icon="mdi-calendar-clock-outline"
            color="info"
            :disabled="
              !!solicitation.dateAntecipation ||
              solicitation.status === 'canceled' ||
              solicitation.status === 'finished'
            "
            @click="getItemAntecipation(solicitation)"
          >
            Solicitar antecipação
          </v-btn>
        </v-col>
        <v-col cols="12" lg="2">
          <v-btn
            class="text-none font-weight-bold"
            prepend-icon="mdi-dots-vertical"
            color="pink"
            @click="handleDetailsClick(solicitation.publicId!)"
          >
            Visualizar detalhes
          </v-btn>
        </v-col>
        <v-col cols="12" lg="2">
          <v-btn
            class="text-none font-weight-bold"
            prepend-icon="mdi-cash-multiple"
            color="success"
            @click="showTipValue = true"
            :disabled="
              Number(solicitation.tipValue) > 0 ||
              solicitation.status === 'canceled'
            "
          >
            Dar Gorjeta
          </v-btn>
        </v-col>
        <v-col cols="12" lg="3" class="d-flex align-center px-4">
          <v-btn
            v-if="solicitation.rate === 0"
            class="text-none font-weight-bold"
            prepend-icon="mdi-star"
            color="orange-darken-1"
            @click="solicitation.rate = 1"
            :disabled="solicitation.status === 'canceled'"
          >
            Avaliar solicitação
          </v-btn>
          <div v-if="solicitation.rate ?? 0 > 0" class="text-center">
            <v-rating
              v-model="solicitation.rate"
              active-color="orange-darken-1"
              color="orange-lighten-1"
              :readonly="!isRate"
            />
            <v-btn
              v-if="isRate"
              class="text-none font-weight-bold"
              prepend-icon="mdi-check"
              color="orange-darken-1"
              variant="text"
              @click="handleUpdateRate(solicitation.rate ?? 0)"
            >
              Enviar avaliação
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
  <SolicitationCorrectionForm
    title="Solicitação de correção"
    v-model:show="showDateCorrection"
    @close="handleUpdateCorrection($event)"
  />
  <SolicitationAntecipationForm
    title="Solicitar antecipação"
    v-model:show="showDateAntecipation"
    :data="selected?.Consultation"
    @close="handleUpdateAntecipation($event)"
  />
  <SolicitationTipValue
    title="Valor da gorjeta"
    v-model:show="showTipValue"
    @close="handleTipValue($event)"
  />
  <ScheduleForm
    v-model="showSolicitationSchedule"
    :solicitation="selected"
    @update:model-value="
      !showSolicitationSchedule ? (selected = undefined) : selected
    "
    @scheduled="getSolicitations()"
    width="40%"
  />
  <DialogLoading :dialog="loading" />
  <Dialog
    title="Cancelar consulta"
    :dialog="showCancel"
    @cancel="showCancel = false"
    @confirm="cancel"
  >
    Tem certeza que deseja cancelar a consulta?
  </Dialog>
  <!-- <pre>{{ solicitation }}</pre> -->
</template>

<script setup lang="ts">
import moment from "moment";

const props = defineProps({
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => {},
  },
});

const emit = defineEmits(["edit"]);
const auth = useAuthStore();
const storeConsultation = useSolicitationConsultationStore();
const rounter = useRouter();
const {
  amountFormated,
  getSolicitationsFilters,
  solicitationStatusName,
  solicitationStatusColor,
} = useUtils();

const selected = ref<SolicitationConsultationProps>();
const isRate = ref(false);
const showDateCorrection = ref(false);
const showDateAntecipation = ref(false);
const showCancel = ref(false);
const showTipValue = ref(false);
const loading = ref(false);
const showSolicitationSchedule = ref(false);
const filters = ref(getSolicitationsFilters());
const $currentUser = computed(() => auth.$currentUser);

watch(
  () => props.solicitation.id,
  () => {
    isRate.value = Number(props.solicitation.rate ?? 0) <= 0;
  },
  { immediate: true }
);

const handleDetailsClick = async (id: string) => {
  await rounter.push(`/solicitations/${id}`);
};

const editItem = (item: SolicitationConsultationProps) => {
  emit("edit", item);
};

const handleUpdateCorrection = async (motive: string) => {
  showDateCorrection.value = false;
  if (motive) {
    loading.value = true;
    try {
      await storeConsultation.update({
        id: props.solicitation.id,
        reasonCorrection: motive,
        dateCorrection: moment().format("YYYY-MM-DD"),
      });

      await getSolicitations();
    } finally {
      loading.value = false;
    }
  }
};

const handleUpdateAntecipation = async (value: number) => {
  showDateAntecipation.value = false;
  if (value) {
    loading.value = true;
    try {
      await storeConsultation.update({
        id: props.solicitation.id,
        dateAntecipation: moment().format("YYYY-MM-DD"),
        antecipationValue: value,
      });

      await getSolicitations();
    } finally {
      loading.value = false;
    }
  }
};

const handleTipValue = async (value: number) => {
  if (value && value > 0) {
    loading.value = true;
    try {
      await storeConsultation.update({
        id: props.solicitation.id,
        tipValue: value,
      });

      await getSolicitations();
    } finally {
      loading.value = false;
    }
  }
};

const handleUpdateRate = async (rate: number) => {
  await storeConsultation.update({
    id: props.solicitation.id,
    rate,
  });
  isRate.value = false;
};

const getSolicitations = async () => {
  await storeConsultation.index(filters.value);
};

const getItemCancel = (item: SolicitationConsultationProps) => {
  selected.value = item;
  showCancel.value = true;
};

const getItemAntecipation = (item: SolicitationConsultationProps) => {
  selected.value = item;
  showDateAntecipation.value = true;
};

const cancel = async () => {
  showCancel.value = false;
  if (!selected.value) return;

  loading.value = true;

  try {
    await storeConsultation.update({
      ...selected.value,
      status: "canceled",
    });
    await getSolicitations();
    selected.value = undefined;
  } finally {
    loading.value = false;
  }
};

const handleSchedule = (item: SolicitationConsultationProps) => {
  selected.value = item;
  showSolicitationSchedule.value = true;
};
</script>
