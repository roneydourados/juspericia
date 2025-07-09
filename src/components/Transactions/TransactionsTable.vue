<template>
  <v-row desnse>
    <v-col cols="12" lg="2">
      <DatePicker
        v-model="filters.initialDate"
        label="Data inicial"
        class="mb-4"
      />
    </v-col>
    <v-col cols="12" lg="2">
      <DatePicker v-model="filters.finalDate" label="Data final" class="mb-4" />
    </v-col>
    <v-col cols="12" lg="2">
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
    </v-col>
    <v-col cols="12">
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
          <div class="d-flex justify-space-between w-100 py-6">
            <v-btn
              color="primary"
              variant="flat"
              size="small"
              class="text-none"
              @click="showFormTransaction = true"
            >
              <v-icon icon="mdi-plus" start />
              Nova transação
            </v-btn>
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
      </Table>
    </v-col>
  </v-row>
  <DialogLoading :dialog="loading" />
  <SellerCheckoutSale v-model:show="showFormTransaction" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const userAdmin = useUserAdminStore();
const { amountFormated, formatDate } = useUtils();
const $transactions = computed(() => userAdmin.$transactions);
const $total = computed(() =>
  userAdmin.$transactions.reduce(
    (acc, transaction) => acc + Number(transaction.total ?? 0),
    0
  )
);

const loading = ref(false);
const showFormTransaction = ref(false);
const headers = [
  { title: "Cliente", key: "client" },
  { title: "Data", key: "dateCreated" },
  { title: "Descrição", key: "description" },
  { title: "Forma Pgto", key: "billingType" },
  { title: "Total", key: "total" },
];

const filters = ref({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
});

const getTransactions = async () => {
  loading.value = true;
  try {
    await userAdmin.getTransactions(filters.value);
  } catch (error) {
    console.error("Error fetching transactions:", error);
  } finally {
    loading.value = false;
  }
};
</script>
