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
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const saltCredit = useUserCreditSaltStore();
const asaas = useAsaasStore();
const { amountFormated } = useUtils();

const $salts = computed(() => saltCredit.$credits);
const $paymentResponse = computed(() => asaas.$paymentReponse);

const showDetails = ref(false);
const reloadFilters = ref(false);

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

const handlePaid = async (item: SaleProps) => {
  // se a fatura já estiver vencida e em aberto, então apagar e gerar outra
  if (dayjs().isAfter(dayjs(item.dueDate))) {
    await asaas.deletePayment(item.saleId!);

    await asaas.createPayment({
      dueDate: dayjs().add(2, "days").format("YYYY-MM-DD"),
      value: item.value!,
      description: item.description,
      category: "package",
      packageId: item.id,
    });

    reloadFilters.value = true;

    if ($paymentResponse.value?.data?.invoiceUrl) {
      //window.open($paymentResponse.value?.data?.invoiceUrl);

      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const popupWidth = Math.round(screenWidth * 0.95);
      const popupHeight = Math.round(screenHeight * 0.95);
      const popupLeft = Math.round((screenWidth - popupWidth) / 2);
      const popupTop = Math.round((screenHeight - popupHeight) / 2);

      const popup = window.open(
        $paymentResponse.value?.data?.invoiceUrl,
        "_blank",
        `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes`
      );

      // verificar se o popup foi fechado
      const popupChecker = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(popupChecker);
          reloadFilters.value = true;
        }
      }, 700);
    }

    return;
  }

  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const popupWidth = Math.round(screenWidth * 0.95);
  const popupHeight = Math.round(screenHeight * 0.95);
  const popupLeft = Math.round((screenWidth - popupWidth) / 2);
  const popupTop = Math.round((screenHeight - popupHeight) / 2);

  const popup = window.open(
    item.invoiceUrl,
    "_blank",
    `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes`
  );

  // verificar se o popup foi fechado
  const popupChecker = setInterval(() => {
    if (popup && popup.closed) {
      clearInterval(popupChecker);
      reloadFilters.value = true;
    }
  }, 700);
};

const handleReceipt = (item: SaleProps) => {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const popupWidth = Math.round(screenWidth * 0.7);
  const popupHeight = Math.round(screenHeight * 0.7);
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
