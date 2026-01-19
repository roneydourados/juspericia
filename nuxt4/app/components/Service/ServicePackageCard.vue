<template>
  <CardBlur :disabled="loading" :loading="loading" height="480">
    <!-- <template #title>
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="deep-purple"
          height="4"
          indeterminate
        ></v-progress-linear>
      </template>
    </template> -->
    <template #title>
      <v-img
        height="250"
        src="@/assets/images/package.avif"
        cover
        rounded="xl"
      />
    </template>

    <template #content>
      <span
        class="d-flex align-center justify-space-between"
        style="white-space: pre-line"
      >
        <span
          class="font-weight-bold text-colorTextPrimary text-truncate"
          :style="`
            font-size: ${mobile ? '0.8rem' : '1.5rem'};
            max-width: 80%;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            `"
        >
          {{ item.name }}
        </span>
        <v-avatar size="20" color="primary">
          <v-icon color="white" icon="mdi-fire-circle" size="x-small" />
        </v-avatar>
      </span>
      <p
        class="text-darkText text-subtitle-2 mt-2"
        style="white-space: pre-line"
      >
        {{ item.description }}
      </p>

      <v-row dense class="mt-4">
        <v-col cols="6">
          <v-chip color="grey" size="x-large">
            <div
              :style="`font-size: ${
                mobile ? '0.8rem' : '1.3rem;'
              }  font-weight: 600`"
              class="text-black text-colorTextPrimary"
            >
              {{ amountFormated(item.value ?? 0, true) }}
            </div>
          </v-chip>
        </v-col>
        <v-col cols="6">
          <Button @click="handleGetItemSale" size="large">
            <span :class="`${mobile ? 'text-caption' : ''}`">COMPRAR</span>
            <v-icon icon="mdi-cart-outline" end color="colorIcon" />
          </Button>
        </v-col>
      </v-row>
    </template>
  </CardBlur>
  <AsaasPreCheckout
    v-model:show="showSale"
    v-model="modelPrececkout"
    @confirm-sale="handleSaleItem"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";
const props = defineProps({
  item: {
    type: Object as PropType<ServicePackagesProps>,
    required: true,
  },
});

const { amountFormated } = useUtils();
const { mobile } = useDisplay();
const asaas = useAsaasStore();
const voucherStore = useVoucherStore();
const auth = useAuthStore();
const loading = ref(false);
const showSale = ref(false);

const $paymentResponse = computed(() => asaas.$paymentReponse);
const $currentUser = computed(() => auth.$currentUser);

const modelPrececkout = ref({
  name: props.item.name ?? "",
  description: props.item.description ?? "",
  dueDays: 2,
  paymentForm: "CREDIT_CARD",
  //discount: undefined as number | undefined,
  discountValue: undefined as number | undefined,
  discountType: undefined as string | undefined,
  installmentCount: 1,
  itemValue: Number(props.item.value ?? 0),
  totalValue: props.item.value,
  category: "package",
  packageId: props.item.id,
  voucherDesconto: "",
  totalBruteValue: Number(props.item.value ?? 0),
  voucherId: undefined as number | undefined,
});

const handleSaleItem = async () => {
  showSale.value = false;
  loading.value = true;
  try {
    if (!props.item) {
      push.warning("Selecione um item para comprar");
    }

    if (
      modelPrececkout.value.installmentCount &&
      modelPrececkout.value.installmentCount > 1
    ) {
      //se for parcelada enviar quantidade de parcelas e o valor total
      await asaas.createPayment({
        dueDate: dayjs()
          .add(modelPrececkout.value.dueDays, "days")
          .format("YYYY-MM-DD"),
        description: props.item.name!,
        category: modelPrececkout.value.category,
        packageId: props.item.id,
        dueDays: props.item.dueDays,
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
        packgeSaleValue: modelPrececkout.value.itemValue ?? 0,
        packgeQuantity: props.item.packageQuantity ?? 1,
      });
    } else {
      const payload = {
        dueDate: dayjs()
          .add(modelPrececkout.value.dueDays, "days")
          .format("YYYY-MM-DD"),
        //value: props.item.value!,
        value: modelPrececkout.value.totalValue,
        description: props.item.name!,
        category: modelPrececkout.value.category,
        packageId: props.item.id,
        dueDays: props.item.dueDays,
        billingType: modelPrececkout.value.paymentForm,
        voucherId: modelPrececkout.value.voucherId,
        userId: $currentUser.value!.id!, // aqui é o código do usuário que está comprando, no caso o cliente/advogado
        discount: {
          value: modelPrececkout.value.discountValue ?? 0,
          type: modelPrececkout.value.discountType,
        },
        saleValue: modelPrececkout.value.totalValue ?? 0,
        packgeSaleValue: modelPrececkout.value.itemValue ?? 0,
        packgeQuantity: props.item.packageQuantity ?? 1,
      };

      await asaas.createPayment(payload);
    }

    if ($paymentResponse.value?.data?.invoiceUrl) {
      //window.location.href = $paymentResponse.value.data.invoiceUrl;
      window.open($paymentResponse.value.data.invoiceUrl, "_blank");
    }

    // if ($paymentResponse.value?.data?.invoiceUrl) {
    //   const screenWidth = window.screen.width;
    //   const screenHeight = window.screen.height;
    //   const popupWidth = Math.round(screenWidth * 0.95);
    //   const popupHeight = Math.round(screenHeight * 0.95);
    //   const popupLeft = Math.round((screenWidth - popupWidth) / 2);
    //   const popupTop = Math.round((screenHeight - popupHeight) / 2);

    //   window.open(
    //     $paymentResponse.value?.data?.invoiceUrl,
    //     "_blank",
    //     `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=yes`
    //   );
    // }
    clearModel();
  } catch (error) {
    push.error("Erro ao finalizar pagamento");
    console.log("🚀 ~ handleSaleItem ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const handleGetItemSale = () => {
  modelPrececkout.value = {
    name: props.item.name ?? "",
    description: props.item.description ?? "",
    dueDays: 2,
    paymentForm: "CREDIT_CARD",
    //discount: undefined as number | undefined,
    installmentCount: 1,
    itemValue: Number(props.item.value ?? 0),
    totalValue: props.item.value,
    category: "package",
    packageId: props.item.id,
    voucherDesconto: "",
    totalBruteValue: Number(props.item.value ?? 0),
    voucherId: undefined,
    discountValue: undefined,
    discountType: undefined,
  };
  showSale.value = true;
};

const handleCancel = () => {
  showSale.value = false;
  clearModel();
};

const clearModel = () => {
  voucherStore.clear();
  modelPrececkout.value = {
    name: props.item.name ?? "",
    description: props.item.description ?? "",
    dueDays: 2,
    paymentForm: "CREDIT_CARD",
    //discount: undefined as number | undefined,
    installmentCount: 1,
    itemValue: Number(props.item.value ?? 0),
    totalValue: props.item.value,
    category: "package",
    packageId: props.item.id,
    voucherDesconto: "",
    totalBruteValue: Number(props.item.value ?? 0),
    voucherId: undefined,
    discountValue: undefined,
    discountType: undefined,
  };
};
</script>
