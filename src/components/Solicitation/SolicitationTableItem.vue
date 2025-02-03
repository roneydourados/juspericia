<template>
  <v-card flat elevation="2" rounded="lg">
    <v-card-title
      class="d-flex align-center justify-space-between pa-6"
      style="gap: 1rem; font-size: 1rem"
    >
      <div class="d-flex align-center" style="gap: 1rem">
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

          <div v-if="$currentUser?.Profile.type === 'ADMIN'">
            Dr(a):
            <strong>
              {{ solicitation.Schedule[0].Medic?.name }}
            </strong>
          </div>
        </div>
      </div>

      <div class="d-flex align-center" style="gap: 1rem">
        <div
          v-if="solicitation.status === 'open'"
          class="d-flex align-center"
          style="gap: 0.5rem"
        >
          <v-btn
            class="text-none text-white"
            color="info"
            variant="outlined"
            size="small"
            @click="showSale = true"
          >
            <v-icon icon="mdi-credit-card-outline" size="24" start />
            Pagar
          </v-btn>
          <v-btn
            class="text-none text-white"
            color="success"
            variant="outlined"
            size="small"
            @click="handleUseCreditSalt"
          >
            <v-icon icon="mdi-cash-multiple" size="24" start />
            Utilzar Saldo
          </v-btn>
        </div>
        <v-btn
          v-else-if="solicitation.status === 'paid'"
          class="text-none text-white"
          color="success"
          variant="outlined"
          size="small"
          @click="handleReceipt(solicitation)"
        >
          <v-icon icon="mdi-file-document-outline" size="24" start />
          Recebido
        </v-btn>
        <v-btn
          v-else-if="
            solicitation.Sales &&
            solicitation.Sales.length > 0 &&
            solicitation.status === 'payment_pending'
          "
          class="text-none text-white"
          color="info"
          variant="outlined"
          size="small"
          @click="handleReloadPayment(solicitation)"
        >
          <v-icon icon="mdi-credit-card-outline" size="24" start />
          Pagar
        </v-btn>

        <v-btn
          v-else-if="
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
          :disabled="
            solicitation.status !== 'open' &&
            solicitation.status !== 'payment_pending'
          "
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
          class="d-flex flex-column"
        >
          <div class="d-flex align-center justify-end" style="gap: 0.5rem">
            <span class="text-grey-darken-1">Total:</span>
            <span
              class="font-weight-bold text-blue-darken-3"
              style="font-size: 1.3rem"
            >
              {{ amountFormated($solicitationTotal, true) }}
            </span>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mt-2" />
    </v-card-text>
    <v-card-actions v-if="$currentUser?.Profile.type !== 'MEDICO'" class="px-8">
      <v-row dense align="center">
        <v-col v-if="solicitation.status === 'finished'" cols="12" lg="2">
          <v-btn
            class="text-none font-weight-bold"
            prepend-icon="mdi-file-document-refresh-outline"
            color="indigo"
            @click="showDateCorrection = true"
            :disabled="!solicitation.isSolicitationCorrection"
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
        <v-col cols="12" lg="3">
          <v-btn
            v-if="solicitation.status === 'finished'"
            class="text-none font-weight-bold"
            prepend-icon="mdi-cash-multiple"
            color="success"
            @click="showTipValue = true"
            :disabled="Number(solicitation.tipValue) > 0"
          >
            Dar Gorjeta
          </v-btn>
          <v-btn
            v-if="solicitation.status === 'finished' && solicitation.rate! > 0"
            class="text-none font-weight-bold"
            prepend-icon="mdi-file-document-edit"
            color="info"
          >
            Laudo
          </v-btn>
        </v-col>
        <v-col cols="12" lg="3" class="d-flex align-center px-4">
          <v-btn
            v-if="solicitation.rate === 0 && solicitation.status === 'finished'"
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
              :size="24"
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
    width="50%"
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
  <Dialog
    title="Pagamento de solicitação"
    :dialog="showSale"
    @cancel="showSale = false"
    @confirm="handleSaleItemForAsaas"
    show-cancel
  >
    <div class="d-flex flex-column">
      <span>Confirma pagamento da solicitação de consulta ? </span>
      <div class="d-flex" style="gap: 0.5rem">
        Total: <strong>{{ amountFormated($solicitationTotal, false) }}</strong>
      </div>
    </div>
  </Dialog>
  <UserCreditSaltForm v-model="showSaltCredit" :solicitation="solicitation" />
  <SolicitationPaymentReciptSalt
    v-model="showRecipt"
    :solicitation="solicitation"
  />

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
const asaas = useAsaasStore();
const storeConsultation = useSolicitationConsultationStore();
const rounter = useRouter();
const {
  amountFormated,
  getSolicitationsFilters,
  solicitationStatusName,
  solicitationStatusColor,
} = useUtils();
const saltCredit = useUserCreditSaltStore();

const selected = ref<SolicitationConsultationProps>();
const showSaltCredit = ref(false);
const isRate = ref(false);
const showDateCorrection = ref(false);
const showDateAntecipation = ref(false);
const showCancel = ref(false);
const showTipValue = ref(false);
const loading = ref(false);
const showSale = ref(false);
const showRecipt = ref(false);
const showSolicitationSchedule = ref(false);
const filters = ref(getSolicitationsFilters());
const $currentUser = computed(() => auth.$currentUser);
const $solicitationTotal = computed(() => {
  return (
    Number(props.solicitation.consultationValue ?? 0) +
    Number(props.solicitation.antecipationValue ?? 0)
  );
});

const $paymentResponse = computed(() => asaas.$paymentReponse);

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
    publicId: props.solicitation.publicId,
    rate,
  });
  isRate.value = false;
};

const getSolicitations = async () => {
  loading.value = true;
  try {
    await storeConsultation.index(filters.value);
  } finally {
    loading.value = false;
  }
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

    // apagar a cobrança do asaas e a venda pendente
    if (selected.value.Sales && selected.value.Sales.length > 0) {
      await asaas.deletePayment(selected.value.Sales[0].saleId!);
    }

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

const handleSaleItemForAsaas = async () => {
  showSale.value = false;
  loading.value = true;
  try {
    if (!props.solicitation) {
      push.warning("Solicitação não encontrada!");
    }

    await asaas.createPayment({
      dueDate: moment().add(2, "days").format("YYYY-MM-DD"),
      value: $solicitationTotal.value,
      description: `Solicitação de consulta Nº ${props.solicitation.id} do paciente ${props.solicitation.Patient?.name} ${props.solicitation.Patient?.surname}`,
      category: "solicitation",
      solicitationId: props.solicitation.id,
    });

    await getSolicitations();

    if ($paymentResponse.value?.data?.invoiceUrl) {
      //window.open($paymentResponse.value?.data?.invoiceUrl);

      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const popupWidth = Math.round(screenWidth * 0.95);
      const popupHeight = Math.round(screenHeight * 0.95);
      const popupLeft = Math.round((screenWidth - popupWidth) / 2);
      const popupTop = Math.round((screenHeight - popupHeight) / 2);

      // window.open(
      //   $paymentResponse.value?.data?.invoiceUrl,
      //   "_blank",
      //   `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes`
      // );

      const popup = window.open(
        $paymentResponse.value?.data?.invoiceUrl,
        "_blank",
        `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes`
      );

      // verificar se o popup foi fechado
      const popupChecker = setInterval(async () => {
        if (popup && popup.closed) {
          clearInterval(popupChecker);
          console.log("🚀 ~ handleSaleItemForAsaas ~ popup.closed");
          await getSolicitations();
        }
      }, 700);
    }
  } catch (error) {
    push.error("Erro ao finalizar pagamento");
    console.log("🚀 ~ handleSaleItem ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const handleReloadPayment = async (item: SolicitationConsultationProps) => {
  loading.value = true;
  try {
    if (!item.Sales || item.Sales.length === 0) {
      push.warning("Pagamento não encontrado");
      return;
    }

    // se a fatura já estiver vencida e em aberto, então apagar e gerar outra
    if (moment().isAfter(moment(item.Sales[0].dueDate))) {
      await asaas.deletePayment(item.Sales[0].saleId!);
      await getSolicitations();
      await handleSaleItemForAsaas();
      return;
    }

    //caso contrário, apenas abrir a fatura
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const popupWidth = Math.round(screenWidth * 0.95);
    const popupHeight = Math.round(screenHeight * 0.95);
    const popupLeft = Math.round((screenWidth - popupWidth) / 2);
    const popupTop = Math.round((screenHeight - popupHeight) / 2);

    const popup = window.open(
      item.Sales[0].invoiceUrl,
      "_blank",
      `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes`
    );

    // verificar se o popup foi fechado
    const popupChecker = setInterval(async () => {
      if (popup && popup.closed) {
        clearInterval(popupChecker);
        await getSolicitations();
      }
    }, 700);
  } catch (error) {
    console.log("🚀 ~ handleReloadPayment ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const handleReceipt = (item: SolicitationConsultationProps) => {
  // se cair aqiu é porque foi pago com saldo em créditos
  if ((!item.Sales || item.Sales.length === 0) && item.status === "paid") {
    showRecipt.value = true;
    return;
  }

  //se não tem venda então não fazer nada no asaas
  if (!item.Sales || item.Sales.length === 0) {
    return;
  }

  if (!item.Sales || item.Sales.length === 0) {
    push.warning("Pagamento não encontrado");
    return;
  }

  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const popupWidth = Math.round(screenWidth * 0.7);
  const popupHeight = Math.round(screenHeight * 0.7);
  const popupLeft = Math.round((screenWidth - popupWidth) / 2);
  const popupTop = Math.round((screenHeight - popupHeight) / 2);

  const popup = window.open(
    item.Sales[0].transactionReceiptUrl,
    "_blank",
    `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes`
  );

  // verificar se o popup foi fechado
  const popupChecker = setInterval(async () => {
    if (popup && popup.closed) {
      clearInterval(popupChecker);
      await getSolicitations();
    }
  }, 700);
};

const handleUseCreditSalt = async () => {
  loading.value = true;
  try {
    await saltCredit.index({ status: "CONFIRMED" });
    showSaltCredit.value = true;
  } finally {
    loading.value = false;
  }
};
</script>
