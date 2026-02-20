<template>
  <!-- Filters -->
  <v-row dense class="mb-2">
    <v-col cols="12" class="mb-4">
      <div class="text-h6 font-weight-bold">Minhas Compras Personalizadas</div>
    </v-col>
    <v-col cols="12" md="3">
      <DatePicker v-model="filters.initialDate" label="Data inicial" />
    </v-col>
    <v-col cols="12" md="3">
      <DatePicker v-model="filters.finalDate" label="Data final" />
    </v-col>
    <v-col cols="12" md="2">
      <Button
        color="primary"
        variant="flat"
        size="small"
        @click="getTransactions"
      >
        <v-icon icon="mdi-filter-outline" start />
        Filtrar
      </Button>
    </v-col>
    <v-col
      cols="12"
      class="d-flex justify-end align-center"
      style="gap: 0.5rem"
    >
      <span class="text-caption text-medium-emphasis">Total</span>
      <span class="text-h6 font-weight-bold text-primary">
        {{ amountFormated($total, true) }}
      </span>
    </v-col>
  </v-row>

  <!-- Empty state -->
  <EmptyContent v-if="!$sales.length && !loading" />

  <!-- Items list -->
  <v-row dense>
    <v-col v-for="item in pagedSales" :key="item.id" cols="12" class="mb-1">
      <UserPersonalizedSalesItem
        :item="item"
        @cancel-transaction="getTransactionCancel"
        @pre-checkout="hanelMountModelPrececkout"
        @view-receipt="handleReceipt"
      />
    </v-col>
  </v-row>

  <!-- Pagination -->
  <v-row v-if="totalPages > 1" dense justify="center" class="mt-2">
    <v-col cols="auto">
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="5"
        density="compact"
        rounded="lg"
      />
    </v-col>
  </v-row>

  <!-- Dialogs -->
  <DialogLoading :dialog="loading" />
  <AsaasPreCheckout
    v-model:show="showPrececkout"
    v-model="modelPrececkout"
    @confirm-sale="handleSaleItem"
    @cancel="handleCancel"
  />
  <Dialog
    title="CONFIRME"
    :dialog="showCancelSale"
    show-cancel
    @cancel="showCancelSale = false"
    @confirm="handleCancelItem"
  >
    <span>Confirma o cancelamento da compra?</span>
  </Dialog>
  <v-snackbar
    v-model="showErrorAlert"
    vertical
    color="warning"
    :timeout="10000"
  >
    <div class="text-subtitle-1 pb-2">Compra fora do prazo de pagamento</div>
    <div class="text-body-2">
      Não foi possível gerar cobrança desta compra porque passou o prazo para
      pagamento. Entre em contato com nossa equipe de vendas para gerar uma nova
      compra personalizada. COMPRA FOI CANCELADA AUTOMATICAMENTE.
    </div>
    <template #actions>
      <v-btn color="white" variant="text" @click="showErrorAlert = false"
        >Fechar</v-btn
      >
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const salesStore = useSaleStore();
const auth = useAuthStore();
const asaas = useAsaasStore();
const transactionsStore = useTransactionsStore();
const { amountFormated } = useUtils();

const $sales = computed(() => salesStore.$all);
const $currentUser = computed(() => auth.$currentUser);
const $paymentResponse = computed(() => asaas.$paymentReponse);
const $total = computed(() =>
  salesStore.$all.reduce((acc, t) => acc + Number(t.packgeSaleValue ?? 0), 0),
);

const page = ref(1);
const perPage = 10;
const totalPages = computed(() => Math.ceil($sales.value.length / perPage));
const pagedSales = computed(() => {
  const start = (page.value - 1) * perPage;
  return $sales.value.slice(start, start + perPage);
});

// Reset page when data changes
watch($sales, () => {
  page.value = 1;
});

const loading = ref(false);
const showPrececkout = ref(false);
const showCancelSale = ref(false);
const publicIdCancel = ref("");
const showErrorAlert = ref(false);
const filters = ref({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
});

const defaultModel = () => ({
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
const modelPrececkout = ref(defaultModel());

const getTransactions = async () => {
  loading.value = true;
  try {
    await salesStore.getSalesUser({
      ...filters.value,
      userId: $currentUser.value!.id!,
      saleType: "manual",
    });
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const getTransactionCancel = (publicId: string) => {
  publicIdCancel.value = publicId;
  showCancelSale.value = true;
};

const handleReceipt = (item: SaleProps) => {
  const popup = window.open(
    item.transactionReceiptUrl,
    "_blank",
    "width=800,height=600,resizable=yes,scrollbars=yes",
  );
  const checker = setInterval(async () => {
    if (popup?.closed) {
      clearInterval(checker);
      await getTransactions();
    }
  }, 700);
};

const hanelMountModelPrececkout = async (item: SaleProps) => {
  if (item.status !== "PENDING") {
    push.info("Compra não está mais pendente.");
    return;
  }
  const dueDate = item.dueDate?.substring(0, 10);
  if (dayjs().isAfter(dayjs(dueDate)) && item.saleId) {
    await asaas.deletePayment(item.saleId!);
    publicIdCancel.value = item.publicId!;
    await handleCancelItem();
    await getTransactions();
    showErrorAlert.value = true;
    return;
  }
  if (item.invoiceUrl) {
    window.open(item.invoiceUrl, "_blank");
    return;
  }
  modelPrececkout.value = {
    ...defaultModel(),
    name: item.description ?? "",
    description: item.description ?? "",
    itemValue: Number(item.value ?? 0),
    totalValue: Number(item.value ?? 0),
    category: item.category ?? "package",
    totalBruteValue: Number(item.value ?? 0),
    publicSaleId: item.publicId ?? "",
    packgeSaleValue: Number(item.packgeSaleValue ?? 0),
    packgeQuantity: item.packgeQuantity ?? 1,
  };
  showPrececkout.value = true;
};

const handleSaleItem = async () => {
  showPrececkout.value = false;
  loading.value = true;
  try {
    if (!modelPrececkout.value.name || !modelPrececkout.value.itemValue) {
      push.warning("Preencha todos os campos obrigatórios");
      return;
    }
    const m = modelPrececkout.value;
    const base = {
      dueDate: dayjs().add(m.dueDays, "days").format("YYYY-MM-DD"),
      description: m.name,
      dueDays: m.dueDays,
      billingType: m.paymentForm,
      voucherId: m.voucherId,
      userId: $currentUser.value!.id!,
      discount: { value: m.discountValue ?? 0, type: m.discountType },
      saleValue: m.totalValue ?? 0,
      publicSaleId: m.publicSaleId,
      packgeQuantity: m.packgeQuantity ?? 1,
      packgeSaleValue: m.packgeSaleValue ?? 0,
    };
    if (m.installmentCount && m.installmentCount > 1) {
      await asaas.createPaymentManualSale({
        ...base,
        totalValue: m.totalValue,
        installmentCount: m.installmentCount,
      });
    } else {
      await asaas.createPaymentManualSale({
        ...base,
        value: m.totalValue,
        category: m.category,
      });
    }
    if ($paymentResponse.value?.data?.invoiceUrl)
      window.open($paymentResponse.value.data.invoiceUrl, "_blank");
    await getTransactions();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleCancel = async () => {
  showPrececkout.value = false;
  Object.assign(modelPrececkout.value, defaultModel());
  await getTransactions();
};

const handleCancelItem = async () => {
  if (!publicIdCancel.value) return;
  loading.value = true;
  try {
    await transactionsStore.cancelTransaction(publicIdCancel.value);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
    showCancelSale.value = false;
    await getTransactions();
  }
};
</script>
