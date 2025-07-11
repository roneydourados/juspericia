<template>
  <div>
    <v-card flat rounded="lg">
      <v-card-title>
        <HeaderPage title="Meus saldos" />
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" lg="3">
            <v-card flat elevation="2" rounded="lg">
              <v-card-title class="text-subtitle-2">
                Saldo Créditos
              </v-card-title>
              <v-card-text class="d-flex align-center justify-space-between">
                <v-icon icon="mdi-cash-100" size="25" color="success" />
                <div class="d-flex">
                  <span class="text-grey-darken-1" style="font-size: 1.2rem">
                    R$
                  </span>
                  <span class="font-weight-bold ml-2" style="font-size: 1.2rem">
                    {{ amountFormated($salts?.totals?.total ?? 0, false) }}
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3">
            <v-card flat elevation="2" rounded="lg">
              <v-card-title class="text-subtitle-2">
                Total pendente
              </v-card-title>
              <v-card-text class="d-flex align-center justify-space-between">
                <v-icon icon="mdi-currency-usd" size="25" color="info" />
                <div class="d-flex">
                  <span class="text-grey-darken-1" style="font-size: 1.2rem">
                    R$
                  </span>
                  <span class="font-weight-bold ml-2" style="font-size: 1.2rem">
                    {{
                      amountFormated($salts?.totals?.totalPending ?? 0, false)
                    }}
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3">
            <v-card flat elevation="2" rounded="lg">
              <v-card-title class="text-subtitle-2">
                Total expirado
              </v-card-title>
              <v-card-text class="d-flex align-center justify-space-between">
                <v-icon icon="mdi-currency-usd-off" size="25" color="warning" />
                <div class="d-flex">
                  <span class="text-grey-darken-1" style="font-size: 1.2rem">
                    R$
                  </span>
                  <span class="font-weight-bold ml-2" style="font-size: 1.2rem">
                    {{
                      amountFormated($salts?.totals?.totalExpired ?? 0, false)
                    }}
                  </span>
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
          <!-- <pre>{{ $salts?.credits }}</pre> -->
          <Table
            title="Compras"
            :headers="headers"
            :items="$salts?.credits"
            :show-crud="false"
          >
            <template #item.status="{ item }">
              <v-chip label :color="getStatusName(item).color">
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
//const auth = useAuthStore();
const { amountFormated } = useUtils();

const $salts = computed(() => saltCredit.$credits);
// const $paymentResponse = computed(() => asaas.$paymentReponse);
// const $currentUser = computed(() => auth.$currentUser);

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
  // { title: "Prazo pgto", key: "dueDate" },
  { title: "Data de expiração", key: "expireDate" },
  { title: "Valor", key: "value" },
  { title: "Saldo", key: "salt" },
  { title: "Ações", key: "actions" },
]);

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
