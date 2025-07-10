<template>
  <Table
    title="Transações"
    :headers="headers"
    :items="$transactions"
    class="elevation-1"
    :loading="loading"
    :show-crud="false"
    :items-per-page="30"
  >
    <template v-slot:top-table>
      <v-row desnse>
        <v-col cols="12" lg="2">
          <DatePicker
            v-model="filters.initialDate"
            label="Data inicial"
            class="mb-4"
          />
        </v-col>
        <v-col cols="12" lg="2">
          <DatePicker
            v-model="filters.finalDate"
            label="Data final"
            class="mb-4"
          />
        </v-col>
        <v-col cols="12" lg="2">
          <SelectInput
            label="Satus"
            v-model="filters.status"
            :items="statusSale"
            item-title="label"
            item-value="value"
            @update:model-value="getTransactions"
          />
        </v-col>
        <v-col cols="12" lg="4" class="d-flex flex-wrap" style="gap: 0.5rem">
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            class="text-none"
            @click="getTransactions"
          >
            <v-icon icon="mdi-filter" start />
            Filtrar
          </v-btn>
          <v-btn
            color="green"
            variant="flat"
            size="small"
            class="text-none"
            @click="showFormTransaction = true"
          >
            <v-icon icon="mdi-plus" start />
            Nova transação
          </v-btn>
        </v-col>
      </v-row>
      <div class="d-flex justify-end w-100 py-6">
        <v-chip
          label
          color="blue"
          text-color="white"
          class="ma-2"
          variant="flat"
        >
          <span class="text-subtitle-1 font-weight-bold">
            Total: {{ amountFormated($total ?? 0, true) }}
          </span>
        </v-chip>
      </div>
    </template>
    <template v-slot:item.total="{ item }">
      <span class="font-weight-bold">
        {{ amountFormated(item.total ?? 0, false) }}
      </span>
    </template>
    <template v-slot:item.dateCreated="{ item }">
      <span class="font-weight-bold">
        {{ formatDate(item.dateCreated) }}
      </span>
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip
        density="comfortable"
        :prepend-icon="getTransactionStatusDetails(item).icon"
        variant="flat"
        :color="getTransactionStatusDetails(item).color"
      >
        {{ getTransactionStatusDetails(item).label }}
      </v-chip>
    </template>
  </Table>
  <DialogLoading :dialog="loading" />
  <SellerManualSale
    v-model:show="showFormTransaction"
    @confirm-sale="getTransactions"
  />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const transactionsStore = useTransactionsStore();
const auth = useAuthStore();
const { amountFormated, formatDate } = useUtils();

const $currentUser = computed(() => auth.$currentUser);
const $transactions = computed(() => transactionsStore.$transactions);
const $total = computed(() =>
  transactionsStore.$transactions.reduce(
    (acc, transaction) => acc + Number(transaction.total ?? 0),
    0
  )
);

const loading = ref(false);
const showFormTransaction = ref(false);
const statusSale = ref([
  {
    label: "Todos",
    value: "all",
  },
  {
    label: "Pendente",
    value: "PENDING",
  },
  {
    label: "Confirmado",
    value: "CONFIRMED",
  },
  {
    label: "Cancelado",
    value: "CANCELED",
  },
]);
const headers = [
  { title: "Cliente", key: "client" },
  { title: "Data", key: "dateCreated" },
  { title: "Descrição", key: "description" },
  { title: "Forma Pgto", key: "billingType" },
  { title: "Total", key: "total" },
  { title: "Status", key: "status" },
  // { title: "Ações", key: "actions", sortable: false },
];

const filters = ref({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  status: "all",
});

const getTransactions = async () => {
  loading.value = true;
  try {
    await transactionsStore.getTransactions({
      ...filters.value,
      status: filters.value.status === "all" ? undefined : filters.value.status,
      sellerId:
        $currentUser.value?.profile?.type === "VENDEDOR"
          ? $currentUser.value?.id
          : undefined,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
  } finally {
    loading.value = false;
  }
};

const getTransactionStatusDetails = (item: TransactionProps) => {
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
</script>
