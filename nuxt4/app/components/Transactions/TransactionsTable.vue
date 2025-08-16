<template>
  <Table
    title="Transações"
    font-size="1.5rem"
    :headers="headers"
    :items="$transactions"
    class="elevation-1"
    :loading="loading"
    :show-crud="false"
    :items-per-page="30"
  >
    <template v-slot:top-table>
      <v-row desnse>
        <v-col cols="12" lg="3" class="d-flex flex-wrap" style="gap: 0.5rem">
          <DatePicker
            v-model="filters.initialDate"
            label="Data inicial"
            class="mb-4"
          />
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
        <v-col cols="12" lg="3">
          <SelectSearchLawyer
            label="Cliente"
            v-model="filters.client"
            clearable
          />
        </v-col>
        <v-col cols="12" lg="3" class="d-flex flex-wrap" style="gap: 0.5rem">
          <Button
            color="primary"
            variant="flat"
            size="small"
            class="text-none"
            @click="getTransactions"
          >
            <v-icon icon="mdi-filter-outline" start color="colorIcon" />
            <span class="text-caption"> Filtrar </span>
          </Button>
          <Button
            color="primary"
            variant="flat"
            size="small"
            class="text-none"
            @click="showFormTransaction = true"
          >
            <v-icon icon="mdi-plus" start color="colorIcon" />
            <span class="text-caption"> Nova transação </span>
          </Button>
        </v-col>
      </v-row>
      <div class="d-flex align-center py-6" style="gap: 0.5rem">
        <span>Total:</span>
        <strong style="font-size: 1rem">{{
          amountFormated($total ?? 0, true)
        }}</strong>
      </div>
    </template>
    <template v-slot:item.total="{ item }">
      <span class="font-weight-bold">
        {{ amountFormated(item.total ?? 0, false) }}
      </span>
    </template>
    <template v-slot:item.packgeSaleValue="{ item }">
      <span class="font-weight-bold">
        {{
          amountFormated(
            Number(item.packgeSaleValue ?? 0) / (item.packgeQuantity ?? 1),
            true
          )
        }}
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
        <span class="text-caption">
          {{ getTransactionStatusDetails(item).label }}
        </span>
      </v-chip>
    </template>
    <template #item.actions="{ item }">
      <Button
        v-if="item.status === 'PENDING'"
        variant="outlined"
        color="red"
        size="small"
        class="text-none"
        @click="getTransactionCancel(item.publicId)"
      >
        <v-icon icon="mdi-cancel" start />
        <span class="text-caption">Cancelar</span>
      </Button>
    </template>
  </Table>
  <DialogLoading :dialog="loading" />
  <TransactionForm
    v-model:show="showFormTransaction"
    @confirm-sale="getTransactions"
  />
  <Dialog
    title="CONFIRME"
    :dialog="showCancelSale"
    @cancel="showCancelSale = false"
    @confirm="handleCancelItem"
    show-cancel
  >
    <span>Conforma o cancelamento da transação ? </span>
  </Dialog>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const transactionsStore = useTransactionsStore();
//const auth = useAuthStore();
const { amountFormated, formatDate } = useUtils();

//const $currentUser = computed(() => auth.$currentUser);
const $transactions = computed(() => transactionsStore.$transactions);
const $total = computed(() =>
  transactionsStore.$transactions.reduce(
    (acc, transaction) => acc + Number(transaction.total ?? 0),
    0
  )
);

const showCancelSale = ref(false);
const loading = ref(false);
const showFormTransaction = ref(false);
const publicIdCancel = ref("");
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
  { title: "Vendedor", key: "seller" },
  { title: "Qtde Consultas", key: "packgeQuantity" },
  { title: "Valor Consulta", key: "packgeSaleValue" },
  { title: "Ações", key: "actions", sortable: false },
];

const filters = ref({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  status: "all",
  client: undefined as UserProps | undefined,
});

const getTransactions = async () => {
  loading.value = true;
  try {
    await transactionsStore.getTransactions({
      ...filters.value,
      status: filters.value.status === "all" ? undefined : filters.value.status,
      userId: filters.value.client ? filters.value.client.id : undefined,
      // sellerId:
      //   $currentUser.value?.profile?.type === "VENDEDOR"
      //     ? $currentUser.value?.id
      //     : undefined,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
  } finally {
    loading.value = false;
  }
};

const getTransactionCancel = (publicId: string) => {
  publicIdCancel.value = publicId;
  showCancelSale.value = true;
};

const handleCancelItem = async () => {
  if (!publicIdCancel.value) {
    console.warn("Selecione uma transação para cancelar.");
    return;
  }

  loading.value = true;
  try {
    await transactionsStore.cancelTransaction(publicIdCancel.value);
  } catch (error) {
    console.error("Error canceling transaction:", error);
  } finally {
    loading.value = false;
    showCancelSale.value = false;
    await getTransactions();
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
