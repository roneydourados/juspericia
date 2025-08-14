<template>
  <div>
    <v-card flat rounded="lg" color="transparent">
      <v-card-title>
        <HeaderPage title="Meus saldos" font-size="1.5rem" />
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" lg="3">
            <v-card flat elevation="8" rounded="xl" color="transparent">
              <v-card-title>
                <div class="text-subtitle-2 d-flex justify-space-between px-4">
                  <span class="text-primary"> Saldo Créditos </span>
                  <v-icon
                    icon="mdi-calendar-clock-outline"
                    size="30"
                    color="primary"
                  />
                </div>
              </v-card-title>
              <v-card-text class="d-flex align-center justify-space-between">
                <div
                  class="d-flex text-primary font-weight-bold px-4"
                  style="font-size: 1.5rem"
                >
                  {{ amountFormated($salts?.totals?.total ?? 0, true) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3">
            <v-card flat elevation="8" rounded="xl">
              <v-card-title>
                <div class="text-subtitle-2 d-flex justify-space-between px-4">
                  <span class="text-primary">Total Pendente </span>
                  <v-icon
                    icon="mdi-calendar-clock-outline"
                    size="30"
                    color="primary"
                  />
                </div>
              </v-card-title>
              <v-card-text class="d-flex align-center justify-space-between">
                <div
                  class="d-flex text-primary font-weight-bold px-4"
                  style="font-size: 1.5rem"
                >
                  {{ amountFormated($salts?.totals?.totalPending ?? 0, true) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3">
            <v-card flat elevation="8" rounded="xl">
              <v-card-title>
                <div class="text-subtitle-2 d-flex justify-space-between px-4">
                  <span class="text-primary">Total expirado</span>
                  <v-icon
                    icon="mdi-calendar-clock-outline"
                    size="30"
                    color="primary"
                  />
                </div>
              </v-card-title>
              <v-card-text class="d-flex align-center justify-space-between">
                <div
                  class="d-flex text-primary font-weight-bold px-4"
                  style="font-size: 1.5rem"
                >
                  {{ amountFormated($salts?.totals?.totalExpired ?? 0, true) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <LawyerMySaltsFilters v-model="reloadFilters" />
          </v-col>
        </v-row>
        <div class="py-4">
          <Table
            title="Compras"
            font-size="1.5rem"
            :headers="headers"
            :items="$salts?.credits"
            :show-crud="false"
          >
            <template #item.status="{ item }">
              <v-chip :color="getStatusName(item).color">
                <v-icon
                  :color="getStatusName(item).color"
                  :icon="getStatusName(item).icon"
                  size="20"
                  start
                />
                {{ getStatusName(item).text }}
              </v-chip>
            </template>
            <template #item.dateCreated="{ item }">
              <strong>
                {{ dayjs(item.dateCreated).format("DD/MM/YYYY") }}
              </strong>
            </template>
            <template #item.value="{ item }">
              <strong>{{ amountFormated(item.value, true) }}</strong>
            </template>
            <template #item.salt="{ item }">
              <strong>{{ amountFormated(item.salt, true) }}</strong>
            </template>
            <template #item.solicitationConsultationValue="{ item }">
              <strong>{{
                amountFormated(item.solicitationConsultationValue, true)
              }}</strong>
            </template>

            <template #item.expireDate="{ item }">
              <strong>
                {{ dayjs(item.expireDate).format("DD/MM/YYYY") }}
              </strong>
            </template>
            <template #item.createdAt="{ item }">
              <strong>{{ dayjs(item.createdAt).format("DD/MM/YYYY") }}</strong>
            </template>
            <template #item.actions="{ item }">
              <v-btn
                variant="text"
                color="info"
                icon
                @click="handleDetails(item)"
              >
                <v-icon icon="mdi-dots-vertical"></v-icon>
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                >
                  Detalhes
                </v-tooltip>
              </v-btn>
              <v-btn
                v-if="item.status === 'PENDING'"
                variant="text"
                color="success"
                icon
                @click="handlePaid(item)"
              >
                <v-icon icon="mdi-cash-multiple"></v-icon>
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                >
                  Efetuar pagamento
                </v-tooltip>
              </v-btn>
              <v-btn
                v-if="item.status === 'CONFIRMED'"
                variant="text"
                color="info"
                icon
                @click="handleReceipt(item)"
              >
                <v-icon icon="mdi-file-multiple"></v-icon>
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                >
                  Comprovante de pagamento
                </v-tooltip>
              </v-btn>
            </template>
          </Table>
        </div>
      </v-card-text>
    </v-card>
    <LawyerMySaltsDetails v-model="showDetails" />
    <v-snackbar
      v-model="showErrorAlert"
      vertical
      color="warning"
      :timeout="10000"
    >
      <div class="text-subtitle-1 pb-2">Saldo de crédito estava expirado</div>
      <div class="text-subtitle-1 pb-2">
        Não foi possível gerar cobrança deste saldo, pois o mesmo estava
        expirado. Acesse a sessão de pacotes efetue uma nova compra ou entre em
        contato com nossa equipe de vendas. Não se preocupe, não será gerada
        nenhuma cobrança adicional para você. ESTE SALDO DE CRÉDITO FOI REMOVIDO
        DA SUA CONTA.
      </div>
      <template #actions>
        <v-btn color="white" variant="text" @click="showErrorAlert = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const saltCredit = useUserCreditSaltStore();
const asaas = useAsaasStore();
const { amountFormated } = useUtils();
const showDetails = ref(false);
const reloadFilters = ref(false);
const showErrorAlert = ref(false);

const headers = ref([
  {
    title: "Status",
    align: "start",
    sortable: false,
    key: "status",
  },
  { title: "Data da compra", key: "dateCreated" },
  { title: "Data de expiração", key: "expireDate" },
  { title: "Valor", key: "value" },
  { title: "Saldo", key: "salt" },
  {
    title: "Valor descontar por solicitação",
    key: "solicitationConsultationValue",
  },
  { title: "Ações", key: "actions" },
]);

const $salts = computed(() => saltCredit.$credits);

const getStatusName = (item: UserCreditSalt) => {
  const currentDate = dayjs();

  switch (item.status) {
    case "CONFIRMED":
      // se estiver ativo, então verificar se não expirou
      return {
        text: dayjs(item.expireDate).isBefore(currentDate)
          ? "Expirado"
          : "Disponível",
        color: dayjs(item.expireDate).isBefore(currentDate)
          ? "warning"
          : "success",
        icon: "mdi-check-circle-outline",
      };
    case "PENDING":
      return {
        text: "Pendente",
        color: "warning",
        icon: "mdi-circle-outline",
      };
    case "REFUNDED":
      return {
        text: "Cancelado",
        color: "error",
        icon: "mdi-cancel",
      };
    default:
      return {
        text: "Indefinido",
        color: "grey",
        icon: "mdi-circle-outline",
      };
  }
};

const handleDetails = async (item: UserCreditSalt) => {
  await saltCredit.getUserCreditLog(item.publicId!);
  showDetails.value = true;
};

const handlePaid = async (item: UserCreditSalt) => {
  if (dayjs().isAfter(dayjs(item.expireDate)) && item.saleId) {
    // se a cobrança venceu, então apagar a mesma
    await asaas.deletePayment(item.saleId!);

    reloadFilters.value = true;
    showErrorAlert.value = true;
    return;
  }

  if (item.invoiceUrl) {
    window.location.href = item.invoiceUrl;
  }
};

const handleReceipt = (item: SaleProps) => {
  const popupWidth = 800;
  const popupHeight = 600;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const popupLeft = Math.round((screenWidth - popupWidth) / 2);
  const popupTop = Math.round((screenHeight - popupHeight) / 2);

  const popup = window.open(
    item.transactionReceiptUrl,
    "_blank",
    `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes`
  );

  // verificar se o popup foi fechado
  const popupChecker = setInterval(async () => {
    if (popup && popup.closed) {
      clearInterval(popupChecker);
      reloadFilters.value = true;
    }
  }, 700);
};
</script>
