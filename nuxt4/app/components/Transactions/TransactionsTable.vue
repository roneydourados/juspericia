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
      <v-row dense>
        <v-col cols="12" lg="4" class="d-flex flex-wrap" style="gap: 0.5rem">
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
            label="Status"
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
      <v-row dense>
        <v-col cols="12" lg="3">
          <div class="d-flex align-center py-6" style="gap: 0.5rem">
            <span>Total:</span>
            <v-chip variant="flat" color="primary" size="large">
              <strong style="font-size: 1.2rem">
                {{ amountFormated($total ?? 0, true) }}
              </strong>
            </v-chip>
          </div>
        </v-col>
        <v-col cols="12" lg="3">
          <div class="d-flex align-center py-6" style="gap: 0.5rem">
            <span>Quantidade:</span>
            <v-chip variant="flat" color="primary" size="large">
              <strong style="font-size: 1.2rem">
                {{ $transactions.length }}
              </strong>
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-slot:item.client="{ item }">
      <v-expansion-panels flat color="background">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-row dense>
              <v-col cols="12" lg="4">
                <span class="font-weight-bold text-colorTextPrimary">{{
                  item.client
                }}</span>
              </v-col>
              <v-col cols="12" lg="2">
                <span
                  class="text-caption text-medium-emphasis"
                  style="width: 7rem"
                >
                  Data: {{ dayjs(item.updatedAt).format("DD/MM/YYYY HH:mm") }}
                </span>
              </v-col>
              <v-col cols="12" lg="3">
                <span
                  class="text-caption text-medium-emphasis"
                  style="width: 7rem"
                >
                  Vend.:
                  {{ item.seller || "-" }}
                </span>
              </v-col>
              <v-col
                cols="12"
                lg="3"
                class="d-flex align-center justify-space-between"
              >
                <span class="font-weight-bold text-colorTextPrimary">
                  {{ amountFormated(item.total ?? 0, true) }}
                </span>
                <v-chip
                  density="compact"
                  variant="flat"
                  :color="getTransactionStatusDetails(item).color"
                  style="width: 7rem"
                  class="mr-2"
                >
                  <template #prepend>
                    <v-icon
                      :icon="getTransactionStatusDetails(item).icon"
                      start
                      size="16"
                    />
                  </template>
                  <span class="text-caption">
                    {{ getTransactionStatusDetails(item).label }}
                  </span>
                </v-chip>
              </v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text
            style="background-color: rgb(var(--v-theme-background)) !important"
          >
            <v-row dense>
              <v-col
                cols="12"
                md="4"
                class="d-flex flex-wrap"
                style="gap: 1rem"
              >
                <div class="d-flex flex-column">
                  <div class="font-weight-bold">Criada em:</div>
                  <div class="text-caption text-medium-emphasis">
                    {{ dayjs(item.createdAt).format("DD/MM/YYYY HH:mm") }}
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <div class="font-weight-bold">Paga em:</div>
                  <div class="text-caption text-medium-emphasis">
                    {{
                      item.status === "CONFIRMED" || item.status === "RECEIVED"
                        ? dayjs(item.updatedAt).format("DD/MM/YYYY HH:mm")
                        : "-"
                    }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="font-weight-bold">Forma de Pagamento:</div>
                <div class="text-caption text-medium-emphasis">
                  {{ item.billingType }}
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="font-weight-bold">Descrição:</div>
                <div class="text-caption text-medium-emphasis">
                  {{ item.description }}
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="font-weight-bold">Valor por Consulta:</div>
                <div class="text-caption text-medium-emphasis">
                  {{
                    amountFormated(
                      Number(item.packgeSaleValue ?? 0) /
                        (item.packgeQuantity ?? 1),
                      true,
                    )
                  }}
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="font-weight-bold">Qtde Consultas:</div>
                <div class="text-caption text-medium-emphasis">
                  {{ item.packgeQuantity }}
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="font-weight-bold">Vendedor:</div>
                <div class="text-caption text-medium-emphasis">
                  {{ item.seller || "-" }}
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <Button
                  variant="text"
                  color="primary"
                  class="text-none"
                  @click="webhookDetails(item)"
                >
                  <v-icon icon="mdi-webhook" start />
                  <span class="text-caption"> Ver detalhes do Webhook </span>
                </Button>
              </v-col>
              <v-col cols="12" md="4">
                <Button
                  variant="text"
                  color="orange-darken-4"
                  class="text-none"
                  @click="hanelMountModelPrececkout(item)"
                >
                  <v-icon icon="mdi-link" start />
                  <span class="text-caption">
                    Copiar/Gerar link de pagamento
                  </span>
                </Button>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
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
      <div class="d-flex align-center w-100" style="gap: 0.5rem">
        <Button
          variant="text"
          color="red"
          icon
          class="text-none"
          @click="getTransactionCancel(item.publicId)"
          :disabled="item.status !== 'PENDING'"
        >
          <v-icon icon="mdi-cancel" />

          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Cancelar transação
          </v-tooltip>
        </Button>
        <Button
          variant="text"
          color="primary"
          class="text-none"
          icon
          @click="getTransactionSetSeller(item)"
          :disabled="item.sellerId && $currentUser?.profile?.type !== 'ADMIN'"
        >
          <v-icon icon="mdi-account" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Vincular vendedor a transação
          </v-tooltip>
        </Button>
      </div>
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
  <TransactionSetSeller
    v-model:show="showSetSellerForm"
    :public-id="transactionPublicId"
    @close="getTransactions"
  />
  <TransactionWebhookDetails v-model="showWebhookDetails" />
  <AsaasPreCheckout
    v-model:show="showPrececkout"
    v-model="modelPrececkout"
    @confirm-sale="handleSaleItem"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const transactionsStore = useTransactionsStore();
const asaas = useAsaasStore();
const auth = useAuthStore();
const { amountFormated, formatDate } = useUtils();

const $currentUser = computed(() => auth.$currentUser);
const $transactions = computed(() => transactionsStore.$transactions);
const $total = computed(() =>
  transactionsStore.$transactions.reduce(
    (acc, transaction) => acc + Number(transaction.total ?? 0),
    0,
  ),
);

const showPrececkout = ref(false);
const showCancelSale = ref(false);
const showWebhookDetails = ref(false);
const loading = ref(false);
const showFormTransaction = ref(false);
const showSetSellerForm = ref(false);
const publicIdCancel = ref("");
const transactionPublicId = ref("");
const selectedTransaction = ref<TransactionProps>();
const modelPrececkout = ref({
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
  userId: undefined as number | undefined,
});
const statusSale = ref([
  {
    label: "Pago",
    value: "CONFIRMED",
  },
  {
    label: "Pendente",
    value: "PENDING",
  },
  {
    label: "Cancelado",
    value: "CANCELED",
  },
]);
const headers = [
  { title: "Cliente", key: "client" },
  // { title: "Data", key: "dateCreated" },
  // { title: "Descrição", key: "description" },
  // { title: "Forma Pgto", key: "billingType" },
  // { title: "Valor Consulta", key: "packgeSaleValue" },
  // { title: "Qtde Consultas", key: "packgeQuantity" },
  // { title: "Total", key: "total" },
  // { title: "Status", key: "status" },
  // { title: "Vendedor", key: "seller" },
  { title: "Ações", key: "actions", sortable: false },
];

const filters = ref({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  status: "CONFIRMED",
  client: undefined as UserProps | undefined,
});

const $paymentResponse = computed(() => asaas.$paymentReponse);

const copyToClipboard = async (text: string) => {
  try {
    // Tenta usar a API moderna do clipboard
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback para o método antigo se a API moderna falhar
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (error) {
      console.error("Erro ao copiar:", error);
      return false;
    }
  }
};

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
    case "RECEIVED":
      return {
        label: "Pago",
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

const getTransactionSetSeller = (item: TransactionProps) => {
  transactionPublicId.value = item.publicId;
  showSetSellerForm.value = true;
};

const webhookDetails = async (item: TransactionProps) => {
  loading.value = true;
  try {
    await transactionsStore.show(item.publicId);
    selectedTransaction.value = item;
    showWebhookDetails.value = true;
  } catch (error) {
    console.error("Error fetching transaction details:", error);
  } finally {
    loading.value = false;
  }
};

const hanelMountModelPrececkout = async (item: TransactionProps) => {
  loading.value = true;
  try {
    //verificar se já expirou, se sim então cancelar a cobrança anterior e gerar uma nova cobrança
    const dueDate = item.dueDate?.substring(0, 10);
    if (dayjs().isAfter(dayjs(dueDate)) && item.saleId) {
      // se a cobrança venceu, então apagar a mesma do asaas
      await asaas.deletePayment(item.saleId!);

      //pegar o públicId da venda que vai ser cancelada
      publicIdCancel.value = item.publicId!;

      //cancelar a venda
      await handleCancelItem();

      //atualizar a lista de vendas
      await getTransactions();

      push.warning(
        "Link de pagamento expirado. Clique novamente para gerar uma nova cobrança.",
      );

      return;
    }

    //se não venceu e tem uma url apenas copiar a URl
    if (item.invoiceUrl) {
      const copied = await copyToClipboard(item.invoiceUrl);
      if (copied) {
        push.success("Link de pagamento copiado para a área de transferência");
      } else {
        push.error("Opps! Erro ao copiar link de pagamento, tente novamente.");
      }
      return;
    }

    //se ainda não tem nada então gerar a cobrança
    modelPrececkout.value = {
      name: item.description ?? "",
      description: item.description ?? "",
      dueDays: 2,
      paymentForm: "CREDIT_CARD",
      discountValue: undefined,
      discountType: undefined,
      installmentCount: 1,
      itemValue: Number(item.total ?? 0),
      totalValue: Number(item.total ?? 0),
      category: "package",
      totalBruteValue: Number(item.total ?? 0),
      packageId: undefined,
      voucherDesconto: "",
      voucherId: undefined,
      publicSaleId: item.publicId ?? "",
      packgeSaleValue: item.packgeSaleValue ?? 0,
      packgeQuantity: item.packgeQuantity ?? 1,
      userId: item.userId,
    };

    showPrececkout.value = true;
  } catch (error) {
    console.error("Error preparing pre-checkout:", error);
  } finally {
    loading.value = false;
  }
};

const handleSaleItem = async () => {
  showPrececkout.value = false;
  loading.value = true;
  try {
    if (
      !modelPrececkout.value.name ||
      !modelPrececkout.value.itemValue ||
      !modelPrececkout.value.userId
    ) {
      push.warning("Preencha todos os campos obrigatórios");
      return;
    }

    if (
      modelPrececkout.value.installmentCount &&
      modelPrececkout.value.installmentCount > 1
    ) {
      //se for parcelada enviar quantidade de parcelas e o valor total
      await asaas.createPaymentManualSale({
        dueDate: dayjs()
          .add(modelPrececkout.value.dueDays, "days")
          .format("YYYY-MM-DD"),
        description: modelPrececkout.value.name,
        //category: modelPrececkout.value.category,
        //packageId: props.item.id,
        dueDays: modelPrececkout.value.dueDays,
        totalValue: modelPrececkout.value.totalValue,
        installmentCount: modelPrececkout.value.installmentCount,
        billingType: modelPrececkout.value.paymentForm,
        voucherId: modelPrececkout.value.voucherId,
        userId: modelPrececkout.value.userId, // aqui é o código do usuário que está comprando, no caso o cliente/advogado
        discount: {
          value: modelPrececkout.value.discountValue ?? 0,
          type: modelPrececkout.value.discountType,
        },
        saleValue: modelPrececkout.value.totalValue ?? 0,
        //packgeSaleValue: modelPrececkout.value.itemValue ?? 0,
        //packgeQuantity: props.item.packageQuantity ?? 1,
        publicSaleId: modelPrececkout.value.publicSaleId,
        packgeQuantity: modelPrececkout.value.packgeQuantity ?? 1,
        packgeSaleValue: modelPrececkout.value.packgeSaleValue ?? 0,
      });
    } else {
      const payload = {
        dueDate: dayjs()
          .add(modelPrececkout.value.dueDays, "days")
          .format("YYYY-MM-DD"),
        //value: props.item.value!,
        value: modelPrececkout.value.totalValue,
        description: modelPrececkout.value.name!,
        category: modelPrececkout.value.category,
        //packageId: props.item.id,
        dueDays: modelPrececkout.value.dueDays,
        billingType: modelPrececkout.value.paymentForm,
        voucherId: modelPrececkout.value.voucherId,
        userId: modelPrececkout.value.userId, // aqui é o código do usuário que está comprando, no caso o cliente/advogado
        discount: {
          value: modelPrececkout.value.discountValue ?? 0,
          type: modelPrececkout.value.discountType,
        },
        saleValue: modelPrececkout.value.totalValue ?? 0,
        publicSaleId: modelPrececkout.value.publicSaleId,
        packgeQuantity: modelPrececkout.value.packgeQuantity ?? 1,
        packgeSaleValue: modelPrececkout.value.packgeSaleValue ?? 0,
      };

      await asaas.createPaymentManualSale(payload);
    }

    if ($paymentResponse.value?.data?.invoiceUrl) {
      const copied = await copyToClipboard(
        $paymentResponse.value.data.invoiceUrl,
      );
      if (copied) {
        push.success("Link de pagamento copiado para a área de transferência");
      } else {
        push.error("Opps! Erro ao copiar link de pagamento, tente novamente.");
      }
    }

    await getTransactions();
  } catch (error) {
    console.error("Error creating sale:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = async () => {
  loading.value = true;
  try {
    showPrececkout.value = false;
    modelPrececkout.value = {
      name: "",
      description: "",
      dueDays: 2,
      paymentForm: "CREDIT_CARD",
      discountValue: undefined,
      discountType: undefined,
      installmentCount: 1,
      itemValue: 0,
      totalValue: 0,
      category: "package",
      packageId: 0,
      voucherDesconto: "",
      totalBruteValue: 0,
      voucherId: undefined,
      publicSaleId: "",
      packgeSaleValue: 0,
      packgeQuantity: 1,
      userId: undefined,
    };

    await getTransactions();
  } finally {
    loading.value = false;
  }
};
</script>
