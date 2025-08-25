<template>
  <v-list lines="two">
    <v-list-subheader> #{{ solicitation.id }} - Solicitação</v-list-subheader>
    <v-list-item :key="solicitation.id">
      <template #title>
        <span class="text-caption">
          {{ solicitation.Patient?.name }}
        </span>
      </template>
      <template #subtitle>
        <div class="d-flex w-100">
          <span class="text-caption">
            Tipo: {{ solicitation.Consultation?.consultationName }}
          </span>
        </div>
      </template>
      <template v-slot:append>
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
            variant="text"
            size="small"
            @click="handleMountModelPrececkout(solicitation)"
          >
            <v-icon icon="mdi-credit-card-outline" color="primary" start />
            <span class="text-caption text-primary"> Pagar </span>
          </Button>
        </div>
        <Button
          v-if="
            solicitation.status === 'scheduled' && solicitation.isTelemedicine
          "
          color="grey"
          size="small"
          variant="text"
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
          variant="text"
          @click="handleSchedule(solicitation)"
        >
          <v-icon icon="mdi-calendar-clock" start color="colorIcon" />
          <span class="text-caption text-primary">
            {{ solicitation.status === "paid" ? "Agendar" : "Reagendar" }}
          </span>
        </Button>
      </template>
    </v-list-item>
  </v-list>
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

const $all = computed(() => storeConsultation.$all?.consultations);
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
