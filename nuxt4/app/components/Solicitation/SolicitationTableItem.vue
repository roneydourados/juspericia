<template>
  <CardBlur
    v-if="!showTeleMedicine"
    style="border-top: 6px solid #c8e040"
    class="text-primary"
    height="400"
  >
    <v-card-title
      class="d-flex align-center justify-space-between pa-6"
      style="gap: 1rem; font-size: 1rem"
    >
      <div class="d-flex align-center" style="gap: 1rem">
        <div
          @click="handleDetailsClick(solicitation.publicId!)"
          class="text-truncate font-weight-bold"
          v-ripple
          style="cursor: pointer"
        >
          #{{ solicitation.id }} - Solicitação
          {{ solicitation.Consultation?.consultationName }}
        </div>
        <div
          class="d-flex align-center flex-wrap text-deep-purple"
          style="gap: 0.5rem"
          v-if="solicitation.Schedule && solicitation.Schedule.length > 0"
        >
          <span> Agendado: </span>
          <strong>
            {{
              dayjs(solicitation.Schedule?.[0]?.scheduleDate).format(
                "DD/MM/YYYY"
              )
            }}
            as
            {{ solicitation.Schedule?.[0]?.scheduleHour }}
          </strong>
        </div>
      </div>
      <div class="d-flex flex-wrap align-center" style="gap: 1rem">
        <Button
          v-if="
            solicitation.PatientConsultationReport &&
            solicitation.PatientConsultationReport.status === 'signed'
          "
          class="text-none font-weight-bold"
          color="info"
          @click="handleDownloadSignedFile(solicitation)"
          variant="outlined"
          size="small"
        >
          <v-icon icon="mdi-file-document-edit" color="colorIcon" start />
          <span class="text-caption"> Baixar Laudo </span>
        </Button>
        <v-chip
          v-else-if="!solicitation.PatientConsultationReport"
          variant="flat"
          color="#F6BF0C"
        >
          <span class="text-white text-caption"> Aguardando laudo </span>
        </v-chip>
        <v-chip
          v-else-if="
            solicitation.PatientConsultationReport &&
            solicitation.PatientConsultationReport.status !== 'signed'
          "
          variant="flat"
          color="grey"
        >
          <span class="text-white text-caption">
            Laudo aguardando assinatura
          </span>
        </v-chip>
        <div
          v-if="
            solicitation.status === 'open' ||
            (solicitation.status === 'payment_pending' &&
              $currentUser?.profile?.type === 'ADVOGADO')
          "
          class="d-flex align-center"
          style="gap: 0.5rem"
        >
          <Button
            color="grey"
            variant="outlined"
            size="small"
            @click="handleMountModelPrececkout(solicitation)"
          >
            <v-icon icon="mdi-credit-card-outline" color="primary" start />
            <span class="text-caption text-primary"> Pagar </span>
          </Button>
          <Button
            v-if="!solicitation.sale?.saleId"
            color="grey"
            variant="outlined"
            size="small"
            @click="handleUseCreditSalt"
          >
            <v-icon icon="mdi-currency-usd" color="primary" start />
            <span class="text-caption text-primary"> Utilizar Saldo </span>
          </Button>
        </div>
        <Button
          v-else-if="
            solicitation.status !== 'open' &&
            solicitation.status !== 'canceled' &&
            solicitation.status !== 'payment_pending' &&
            $currentUser?.profile?.type === 'ADVOGADO'
          "
          class="text-none text-white"
          color="grey"
          variant="outlined"
          size="small"
          @click="handleReceipt(solicitation)"
        >
          <v-icon icon="mdi-file-document-outline" color="colorIcon" start />
          <span class="text-caption text-primary"> Recibo </span>
        </Button>

        <Button
          v-else-if="
            solicitation.sale && solicitation.status === 'payment_pending'
          "
          class="text-none text-white"
          color="grey"
          variant="outlined"
          size="small"
          @click="handleReloadPayment(solicitation)"
        >
          <v-icon icon="mdi-credit-card-outline" color="primary" start />
          <span class="text-caption text-primary"> Pagar </span>
        </Button>
        <Button
          v-if="
            solicitation.status === 'scheduled' && solicitation.isTelemedicine
          "
          color="grey"
          size="small"
          variant="outlined"
          @click="handleQuery(solicitation)"
        >
          <v-icon icon="mdi-video-outline" start color="colorIcon" />
          <span class="text-caption text-primary"> Consulta </span>
        </Button>
        <Button
          v-if="
            solicitation.status === 'paid' ||
            solicitation.status === 'scheduled'
          "
          color="grey"
          size="small"
          variant="outlined"
          @click="handleSchedule(solicitation)"
        >
          <v-icon icon="mdi-calendar-clock" start color="colorIcon" />
          <span class="text-caption text-primary">
            {{ solicitation.status === "paid" ? "Agendar" : "Reagendar" }}
          </span>
        </Button>

        <Button
          color="grey"
          size="small"
          variant="outlined"
          @click="getItemCancel(solicitation)"
          :disabled="
            solicitation.status !== 'open' &&
            solicitation.status !== 'payment_pending'
          "
        >
          <v-icon icon="mdi-cancel" start color="red" />
          <span class="text-caption text-primary"> cancelar </span>
        </Button>
        <Button
          color="grey"
          size="small"
          variant="outlined"
          @click="editItem(solicitation)"
          :disabled="solicitation.status !== 'open'"
        >
          <v-icon icon="mdi-pencil-outline" start color="colorIcon" />
          <span class="text-caption text-darkText"> Editar</span>
        </Button>
        <v-chip :color="solicitationStatusColor(solicitation.status ?? 'open')">
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
      <v-row>
        <v-col v-if="solicitation.proccessNumber" cols="12">
          <v-chip
            class="d-flex justify-center"
            style="width: 100%; gap: 0.5rem"
            label
            color="grey"
          >
            <span class="text-primary">Nº Processo:</span>
            <span class="font-weight-bold text-primary">
              {{ solicitation.proccessNumber }}
            </span>
          </v-chip>
        </v-col>

        <v-col cols="12" lg="4" class="d-flex flex-column" style="gap: 0.5rem">
          <div class="d-flex" style="gap: 0.5rem">
            <span>Solicitante:</span>
            <span class="font-weight-bold">
              {{ solicitation.Patient?.User?.name }}
            </span>
          </div>
          <div class="d-flex" style="gap: 0.5rem">
            <span>Paciente:</span>
            <span class="font-weight-bold">
              {{ solicitation.Patient?.name }}
              {{ solicitation.Patient?.surname }}
            </span>
          </div>
        </v-col>
        <v-col cols="12" lg="4" class="d-flex flex-column" style="gap: 0.5rem">
          <div class="d-flex" style="gap: 0.5rem">
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
          </div>
          <div class="d-flex" style="gap: 0.5rem">
            <span>Tipo benefício:</span>
            <span class="font-weight-bold">
              {{ solicitation.BenefitType?.name }}
            </span>
          </div>
        </v-col>
        <v-col cols="12" lg="4" class="d-flex flex-column" style="gap: 0.5rem">
          <div class="d-flex" style="gap: 0.5rem">
            <span>Valor:</span>
            <span class="font-weight-bold">{{
              amountFormated(solicitation.consultationValue ?? 0, true)
            }}</span>
          </div>
          <div class="d-flex" style="gap: 0.5rem">
            <span>Valor atencipação:</span>
            <span class="font-weight-bold">
              {{ amountFormated(solicitation.antecipationValue ?? 0, true) }}
            </span>
          </div>
        </v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" lg="4" class="d-flex flex-column" style="gap: 0.5rem">
          <div class="d-flex" style="gap: 0.5rem">
            <span>Solicitado:</span>
            <span class="font-weight-bold">
              {{ dayjs(solicitation.dateOpen).format("DD/MM/YYYY") }}
            </span>
          </div>
          <div class="d-flex" style="gap: 0.5rem">
            <span>Data limite para solicitar correção:</span>
            <span class="font-weight-bold">
              {{ dayjs(solicitation.deadline).format("DD/MM/YYYY") }}
            </span>
          </div>

          <div class="d-flex" style="gap: 0.5rem">
            <span>Especialidade médica:</span>
            <span class="font-weight-bold">
              {{
                solicitation.medicalSpecialty?.medicalSpecialty ??
                "Não informado"
              }}
            </span>
          </div>
        </v-col>
        <v-col cols="12" lg="4" class="d-flex flex-column" style="gap: 0.5rem">
          <div class="d-flex" style="gap: 0.5rem">
            <span>Data de solicitação de correção:</span>
            <span class="font-weight-bold">
              {{
                solicitation.dateCorrection
                  ? dayjs(solicitation.dateCorrection).format("DD/MM/YYYY")
                  : "Não solicitado"
              }}
            </span>
          </div>
          <div class="d-flex" style="gap: 0.5rem">
            <span>Data de solicitação de atencipação:</span>
            <span class="font-weight-bold">
              {{
                solicitation.dateAntecipation
                  ? dayjs(solicitation.dateAntecipation).format("DD/MM/YYYY")
                  : "Não solicitado"
              }}
            </span>
          </div>
        </v-col>
        <v-col
          v-if="$currentUser?.profile?.type !== 'MEDICO'"
          cols="12"
          lg="4"
          class="d-flex justify-end"
        >
          <v-chip color="grey" class="pa-6" label rounded="xl">
            <div class="d-flex align-center" style="gap: 0.5rem">
              <span class="text-primary">Total:</span>
              <span
                class="font-weight-bold text-primary"
                style="font-size: 1.3rem"
              >
                {{ amountFormated($solicitationTotal, true) }}
              </span>
            </div>
          </v-chip>
        </v-col>
        <v-col cols="12">
          <v-divider />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions
      v-if="$currentUser?.profile?.type !== 'MEDICO'"
      class="px-8"
    >
      <v-row dense align="center">
        <v-col v-if="solicitation.status === 'finished'" cols="12" lg="2">
          <Button
            variant="text"
            color="grey"
            @click="showDateCorrection = true"
            :disabled="
              !solicitation.PatientConsultationReport || !$isEnableCorrection
            "
          >
            <v-icon
              icon="mdi-file-document-refresh-outline"
              start
              color="colorIcon"
            />
            <span
              class="text-primary"
              style="font-weight: 500; font-size: 0.8rem"
            >
              Solicitar correção
            </span>
          </Button>
        </v-col>
        <v-col cols="12" lg="2">
          <Button
            variant="text"
            :disabled="
              !!solicitation.dateAntecipation ||
              solicitation.status === 'canceled' ||
              solicitation.status === 'finished'
            "
            @click="getItemAntecipation(solicitation)"
          >
            <v-icon icon="mdi-calendar-clock-outline" start color="colorIcon" />
            <span
              class="text-primary"
              style="font-weight: 500; font-size: 0.8rem"
            >
              Solicitar antecipação
            </span>
          </Button>
        </v-col>
        <v-col cols="12" lg="2">
          <Button
            variant="text"
            @click="handleDetailsClick(solicitation.publicId!)"
          >
            <v-icon icon="mdi-dots-vertical" start color="colorIcon" />
            <span
              class="text-primary"
              style="font-weight: 500; font-size: 0.8rem"
            >
              Visualizar detalhes
            </span>
          </Button>
        </v-col>
        <v-col cols="12" lg="3">
          <Button
            v-if="solicitation.status === 'finished'"
            variant="text"
            @click="showTipValue = true"
            :disabled="Number(solicitation.tipValue) > 0"
          >
            <v-icon icon="mdi-currency-usd" start color="colorIcon" />
            <span
              class="text-primary"
              style="font-weight: 500; font-size: 0.8rem"
            >
              Dar Gorjeta
            </span>
          </Button>
        </v-col>
        <v-col cols="12" lg="3" class="d-flex flex-wrap align-center px-4">
          <Button
            v-if="solicitation.rate === 0 && solicitation.status === 'finished'"
            variant="text"
            @click="solicitation.rate = 1"
          >
            <v-icon icon="mdi-star" start color="colorIcon" />
            <span
              class="text-primary"
              style="font-weight: 500; font-size: 0.8rem"
            >
              Avaliar solicitação
            </span>
          </Button>
          <div v-if="solicitation.rate ?? 0 > 0" class="text-center">
            <v-rating
              v-model="solicitation.rate"
              active-color="orange-darken-1"
              color="orange-lighten-1"
              :readonly="!isRate"
              :size="24"
            />
            <Button
              v-if="isRate"
              class="ml-2"
              variant="text"
              @click="handleUpdateRate(solicitation.rate ?? 0)"
            >
              <v-icon icon="mdi-check" start color="colorIcon" />
              <span
                class="text-primary"
                style="font-weight: 500; font-size: 0.8rem"
              >
                Enviar avaliação
              </span>
            </Button>
          </div>
        </v-col>
      </v-row>
    </v-card-actions>
    <v-card-text v-if="solicitation.files?.length ?? 0 > 0">
      <v-divider />
      <v-row>
        <v-col cols="12" class="pa-4"><strong>Anexos / laudos</strong></v-col>
      </v-row>
      <v-row dense v-for="item in solicitation.files">
        <v-col cols="12">
          <AttachementCard
            :file-name="item.fileName!"
            @download="handleDownloadFile(item.publicId!)"
            :delete-visible="false"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </CardBlur>
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
  <UserCreditSaltForm v-model="showSaltCredit" :solicitation="solicitation" />
  <SolicitationPaymentReciptSalt
    v-model="showRecipt"
    :solicitation="solicitation"
  />
  <AsaasPreCheckout
    v-model:show="showSale"
    v-model="modelPrececkout"
    @confirm-sale="handleSaleItemForAsaas"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

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
const consultationReport = usePatientConsultationReportStore();
const rounter = useRouter();
const fileStore = useFileStore();
const zapSign = useZapsignStore();
const systemParameters = useSystemParametersStore();
// const transactionsStore = useTransactionsStore();

const {
  amountFormated,
  getSolicitationsFilters,
  solicitationStatusName,
  solicitationStatusColor,
} = useUtils();
const saltCredit = useUserCreditSaltStore();
const router = useRouter();
const selected = ref<SolicitationConsultationProps>();
const showTeleMedicine = ref(false);
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

const modelPrececkout = ref({
  name: "",
  description: "",
  dueDays: 2,
  paymentForm: "CREDIT_CARD",
  discountValue: undefined as number | undefined,
  discountType: undefined as string | undefined,
  installmentCount: 1,
  itemValue: 0,
  totalValue: 0,
  category: "package",
  packageId: undefined as number | undefined,
  voucherDesconto: "",
  totalBruteValue: 0,
  voucherId: undefined as number | undefined,
  publicSaleId: "",
  packgeSaleValue: 0,
  packgeQuantity: 1,
});

const $currentUser = computed(() => auth.$currentUser);
const $solicitationTotal = computed(() => {
  return (
    Number(props.solicitation.consultationValue ?? 0) +
    Number(props.solicitation.antecipationValue ?? 0)
  );
});

const $paymentResponse = computed(() => asaas.$paymentReponse);
const $systemParameters = computed(() => systemParameters.$parameters);
const $isEnableCorrection = computed(() => {
  return (
    Number(props.solicitation.correctionQuantity ?? 0) <
    Number($systemParameters.value?.solicitationCorrectionQuantity ?? 0)
  );
  // if (
  //   props.solicitation.correctionQuantity &&
  //   props.solicitation.correctionQuantity > 0
  // ) {
  //   return (
  //     props.solicitation.correctionQuantity <
  //     Number($systemParameters.value?.solicitationCorrectionQuantity ?? 0)
  //   );
  // }

  // return false;
});

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

  if (!props.solicitation.PatientConsultationReport) {
    push.warning("Laudo não encontrado!");
    return;
  }

  if (motive) {
    loading.value = true;
    try {
      // adiciona a justificativa no laudo
      await consultationReport.addJustify({
        justify: motive,
        publicId: props.solicitation.PatientConsultationReport.publicId!,
      });

      // incrementa a quantidade de correções
      await storeConsultation.update({
        publicId: props.solicitation.publicId,
        correctionQuantity:
          Number(props.solicitation.correctionQuantity ?? 0) + 1,
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
        dateAntecipation: dayjs().format("YYYY-MM-DD"),
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
  loading.value = true;
  try {
    await storeConsultation.update({
      publicId: props.solicitation.publicId,
      rate,
    });
    isRate.value = false;
  } finally {
    loading.value = false;
  }
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

    if (selected.value.sale) {
      if (selected.value.sale.saleId) {
        await asaas.deletePayment(selected.value.sale.saleId);
      }
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

const handleMountModelPrececkout = async (
  item: SolicitationConsultationProps
) => {
  //verificar se já existe uma venda vinculada e se ainda está disponível para pagamento no asaas
  if (item.sale) {
    if (item.sale.saleId) {
      // este método aqui já cancela a venda vinculada ao pagament
      await asaas.deletePayment(item.sale.saleId);
    }
  }
  showSale.value = true;
  modelPrececkout.value = {
    name: `Solicitação de consulta Nº ${item.id} do paciente ${item.Patient?.name} ${item.Patient?.surname}`,
    description: `Solicitação de consulta Nº ${item.id} do paciente ${item.Patient?.name} ${item.Patient?.surname}`,
    dueDays: 2,
    paymentForm: "CREDIT_CARD",
    discountValue: undefined,
    discountType: undefined,
    installmentCount: 1,
    itemValue: $solicitationTotal.value,
    totalValue: $solicitationTotal.value,
    category: "solicitation",
    totalBruteValue: $solicitationTotal.value,
    packageId: undefined,
    voucherDesconto: "",
    voucherId: undefined,
    publicSaleId: "",
    packgeSaleValue: $solicitationTotal.value, // valor do pacote, no caso é uma solicitação única
    packgeQuantity: 1, //atende apenas uma solicitação
  };
};

const handleSaleItemForAsaas = async () => {
  showSale.value = false;
  loading.value = true;
  try {
    if (!props.solicitation) {
      push.warning("Solicitação não encontrada!");
    }

    if (
      modelPrececkout.value.installmentCount &&
      modelPrececkout.value.installmentCount > 1
    ) {
      //se for parcelada enviar quantidade de parcelas e o valor total
      await asaas.createPayment({
        dueDate: dayjs()
          .add(modelPrececkout.value.dueDays, "days")
          .format("YYYY-MM-DD"),
        description: modelPrececkout.value.name,
        category: modelPrececkout.value.category,
        //packageId: props.item.id,
        dueDays: modelPrececkout.value.dueDays,
        totalValue: modelPrececkout.value.totalValue,
        installmentCount: modelPrececkout.value.installmentCount,
        billingType: modelPrececkout.value.paymentForm,
        voucherId: modelPrececkout.value.voucherId,
        userId: $currentUser.value!.id!, // aqui é o código do usuário que está comprando, no caso o cliente/advogado
        discount: {
          value: modelPrececkout.value.discountValue ?? 0,
          type: modelPrececkout.value.discountType,
        },
        saleValue: modelPrececkout.value.totalValue ?? 0,
        publicSaleId: modelPrececkout.value.publicSaleId,
        packgeQuantity: modelPrececkout.value.packgeQuantity ?? 1,
        packgeSaleValue: modelPrececkout.value.packgeSaleValue ?? 0,
        solicitationId: props.solicitation.id,
      });
    } else {
      const payload = {
        dueDate: dayjs()
          .add(modelPrececkout.value.dueDays, "days")
          .format("YYYY-MM-DD"),
        value: modelPrececkout.value.totalValue,
        description: modelPrececkout.value.name!,
        category: modelPrececkout.value.category,
        dueDays: modelPrececkout.value.dueDays,
        billingType: modelPrececkout.value.paymentForm,
        voucherId: modelPrececkout.value.voucherId,
        userId: $currentUser.value!.id!, // aqui é o código do usuário que está comprando, no caso o cliente/advogado
        discount: {
          value: modelPrececkout.value.discountValue ?? 0,
          type: modelPrececkout.value.discountType,
        },
        saleValue: modelPrececkout.value.totalValue ?? 0,
        publicSaleId: modelPrececkout.value.publicSaleId,
        packgeQuantity: modelPrececkout.value.packgeQuantity ?? 1,
        packgeSaleValue: modelPrececkout.value.packgeSaleValue ?? 0,
        solicitationId: props.solicitation.id,
      };

      await asaas.createPayment(payload);
    }

    if ($paymentResponse.value?.data?.invoiceUrl) {
      window.open($paymentResponse.value.data.invoiceUrl, "_blank");
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
    if (!item.sale) {
      push.warning("Pagamento não encontrado");
      return;
    }

    // se a fatura já estiver vencida e em aberto, então apagar e gerar outra
    if (dayjs().isAfter(dayjs(item.sale.dueDate))) {
      await asaas.deletePayment(item.sale.saleId!);
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
      item.sale.invoiceUrl,
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
  if (!item.sale && item.status === "paid") {
    showRecipt.value = true;
    return;
  }

  //se não tem venda então não fazer nada no asaas
  if (!item.sale) {
    push.warning("Pagamento não encontrado");
    return;
  }

  const popupWidth = 800;
  const popupHeight = 600;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const popupLeft = Math.round((screenWidth - popupWidth) / 2);
  const popupTop = Math.round((screenHeight - popupHeight) / 2);

  window.open(
    item.sale.transactionReceiptUrl,
    "_blank",
    `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes`
  );
};

const handleUseCreditSalt = async () => {
  loading.value = true;
  try {
    const initialDate = dayjs().startOf("year").format("YYYY-MM-DD");
    const finalDate = dayjs().endOf("year").format("YYYY-MM-DD");
    await saltCredit.index({
      userId: $currentUser.value?.id!,
      initialDate,
      finalDate,
      status: "CONFIRMED",
      isSalt: true,
    });
    showSaltCredit.value = true;
  } finally {
    loading.value = false;
  }
};

const handleQuery = async (item: SolicitationConsultationProps) => {
  await router.push(`/teleconference/${item.publicId}`);
};

const handleDownloadFile = async (publicId: string) => {
  loading.value = true;
  try {
    const { file, fileName } = await fileStore.downloadAws(publicId);

    // Exemplo: Se o fileStore.download retornar um blob com metadados do nome do arquivo
    const url = window.URL.createObjectURL(file);

    // Cria um link temporário
    const link = document.createElement("a");
    link.href = url;

    // Define o nome do arquivo
    link.download = fileName;

    // Adiciona e clica no link
    document.body.appendChild(link);
    link.click();

    // Remove o link temporário
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log("🚀 ~ handleDownloadFile ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  showSale.value = false;
  modelPrececkout.value = {
    name: "",
    description: "",
    dueDays: 2,
    paymentForm: "CREDIT_CARD",
    discountValue: undefined,
    discountType: undefined,
    installmentCount: 1,
    itemValue: 0,
    totalValue: 0,
    category: "package",
    packageId: undefined,
    voucherDesconto: "",
    totalBruteValue: 0,
    voucherId: undefined,
    publicSaleId: "",
    packgeSaleValue: 0,
    packgeQuantity: 1,
  };
};

const handleDownloadSignedFile = async (
  item: SolicitationConsultationProps
) => {
  if (!item.PatientConsultationReport) {
    push.error("Documento não assinado.");
    return;
  }

  loading.value = true;
  try {
    const { fileBlob, fileName } = await zapSign.getSignedFile(
      item.PatientConsultationReport.publicId!
    );

    // Exemplo: Se o fileStore.download retornar um blob com metadados do nome do arquivo
    const url = window.URL.createObjectURL(fileBlob);

    // Cria um link temporário
    const link = document.createElement("a");
    link.href = url;

    // Define o nome do arquivo
    link.download = fileName;

    // Adiciona e clica no link
    document.body.appendChild(link);
    link.click();

    // Remove o link temporário
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log("🚀 ~ handleDownloadSignedFile ~ error:", error);
  } finally {
    loading.value = false;
  }
};
</script>
