<template>
  <v-card flat elevation="8" rounded="lg">
    <v-card-title
      class="d-flex align-center justify-space-between pa-6"
      style="gap: 1rem; font-size: 1rem"
    >
      <div class="d-flex align-center" style="gap: 1rem">
        <span class="text-blue font-weight-bold">#{{ solicitation.id }}</span>
        <span class="text-truncate">
          Solicitação {{ solicitation.Consultation?.consultationName }}
        </span>
      </div>

      <div class="d-flex align-center" style="gap: 1rem">
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
          :color="solicitation.status === 'open' ? 'info' : 'success'"
        >
          <div class="d-flex" style="gap: 0.5rem">
            <span>Status:</span>
            <span class="font-weight-bold">
              {{ returnStatus(solicitation.status ?? "open") }}
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
            amountFormated(solicitation.Consultation?.value ?? 0, true)
          }}</span>
        </v-col>
        <v-col cols="12" lg="2" class="d-flex align-center" style="gap: 0.5rem">
          <span>Valor atencipação:</span>
          <span class="font-weight-bold">
            {{
              amountFormated(
                solicitation.Consultation?.valueAntecipation ?? 0,
                true
              )
            }}
          </span>
        </v-col>
      </v-row>
      <v-row dense> </v-row>
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
                Number(solicitation.Consultation?.value) +
                  Number(solicitation.Consultation?.valueAntecipation),
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
            :disabled="
              !!solicitation.dateCorrection ||
              moment(solicitation.deadline).isAfter()
            "
            @click="showDateCorrection = true"
          >
            Solicitar correção
          </v-btn>
        </v-col>
        <v-col cols="12" lg="2">
          <v-btn
            class="text-none font-weight-bold"
            prepend-icon="mdi-calendar-clock-outline"
            color="info"
            :disabled="!!solicitation.dateAntecipation"
            @click="showDateAntecipation = true"
          >
            Solicitar antecipação
          </v-btn>
        </v-col>
        <v-col cols="12" lg="2">
          <v-btn
            class="text-none font-weight-bold"
            prepend-icon="mdi-dots-vertical"
            color="pink"
            @click="handleDetailsClick(solicitation.id!)"
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
            :disabled="Number(solicitation.tipValue) > 0"
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
  <SolicitationFormDate
    title="Data para correção"
    v-model:show="showDateCorrection"
    @close="handleUpdateCorrectionDate($event)"
  />
  <SolicitationFormDate
    title="Data para antecipação"
    v-model:show="showDateAntecipation"
    @close="handleUpdateAntecipationDate($event)"
  />
  <SolicitationTipValue
    title="Valor da gorjeta"
    v-model:show="showTipValue"
    @close="handleTipValue($event)"
  />
  <DialogLoading :dialog="loading" />
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
const { amountFormated, getSolicitationsFilters } = useUtils();

const isRate = ref(false);
const showDateCorrection = ref(false);
const showDateAntecipation = ref(false);
const showTipValue = ref(false);
const loading = ref(false);
const filters = ref(getSolicitationsFilters());
const $currentUser = computed(() => auth.$currentUser);

watch(
  () => props.solicitation.id,
  () => {
    isRate.value = Number(props.solicitation.rate ?? 0) <= 0;
  },
  { immediate: true }
);

const handleDetailsClick = async (id: number) => {
  await rounter.push(`/solicitations/${id}`);
};

const returnStatus = (status: string) => {
  switch (status.trim().toLowerCase()) {
    case "open":
      return "Pendente";
    case "in_progress":
      return "Em andamento";
    case "scheduled":
      return "Agendada";
    case "finished":
      return "Finalizada";
    default:
      return "Pendente";
  }
};

const editItem = (item: SolicitationConsultationProps) => {
  emit("edit", item);
};

const handleUpdateCorrectionDate = async (date: string) => {
  showDateCorrection.value = false;
  if (date) {
    loading.value = true;
    try {
      await storeConsultation.update({
        id: props.solicitation.id,
        dateCorrection: date,
      });

      await getSolicitations();
    } finally {
      loading.value = false;
    }
  }
};

const handleUpdateAntecipationDate = async (date: string) => {
  showDateAntecipation.value = false;
  if (date) {
    loading.value = true;
    try {
      await storeConsultation.update({
        id: props.solicitation.id,
        dateAntecipation: date,
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
</script>
