<template>
  <DialogForm
    title="Detalhes Webhook Transação"
    :show="show"
    borderColor="#c8e040"
    fullscreen
    @dialog="show = false"
  >
    <CardBlur class="pa-4" height="100%">
      <div class="d-flex align-center justify-space-between pa-4">
        <!-- <span class="text-subtitle-1 text-colorTextPrimary">
          Detalhes Webhook
        </span> -->
        <div class="d-flex align-center" style="gap: 0.5rem">
          <v-icon icon="mdi-webhook" start size="30" color="orange" />
          <span class="text-h5 font-weight-bold text-colorTextPrimary">
            Detalhes
          </span>
        </div>
      </div>
      <v-card-text>
        <Table
          title="Eventos Webhook da Transação"
          :headers="headers"
          :items="$webhookEvents || []"
          :showCrud="false"
        >
          <template #item.value="{ item }">
            <span class="font-weight-bold text-green">
              {{ amountFormated(Number(item.value ?? "0"), true) }}
            </span>
          </template>

          <template #item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="x-small"
              variant="flat"
            >
              <span class="text-caption">
                {{ item.status }}
              </span>
            </v-chip>
          </template>

          <template #item.billingType="{ item }">
            <v-chip
              :color="getBillingTypeColor(item.billingType)"
              size="x-small"
              variant="outlined"
            >
              <span class="text-caption">
                {{ formatBillingType(item.billingType) }}
              </span>
            </v-chip>
          </template>

          <template #item.createdAt="{ item }">
            {{ dayjs(item.createdAt).format("DD/MM/YYYY HH:mm") }}
          </template>
          <template #item.details="{ item }">
            <Button
              color="primary"
              size="small"
              @click="handleContentDetails(item.content)"
            >
              <v-icon icon="mdi-information" color="colorIcon" start />
              <span class="text-white text-caption"> Detalhes </span>
            </Button>
          </template>

          <template #bottom>
            <div class="text-center pa-4">
              <span class="text-caption text-medium-emphasis">
                Total de {{ $webhookEvents?.length || 0 }} evento(s)
              </span>
            </div>
          </template>
        </Table>
      </v-card-text>
    </CardBlur>
    <TransactionWebhookDetailsContent
      :content="contentDetails"
      v-model="showContentDeatails"
      @close="contentDetails = ''"
    />
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const transactionsStore = useTransactionsStore();
const { amountFormated } = useUtils();

const $webhookEvents = computed(
  () => transactionsStore.$transaction?.SaleWebhookEvents,
);

const show = defineModel({
  default: false,
});

const showContentDeatails = ref(false);
const contentDetails = ref("");

const headers = [
  {
    title: "Pagamento",
    key: "billingType",
  },
  {
    title: "Valor",
    key: "value",
  },
  {
    title: "Status",
    key: "status",
  },
  {
    title: "Motivo",
    key: "reason",
  },
  {
    title: "Data/Hora",
    key: "createdAt",
    width: "10%",
  },
  {
    title: "Detalhes",
    key: "details",
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    CONFIRMED: "success",
    PENDING: "warning",
    RECEIVED: "success",
    FAILED: "error",
    CANCELLED: "error",
  };
  return colors[status] || "grey";
};

const getBillingTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    CREDIT_CARD: "purple",
    PIX: "cyan",
    BOLETO: "orange",
    DEBIT_CARD: "blue",
  };
  return colors[type] || "grey";
};

const formatBillingType = (type: string) => {
  const types: Record<string, string> = {
    CREDIT_CARD: "Cartão de Crédito",
    PIX: "PIX",
    BOLETO: "Boleto",
    DEBIT_CARD: "Cartão de Débito",
  };
  return types[type] || type;
};

const handleContentDetails = (content: string) => {
  contentDetails.value = content;
  showContentDeatails.value = true;
};
</script>
