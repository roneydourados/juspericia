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
        title="Minhas vendas personalizadas"
        :headers="headers"
        :items="$sales"
        class="elevation-1"
        :loading="loading"
        :show-crud="false"
        :items-per-page="30"
      >
        <template v-slot:top-table>
          <div class="d-flex justify-space-between w-100 py-6">
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
        <template v-slot:item.value="{ item }">
          <span class="font-weight-bold">
            {{ amountFormated(item.value ?? 0, true) }}
          </span>
        </template>
        <template v-slot:item.dateCreated="{ item }">
          <span class="font-weight-bold">
            {{ formatDate(item.dateCreated) }}
          </span>
        </template>
        <template v-slot:item.billingType="{ item }">
          <span class="font-weight-bold">
            {{ getPaymentForm(item.billingType) }}
          </span>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip
            :prepend-icon="
              item.status === 'CONFIRMED'
                ? 'mdi-check-circle'
                : 'mdi-clock-outline'
            "
            variant="flat"
            :color="item.status === 'CONFIRMED' ? 'green' : 'orange-darken-2'"
          >
            {{ item.status === "CONFIRMED" ? "Confirmado" : "Pendente" }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            v-if="item.status === 'PENDING'"
            variant="flat"
            color="success"
            size="small"
            class="text-none"
          >
            <v-icon icon="mdi-cash-multiple" start class="mt-n1" />
            <span class="text-caption">Pagamento</span>
          </v-btn>
          <v-btn
            v-if="item.status === 'CONFIRMED'"
            variant="text"
            color="info"
            icon
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
    </v-col>
  </v-row>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const salesStore = useSaleStore();
const auth = useAuthStore();
const { amountFormated, formatDate } = useUtils();

const $sales = computed(() => salesStore.$all);
const $currentUser = computed(() => auth.$currentUser);
const $total = computed(() =>
  salesStore.$all.reduce(
    (acc, transaction) => acc + Number(transaction.packgeSaleValue ?? 0),
    0
  )
);

const loading = ref(false);

const headers = [
  { title: "Data", key: "dateCreated" },
  { title: "Descrição", key: "description" },
  { title: "Forma Pgto", key: "billingType" },
  { title: "Total", key: "value" },
  { title: "Status", key: "status" },
  { title: "Ações", key: "actions" },
];

const filters = ref({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
});

const getTransactions = async () => {
  loading.value = true;
  try {
    await salesStore.getSalesUser({
      ...filters.value,
      userId: $currentUser.value!.id!,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
  } finally {
    loading.value = false;
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
