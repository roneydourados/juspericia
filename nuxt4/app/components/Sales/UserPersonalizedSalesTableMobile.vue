<template>
  <div class="d-flex justify-end align-center mb-2">
    <v-pagination
      v-model="page"
      :length="pageCount"
      color="primary"
      rounded="circle"
      density="comfortable"
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
      <v-chip
        :prepend-icon="getTransactionStatusDetails(item).icon"
        variant="text"
        :color="getTransactionStatusDetails(item).color"
      >
        <span class="text-caption">
          {{ getTransactionStatusDetails(item).label }}
        </span>
      </v-chip>

      <div style="white-space: pre-line">
        {{ item.description }}
      </div>
    </template>
    <template #content>
      <div class="d-flex flex-column">
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex">
            <v-icon icon="mdi-calendar-month" color="colorIcon" start />
            Data:
          </div>
          <strong>
            {{ dayjs(item.dateCreated).format("DD/MM/YYYY") }}
          </strong>
        </div>
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex">
            <v-icon icon="mdi-calendar-month" color="colorIcon" start />
            Validade:
          </div>
          <strong>
            {{ dayjs(item.expiredAt).format("DD/MM/YYYY") }}
          </strong>
        </div>
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex">
            <v-icon icon="mdi-currency-usd" color="colorIcon" start />
            Total:
          </div>
          <strong>
            {{ amountFormated(item.value ?? 0, true) }}
          </strong>
        </div>
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex">
            <v-icon icon="mdi-numeric" color="colorIcon" start />
            Qtde Consultas:
          </div>
          <strong>
            {{ item.packgeQuantity }}
          </strong>
        </div>
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex">
            <v-icon icon="mdi-currency-usd" color="colorIcon" start />
            Valor Por consulta:
          </div>
          <strong>
            {{
              amountFormated(
                Number(item.packgeSaleValue ?? 0) / (item.packgeQuantity ?? 1),
                true
              )
            }}
          </strong>
        </div>
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex">
            <v-icon icon="mdi-currency-usd" color="colorIcon" start />
            Forma Pgto:
          </div>
          <strong>
            {{ getPaymentForm(item.billingType ?? "") }}
          </strong>
        </div>
        <v-divider class="mt-4"></v-divider>
      </div>
    </template>
    <template #actions>
      <div
        class="d-flex align-center justify-end mt-n8 w-100"
        style="gap: 0.5rem"
      >
        <v-btn
          v-if="item.status === 'PENDING'"
          variant="text"
          color="success"
          icon
          @click="emit('pre-checkout', item)"
        >
          <v-icon icon="mdi-cash-multiple" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Efetuar pagamento
          </v-tooltip>
        </v-btn>
        <v-btn
          v-if="item.status === 'PENDING'"
          variant="text"
          color="error"
          size="small"
          class="text-none"
          icon
          @click="emit('cancel-transaction', item.publicId)"
        >
          <v-icon icon="mdi-cancel" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Cancelar compra
          </v-tooltip>
        </v-btn>
      </div>
    </template>
  </CardBlur>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const emit = defineEmits(["pre-checkout", "cancel-transaction"]);

const { amountFormated } = useUtils();

const salesStore = useSaleStore();

const $all = computed(() => salesStore.$all);

const itemsPerPage = ref(10);
const page = ref(1);

const paginatedItems = computed(() => {
  const all = $all.value || [];
  const start = (page.value - 1) * itemsPerPage.value;
  return all.slice(start, start + itemsPerPage.value);
});

const pageCount = computed(() => {
  const all = $all.value || [];

  if (all.length === 0) return all.length;

  return Math.ceil(all.length / itemsPerPage.value);
});

const getTransactionStatusDetails = (item: SaleProps) => {
  //se a venda for vencida e ainda esta pendente, já retornar este status
  const dueDate = item.dueDate?.substring(0, 10);
  if (
    dayjs().isAfter(dayjs(dueDate)) &&
    item.saleId &&
    item.status === "PENDING"
  ) {
    return {
      label: "Vencida",
      color: "orange-darken-2",
      icon: "mdi-clock-outline",
    };
  }
  switch (item.status) {
    case "CONFIRMED":
      return {
        label: "Confirmado",
        color: "green",
        icon: "mdi-check-circle",
      };
    case "PENDING":
      return {
        label: "Pendente",
        color: "orange-darken-2",
        icon: "mdi-clock-outline",
      };
    case "CANCELED":
      return {
        label: "Cancelado",
        color: "red",
        icon: "mdi-close-circle",
      };
    case "REFUNDED":
      return {
        label: "Reembolsado",
        color: "blue-grey",
        icon: "mdi-undo",
      };
    default:
      return {
        label: "Desconhecido",
        color: "grey",
        icon: "mdi-help-circle",
      };
  }
};

const getPaymentForm = (value: string) => {
  switch (value) {
    case "CREDIT_CARD":
      return "Cartão de Crédito";
    case "BOLETO":
      return "Boleto";
    case "PIX":
      return "Pix";
    default:
      return "Nenhum";
  }
};
</script>
