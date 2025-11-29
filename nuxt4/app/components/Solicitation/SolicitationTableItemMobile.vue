<template>
  <div class="d-flex justify-end align-center mb-2">
    <v-pagination
      v-model="page"
      :length="pageCount"
      color="primary"
      rounded="circle"
      density="comfortable"
      :total-visible="PAGINATION_TOTAL_VISIBLE"
    />
    <span class="text-caption text-primary">
      Pg. {{ page }} de {{ pageCount }}
    </span>
  </div>
  <CardBlur
    v-for="item in paginatedItems"
    :key="item.id"
    class="mb-2 text-primary"
    :hover="false"
    style="border-top: 3px solid #c8e040"
  >
    <template #title>
      <div
        @click="handleDetailsClick(item.publicId!)"
        class="text-truncate font-weight-bold"
        v-ripple
        style="cursor: pointer"
      >
        #{{ item.id }} - Solicitação
        {{ item.Consultation?.consultationName }}
      </div>
    </template>
    <template #content>
      <div class="d-flex align-center justify-space-between">
        <span class="text-caption">
          {{ item.Patient?.name }} {{ item.Patient?.surname }}
        </span>
      </div>
      <div class="d-flex justify-space-between w-100">
        <div class="text-caption">
          Tipo:
          <span class="text-caption">
            {{ item.Consultation?.consultationName }}
          </span>
        </div>
        <span class="text-caption">
          Finalidade:
          <span class="text-caption">
            {{ item.ReportPurpose?.name }}
            {{
              item.processSituation
                ? item.processSituation === "PD"
                  ? "Processo distribuido"
                  : "Processo andamento"
                : ""
            }}
          </span>
        </span>
      </div>
      <div class="d-flex justify-space-between w-100">
        <span class="text-caption">Antecipar em:</span>
        <span class="font-weight-bold" style="font-size: 0.8rem">
          {{ item.antecipationHours }}hs
        </span>
      </div>

      <div class="d-flex justify-space-between w-100">
        <div class="text-caption">Especialidade médica:</div>
        <span class="text-caption">
          {{ item.medicalSpecialty?.medicalSpecialty ?? "Não informado" }}
        </span>
      </div>
      <div class="d-flex justify-space-between w-100">
        <div class="text-caption">Valor solicitação:</div>
        <span class="text-caption">
          <span class="text-caption">
            {{ amountFormated(item.consultationValue ?? 0, true) }}
          </span>
        </span>
      </div>
      <div class="d-flex justify-space-between w-100">
        <div class="text-caption">Especialidade médica Valor:</div>
        <span class="text-caption">
          {{ amountFormated(item.medicalSpecialtyValue ?? 0, true) }}
        </span>
      </div>
      <div class="d-flex justify-space-between w-100">
        <div class="text-caption">Atencipação:</div>
        <span class="text-caption">
          <span class="text-caption">
            {{ amountFormated(item.antecipationValue ?? 0, true) }}
          </span>
        </span>
      </div>
      <div class="d-flex align-center justify-space-between">
        <span style="font-size: 0.75rem; font-weight: 700"> Total </span>
        <span style="font-size: 0.75rem; font-weight: 700">
          {{ getSolicitationTotal(item) }}
        </span>
      </div>
    </template>
    <template #actions>
      <div class="d-flex flex-column w-100">
        <div class="d-flex w-100">
          <Button
            v-if="
              item.PatientConsultationReport &&
              item.PatientConsultationReport.status === 'signed'
            "
            class="text-none font-weight-bold"
            color="info"
            @click="handleDownloadSignedFile(item)"
            variant="text"
            size="small"
          >
            <v-icon icon="mdi-file-document-edit" color="colorIcon" />
            <span class="text-caption"> Baixar Laudo </span>
          </Button>
          <Button
            v-if="item.status === 'open' || item.status === 'payment_pending'"
            class="text-none text-white"
            color="grey"
            variant="text"
            size="small"
            @click="
              item.sale
                ? handleReloadPayment(item)
                : handleMountModelPrececkout(item)
            "
          >
            <v-icon icon="mdi-credit-card-outline" color="primary" />
            <span class="text-caption text-primary"> Pagar </span>
          </Button>
          <!-- <Button
            v-if="
              item.status === 'open' ||
              (item.status === 'payment_pending' &&
                $currentUser?.profile?.type === 'ADVOGADO' &&
                !item.sale?.saleId)
            "
            color="grey"
            variant="text"
            size="small"
            @click="handleUseCreditSalt(item)"
          >
            <v-icon icon="mdi-currency-usd" color="primary" start />
            <span class="text-caption text-primary"> Utilizar Saldo </span>
          </Button> -->
          <!-- <Button
            v-if="item.status === 'scheduled' && item.isTelemedicine"
            color="grey"
            size="small"
            variant="text"
            @click="handleQuery(item)"
          >
            <v-icon icon="mdi-video-outline" color="colorIcon" />
            <span class="text-caption text-primary"> Consulta </span>
          </Button> -->
          <Button
            v-if="item.status === 'paid'"
            color="grey"
            size="small"
            variant="text"
            @click="handleSchedule(item)"
          >
            <v-icon icon="mdi-calendar-clock" color="colorIcon" />
            <span class="text-caption text-primary">
              {{ item.status === "paid" ? "Agendar" : "Reagendar" }}
            </span>
          </Button>
          <Button
            v-if="
              (item.status === 'paid' || item.status === 'scheduled') &&
              $currentUser?.profile?.type === 'ADMIN'
            "
            color="grey"
            size="small"
            variant="text"
            @click="handleSchedule(item)"
          >
            <v-icon icon="mdi-calendar-clock" color="colorIcon" />
            <span class="text-caption text-primary"> Reagendar </span>
          </Button>
          <Button
            color="grey"
            size="small"
            variant="text"
            @click="cancelSolicitation(item)"
            :disabled="
              (item.status === 'finished' || item.status === 'canceled') &&
              $currentUser?.profile?.type !== 'ADMIN'
            "
          >
            <v-icon icon="mdi-cancel" color="red" />
            <span class="text-caption text-primary"> Cancelar </span>
          </Button>
          <Button
            color="grey"
            size="small"
            variant="text"
            @click="editItem(item)"
            :disabled="item.status === 'finished' || item.status === 'canceled'"
          >
            <v-icon icon="mdi-pencil-outline" color="colorIcon" />
            <span class="text-caption text-darkText"> Editar</span>
          </Button>
        </div>
        <div class="d-flex w-100">
          <Button
            v-if="item.status === 'finished'"
            variant="text"
            color="grey"
            @click="getShowCorrection(item)"
            :disabled="
              !item.PatientConsultationReport || !isEnableCorrection(item)
            "
          >
            <v-icon
              icon="mdi-file-document-refresh-outline"
              color="colorIcon"
            />
            <span class="text-primary text-caption"> Solicitar correção </span>
          </Button>
          <Button
            v-if="
              !item.dateAntecipation &&
              (item.status === 'open' || item.status === 'paid')
            "
            variant="text"
            @click="getItemAntecipation(item)"
          >
            <v-icon icon="mdi-calendar-clock-outline" color="colorIcon" />
            <span class="text-primary text-caption">
              Solicitar antecipação
            </span>
          </Button>
          <Button
            v-else-if="
              item.dateAntecipation &&
              (item.status === 'open' || item.status === 'paid')
            "
            variant="text"
            @click="handleCancelAntecipation(item.publicId!)"
          >
            <v-icon icon="mdi-close" start color="red" />
            <span class="text-primary text-caption">
              Cancelar antecipação
            </span>
          </Button>
        </div>
        <div class="d-flex w-100">
          <Button variant="text" @click="handleDetailsClick(item.publicId!)">
            <v-icon icon="mdi-dots-vertical" start color="colorIcon" />
            <span class="text-primary text-caption"> Visualizar detalhes </span>
          </Button>
        </div>
        <div
          v-if="$currentUser?.profile?.type === 'ADVOGADO'"
          class="d-flex justify-end"
        >
          <Button
            v-if="Number(item.rate ?? 0) === 0 && item.status === 'finished'"
            variant="text"
            @click="handleClickRate(item)"
          >
            <v-icon icon="mdi-star" start color="colorIcon" />
            <span
              class="text-primary"
              style="font-weight: 500; font-size: 0.8rem"
            >
              Avaliar solicitação
            </span>
          </Button>
          <div v-if="Number(item.rate ?? 0) > 0" class="d-flex align-center">
            <v-rating
              v-model="item.rate"
              active-color="colorIcon"
              color="colorIcon"
              :readonly="!isRate"
              :size="24"
            />
            <Button
              v-if="isRate"
              class="ml-2"
              variant="text"
              @click="handleUpdateRate(item)"
            >
              <span class="text-primary text-caption"> Enviar </span>
              <v-icon icon="mdi-check" end color="colorIcon" />
            </Button>
          </div>
        </div>
        <div v-if="item.status === 'finished'" class="d-flex justify-end">
          <Button
            variant="text"
            @click="handleGetTipTap(item)"
            :disabled="Number(item.tipValue) > 0"
          >
            <v-icon icon="mdi-currency-usd" start color="colorIcon" />
            <span class="text-primary text-caption"> Dar Gorjeta </span>
          </Button>
        </div>
        <Button
          v-if="item.Schedule && item.Schedule?.[0]?.nuvidioInviteLink"
          variant="text"
          @click="handleCopy(item.Schedule?.[0]?.nuvidioInviteLink.link)"
        >
          <v-icon icon="mdi-content-copy" start color="colorIcon" />
          <span class="font-weight-bold" style="font-size: 0.8rem">
            Copiar link do agendamento
          </span>
        </Button>
      </div>
    </template>
  </CardBlur>
  <UserCreditSaltForm
    v-model="showSaltCredit"
    :solicitation="selected"
    @close="handleUseCreditFormClose"
  />
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
  <!-- <Dialog
    title="Cancelar consulta"
    :dialog="showCancel"
    @cancel="showCancel = false"
    @confirm="cancel"
  >
    Tem certeza que deseja cancelar a consulta?
  </Dialog> -->
  <!-- <SolicitationPaymentReciptSalt
    v-model="showRecipt"
    :solicitation="solicitation"
  /> -->
  <AsaasPreCheckout
    v-model:show="showSale"
    v-model="modelPrececkout"
    @confirm-sale="handleSaleItemForAsaas"
    @cancel="handleCancel"
  />
  <SolicitationDetailsDialog v-model:show="showSolicitationDetails" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const emit = defineEmits(["edit", "refresh"]);
const auth = useAuthStore();
const asaas = useAsaasStore();
const storeConsultation = useSolicitationConsultationStore();
const consultationReport = usePatientConsultationReportStore();
const rounter = useRouter();
//const fileStore = useFileStore();
const zapSign = useZapsignStore();
const systemParameters = useSystemParametersStore();
// const transactionsStore = useTransactionsStore();

const {
  amountFormated,
  getSolicitationsFilters,
  //solicitationStatusName,
  //solicitationStatusColor,
} = useUtils();
const saltCredit = useUserCreditSaltStore();
const router = useRouter();
const selected = ref<SolicitationConsultationProps>();
//const showTeleMedicine = ref(false);
const showSaltCredit = ref(false);
const isRate = ref(false);
const showDateCorrection = ref(false);
const showDateAntecipation = ref(false);
const showCancel = ref(false);
const showTipValue = ref(false);
const loading = ref(false);
const showSale = ref(false);
const showSolicitationDetails = ref(false);
//const showRecipt = ref(false);
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

const itemsPerPage = ref(10);
const page = ref(1);

const $currentUser = computed(() => auth.$currentUser);
const $userCreditTotalSalt = computed(() => saltCredit.$userCreditTotalSalt);
const $all = computed(() => storeConsultation.$all?.consultations);
const $paymentResponse = computed(() => asaas.$paymentReponse);
const $systemParameters = computed(() => systemParameters.$parameters);

const paginatedItems = computed(() => {
  const all = $all.value || [];
  const start = (page.value - 1) * itemsPerPage.value;
  return all.slice(start, start + itemsPerPage.value);
});

const pageCount = computed(() => {
  const all = $all.value || [];
  return Math.ceil(all.length / itemsPerPage.value);
});

const handleDetailsClick = async (id: string) => {
  loading.value = true;
  try {
    await storeConsultation.show(id);
    showSolicitationDetails.value = true;
  } finally {
    loading.value = false;
  }
};

const isEnableCorrection = (item: SolicitationConsultationProps) => {
  if (
    item.PatientConsultationReport &&
    item.PatientConsultationReport.reportDate
  ) {
    const daysPassed =
      dayjs().diff(dayjs(item.PatientConsultationReport.reportDate), "days") <=
      Number($systemParameters.value?.medicalReportRevisionMaxDays);

    return (
      daysPassed &&
      Number(item.correctionQuantity ?? 0) <
        Number($systemParameters.value?.medicalReportRevisionMaxCount ?? 0)
    );
  }

  return false;
};

const editItem = (item: SolicitationConsultationProps) => {
  emit("edit", item);
};

const handleUpdateCorrection = async (motive: string) => {
  showDateCorrection.value = false;

  if (!selected.value?.PatientConsultationReport || !selected.value) {
    push.warning("Laudo não encontrado!");
    return;
  }

  if (motive) {
    loading.value = true;
    try {
      // adiciona a justificativa no laudo
      await consultationReport.addJustify({
        justify: motive,
        publicId: selected.value.PatientConsultationReport.publicId!,
      });

      // incrementa a quantidade de correções
      await storeConsultation.update({
        publicId: selected.value.publicId,
        correctionQuantity: Number(selected.value.correctionQuantity ?? 0) + 1,
      });

      selected.value = undefined;
      await getSolicitations();
    } finally {
      loading.value = false;
    }
  }
};

const handleUpdateAntecipation = async (value: number) => {
  if (!selected.value) return;

  showDateAntecipation.value = false;
  if (value) {
    loading.value = true;
    try {
      await storeConsultation.update({
        id: selected.value.id,
        dateAntecipation: dayjs().format("YYYY-MM-DD"),
        antecipationValue: value,
      });

      selected.value = undefined;
      await getSolicitations();
    } finally {
      loading.value = false;
    }
  }
};

const handleTipValue = async (value: number) => {
  if (!selected.value) return;

  if (value && value > 0) {
    loading.value = true;
    try {
      await storeConsultation.update({
        id: selected.value.id,
        tipValue: value,
      });

      selected.value = undefined;
      await getSolicitations();
    } finally {
      loading.value = false;
    }
  }
};

const handleUpdateRate = async (item: SolicitationConsultationProps) => {
  loading.value = true;
  try {
    await storeConsultation.update({
      publicId: item.publicId,
      rate: item.rate ?? 0,
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

const cancelSolicitation = (item: SolicitationConsultationProps) => {
  push.info({
    title: "Cancelar Solicitação",
    message: "Tem certeza que deseja cancelar esta solicitação ?",
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Sim",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            loading.value = true;
            try {
              await storeConsultation.update({
                ...item,
                status: "canceled",
              });

              if (item.sale && item.sale.saleId) {
                await asaas.deletePayment(item.sale.saleId);
              }

              await getSolicitations();
            } finally {
              loading.value = false;
            }
          },
        },
        {
          label: "Não",
          variant: "secondary",
          icon: "mdi-close",
          iconColor: "red",
          handler: () => {},
        },
      ],
    },
  });
};

const getItemAntecipation = (item: SolicitationConsultationProps) => {
  selected.value = item;
  showDateAntecipation.value = true;
};

// const cancel = async () => {
//   showCancel.value = false;
//   if (!selected.value) return;

//   loading.value = true;

//   try {
//     await storeConsultation.update({
//       ...selected.value,
//       status: "canceled",
//     });

//     if (selected.value.sale && selected.value.sale.saleId) {
//       await asaas.deletePayment(selected.value.sale.saleId);
//     }

//     await getSolicitations();
//     selected.value = undefined;
//   } finally {
//     loading.value = false;
//   }
// };

const handleSchedule = (item: SolicitationConsultationProps) => {
  selected.value = item;
  showSolicitationSchedule.value = true;
};

const handleMountModelPrececkout = async (
  item: SolicitationConsultationProps
) => {
  //calcular o valor total da solicitação
  let value = Number(item.valueCredit ?? 0)
    ? Number(item.valueCredit ?? 0)
    : Number(item.consultationValue ?? 0);

  value =
    Number(value ?? 0) +
    Number(item.antecipationValue ?? 0) +
    Number(item.medicalSpecialtyValue ?? 0);

  //Verificar se o usuário possui um total em saldo de crédito que de para pagar a solicitação
  await saltCredit.getTotalSalt(item.Patient?.User?.publicId!);

  if (
    $userCreditTotalSalt.value &&
    Number($userCreditTotalSalt.value.totalSalt) >= Number(value)
  ) {
    push.info({
      title: "Saldo de crédito disponível",
      message: `Detectamos que você possui um saldo de crédito de ${amountFormated(
        $userCreditTotalSalt.value?.totalSalt ?? 0,
        true
      )}. Esta solicitação será baixada automaticamente.`,
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
                await storeConsultation.paidUseSalt(item.publicId!);
                await getSolicitations();
              } catch (error) {
                console.log("🚀 ~ handleFinalizeSchedule ~ error:", error);
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
    return;
  }

  //verificar se já existe uma venda vinculada e se ainda está disponível para pagamento no asaas
  if (item.sale && item.sale.saleId) {
    // este método aqui já cancela a venda vinculada ao pagament
    await asaas.deletePayment(item.sale.saleId);
  }
  const total =
    Number(item.consultationValue ?? 0) + Number(item.antecipationValue ?? 0);

  showSale.value = true;
  modelPrececkout.value = {
    name: `Solicitação de consulta Nº ${item.id} do paciente ${item.Patient?.name} ${item.Patient?.surname}`,
    description: `Solicitação de consulta Nº ${item.id} do paciente ${item.Patient?.name} ${item.Patient?.surname}`,
    dueDays: 2,
    paymentForm: "CREDIT_CARD",
    discountValue: undefined,
    discountType: undefined,
    installmentCount: 1,
    itemValue: total,
    totalValue: total,
    category: "solicitation",
    totalBruteValue: total,
    packageId: undefined,
    voucherDesconto: "",
    voucherId: undefined,
    publicSaleId: "",
    packgeSaleValue: total, // valor do pacote, no caso é uma solicitação única
    packgeQuantity: 1, //atende apenas uma solicitação
  };
};

const handleSaleItemForAsaas = async () => {
  showSale.value = false;
  loading.value = true;
  try {
    if (!selected.value) {
      push.warning("Solicitação não encontrada!");
      return;
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
        solicitationId: selected.value.id,
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
        solicitationId: selected.value.id,
      };

      await asaas.createPayment(payload);
    }

    if ($paymentResponse.value?.data?.invoiceUrl) {
      window.open($paymentResponse.value.data.invoiceUrl, "_blank");
    }
    selected.value = undefined;
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

// const handleReceipt = (item: SolicitationConsultationProps) => {
//   // se cair aqiu é porque foi pago com saldo em créditos
//   if (!item.sale && item.status === "paid") {
//     showRecipt.value = true;
//     return;
//   }

//   //se não tem venda então não fazer nada no asaas
//   if (!item.sale) {
//     push.warning("Pagamento não encontrado");
//     return;
//   }

//   const popupWidth = 800;
//   const popupHeight = 600;
//   const screenWidth = window.screen.width;
//   const screenHeight = window.screen.height;

//   const popupLeft = Math.round((screenWidth - popupWidth) / 2);
//   const popupTop = Math.round((screenHeight - popupHeight) / 2);

//   window.open(
//     item.sale.transactionReceiptUrl,
//     "_blank",
//     `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes`
//   );
// };

const handleUseCreditSalt = async (item: SolicitationConsultationProps) => {
  loading.value = true;
  try {
    selected.value = item;
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

const handleClickRate = (item: SolicitationConsultationProps) => {
  item.rate = 1;
  isRate.value = true;
};

const getShowCorrection = (item: SolicitationConsultationProps) => {
  showDateCorrection.value = true;
  selected.value = item;
};

const handleGetTipTap = (item: SolicitationConsultationProps) => {
  selected.value = item;
  showTipValue.value = true;
};

const getSolicitationTotal = (item: SolicitationConsultationProps) => {
  return amountFormated(
    Number(item.consultationValue ?? 0) +
      Number(item.antecipationValue ?? 0) +
      Number(item.medicalSpecialtyValue ?? 0),
    true
  );
};

const handleUseCreditFormClose = () => {
  emit("refresh");
  selected.value = undefined;
};

const handleCancelAntecipation = async (publicId: string) => {
  push.info({
    title: "Cancelar antecipação",
    message: "Tem certeza que deseja cancelar antecipação ?",
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
              await storeConsultation.solicitationCancelAntecipation(publicId);
              await getSolicitations();
            } catch (error) {
              push.error("Erro ao cancelar antecipação");
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

const handleCopy = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      push.success("Link copiado para a área de transferência");
    })
    .catch(() => {
      push.warning("Erro ao copiar link tente novamente");
    });
};
</script>
