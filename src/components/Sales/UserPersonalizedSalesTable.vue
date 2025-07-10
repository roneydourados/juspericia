<template>
  <Table
    title="Minhas compras personalizadas"
    :headers="headers"
    :items="$sales"
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
      </v-row>
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
          item.status === 'CONFIRMED' ? 'mdi-check-circle' : 'mdi-clock-outline'
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
        @click="hanelMountModelPrececkout(item)"
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
  <DialogLoading :dialog="loading" />
  <AsaasPreCheckout
    v-model:show="showPrececkout"
    v-model="modelPrececkout"
    @confirm-sale="handleSaleItem"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const salesStore = useSaleStore();
const auth = useAuthStore();
const asaas = useAsaasStore();
const { amountFormated, formatDate } = useUtils();

const $sales = computed(() => salesStore.$all);
const $currentUser = computed(() => auth.$currentUser);
const $paymentResponse = computed(() => asaas.$paymentReponse);
const $total = computed(() =>
  salesStore.$all.reduce(
    (acc, transaction) => acc + Number(transaction.packgeSaleValue ?? 0),
    0
  )
);

const showPrececkout = ref(false);
const loading = ref(false);
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
});

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

const hanelMountModelPrececkout = (item: SaleProps) => {
  modelPrececkout.value = {
    name: item.description ?? "",
    description: item.description ?? "",
    dueDays: 2,
    paymentForm: "CREDIT_CARD",
    discountValue: undefined,
    discountType: undefined,
    installmentCount: 1,
    itemValue: Number(item.value ?? 0),
    totalValue: Number(item.value ?? 0),
    category: item.category ?? "package",
    totalBruteValue: Number(item.value ?? 0),
    packageId: undefined,
    voucherDesconto: "",
    voucherId: undefined,
    publicSaleId: item.publicId ?? "",
    packgeSaleValue: item.packgeSaleValue ?? 0,
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
        userId: $currentUser.value!.id!, // aqui é o código do usuário que está comprando, no caso o cliente/advogado
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
        userId: $currentUser.value!.id!, // aqui é o código do usuário que está comprando, no caso o cliente/advogado
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
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const popupWidth = Math.round(screenWidth * 0.95);
      const popupHeight = Math.round(screenHeight * 0.95);
      const popupLeft = Math.round((screenWidth - popupWidth) / 2);
      const popupTop = Math.round((screenHeight - popupHeight) / 2);

      window.open(
        $paymentResponse.value?.data?.invoiceUrl,
        "_blank",
        `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes`
      );
    }

    await getTransactions();
  } catch (error) {
    console.error("Error creating sale:", error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = async () => {
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
  };

  await getTransactions();
};
</script>
