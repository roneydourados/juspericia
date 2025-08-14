<template>
  <Dialog
    title="CONFIRME"
    :dialog="show"
    @cancel="handleCancel"
    @confirm="handleConfirm"
    show-cancel
  >
    <div class="d-flex flex-column">
      <span>confirma a compra de {{ model.name }} ? </span>
      <div class="d-flex py-4" style="gap: 0.5rem">
        Valor:
        <strong>{{ amountFormated(model.itemValue ?? 0, false) }}</strong>
      </div>
      <v-divider class="mb-4"></v-divider>
    </div>

    <v-row dense class="mt-">
      <v-col cols="12" :lg="model.paymentForm === 'CREDIT_CARD' ? '9' : '12'">
        <SelectInput
          label="Forma de pagamento"
          :items="paymentFormsType"
          v-model="model.paymentForm"
          item-title="title"
          item-value="value"
          @update:model-value="handlePaymentForm"
        />
      </v-col>

      <v-col v-if="model.paymentForm === 'CREDIT_CARD'" cols="12" lg="3">
        <SelectInput
          label="Parcelas"
          :items="installments"
          v-model="model.installmentCount"
          item-title="title"
          item-value="value"
          @update:model-value="paymentSimulation"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" class="d-flex flex-wrap">
        <StringInput
          label="Voucher de desconto"
          v-model="model.voucherDesconto"
          is-upper-case
          :disabled="$disableVoucher"
        />
        <Button
          size="small"
          variant="outlined"
          color="primary"
          class="text-none ml-2"
          @click="getVoucher"
          :disabled="!model.voucherDesconto"
        >
          <span class="text-caption"> Aplicar </span>
        </Button>
      </v-col>
      <v-col v-if="$voucher && !isInvalidvoucher" cols="12" class="mt-n6">
        <div>{{ $voucher?.description }}</div>
        <div class="d-flex" style="gap: 0.5rem">
          <strong>
            {{ $voucher?.discount }}
            {{ $voucher?.discountType === "percentage" ? "%" : "R$" }}
          </strong>
        </div>
      </v-col>
      <v-col v-else-if="isInvalidvoucher" cols="12" class="mt-n6">
        <strong class="text-red">VOUCHER INVÁLIDO</strong>
      </v-col>
    </v-row>
    <v-progress-linear v-if="loadingVoucher" color="green" indeterminate />
    <v-divider class="mb-4"></v-divider>
    <div class="d-flex justify-space-between" style="gap: 0.5rem">
      <strong>Total bruto:</strong>
      <strong>{{ amountFormated(model.totalBruteValue ?? 0, false) }}</strong>
    </div>
    <div class="d-flex justify-space-between text-green" style="gap: 0.5rem">
      <strong>Desconto:</strong>
      <strong>
        {{ Number(model.discount ?? 0) > 0 ? "-" : "" }}
        {{ amountFormated(model.discount ?? 0, false) }}
      </strong>
    </div>
    <div class="d-flex justify-space-between" style="gap: 0.5rem">
      <strong>Total a pagar:</strong>
      <strong>{{ amountFormated(model.totalValue ?? 0, false) }}</strong>
    </div>
    <div class="d-flex justify-space-between" style="gap: 0.5rem">
      <strong>Parcelas:</strong>
      <div class="d-flex">
        <strong>{{ model.installmentCount }}</strong>
        <strong class="ml-1 mr-1">x</strong>
        <strong>
          {{
            $paymentSimulation?.creditCard?.installment?.paymentNetValue
              ? amountFormated(
                  $paymentSimulation?.creditCard?.installment?.paymentValue,
                  false
                )
              : amountFormated(Number(model.totalValue ?? 0), false)
          }}
        </strong>
        <span
          v-if="model.installmentCount && model.installmentCount > 1"
          class="ml-2"
        >
          (Com juros)
        </span>
        <span v-else class="ml-2">(Sem juros)</span>
      </div>
    </div>
    <!-- <pre>{{ $paymentSimulation }}</pre>
    <pre>{{ $systemParameters }}</pre> -->
    <!-- <FormDebug v-model="model" /> -->
    <!-- <FormDebug v-model="$voucher" /> -->
    <DialogLoading :dialog="loading" />
  </Dialog>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import type { AssasPreCheckoutProps } from "@/types/assaas/Precheckout";

const { amountFormated } = useUtils();
const asaas = useAsaasStore();
const voucherStore = useVoucherStore();
const systemParametersStore = useSystemParametersStore();
const auth = useAuthStore();

const loading = ref(false);
const loadingVoucher = ref(false);
const isInvalidvoucher = ref(false);
const show = defineModel("show", { default: false });

const emit = defineEmits(["confirm-sale", "cancel"]);

const $currentUser = computed(() => auth.$currentUser);
const $paymentSimulation = computed(() => asaas.$paymentSimulation);
const $voucher = computed(() => voucherStore.$voucherExists);
const $systemParameters = computed(() => systemParametersStore.$parameters);
const $disableVoucher = computed(() => {
  if (voucherStore.$voucherExists) {
    return true;
  }

  return false;
});

const paymentFormsType = ref([
  { title: "Cartão", value: "CREDIT_CARD" },
  { title: "Boleto", value: "BOLETO" },
  { title: "Pix", value: "PIX" },
]);

const installments = ref([
  { title: "1x", value: 1 },
  { title: "2x", value: 2 },
  { title: "3x", value: 3 },
  { title: "4x", value: 4 },
  { title: "5x", value: 5 },
  { title: "6x", value: 6 },
  { title: "7x", value: 7 },
  { title: "8x", value: 8 },
  { title: "9x", value: 9 },
  { title: "10x", value: 10 },
  { title: "11x", value: 11 },
  { title: "12x", value: 12 },
]);

const model = defineModel<AssasPreCheckoutProps>({
  default: {
    name: "",
    description: "",
    dueDays: undefined as number | undefined,
    paymentForm: "CREDIT_CARD",
    discount: 0,
    installmentCount: undefined as number | undefined,
    itemValue: undefined as number | undefined,
    totalValue: undefined as number | undefined,
    category: "",
    packageId: undefined as number | undefined,
    solicitationId: undefined as number | undefined,
    voucherDesconto: "",
    totalBruteValue: 0,
    voucherId: undefined as number | undefined,
    discountType: undefined as string | undefined,
    discountValue: undefined as number | undefined,
  },
});

watch(
  () => show.value,
  async (newValue) => {
    if (newValue) {
      await systemParametersStore.index();
    }
  },
  { immediate: true }
);

const getVoucher = useDebounceFn(async () => {
  if (model.value.voucherDesconto) {
    loadingVoucher.value = true;
    isInvalidvoucher.value = false;
    try {
      await voucherStore.existsInUse(model.value.voucherDesconto);

      if (!$voucher.value) {
        isInvalidvoucher.value = true;
      } else {
        //validar se é um voucher exclusivo para um usuário
        if (
          $voucher.value.userId &&
          $voucher.value.userId !== $currentUser.value?.id
        ) {
          // se o usuário que esta tentando usar o o voucher não é o dono do voucher
          isInvalidvoucher.value = true;
          return;
        }

        if ($voucher.value.voucherUseCount) {
          isInvalidvoucher.value =
            $voucher.value.voucherUseCount >=
            Number($voucher.value.useQuantity ?? 0);

          if (isInvalidvoucher.value) return;
        }

        // se o voucher tem os pacotes específicos e a venda possui um pacote em si
        if ($voucher.value.voucherItems && model.value.packageId) {
          const filter = $voucher.value.voucherItems.find(
            (item) => item.servicePackage?.id === model.value.packageId
          );

          isInvalidvoucher.value = !filter;

          if (isInvalidvoucher.value) {
            return;
          }
        }

        if (
          $voucher.value.voucherUsePersonalizedSale &&
          !model.value.packageId
        ) {
          isInvalidvoucher.value = model.value.packageId !== undefined; //as se exisitir um pacote, o voucher não pode ser usado em vendas sob demanda

          if (isInvalidvoucher.value) {
            return;
          }
        } else if (
          !$voucher.value.voucherUsePersonalizedSale &&
          !model.value.packageId
        ) {
          //não esta liberado para venda avulsa não tem pacote id
          isInvalidvoucher.value = true;
          return;
        }
      }
      await paymentSimulation();
      calculateDiscount();
    } finally {
      loadingVoucher.value = false;
    }
  } else {
    model.value.discount = undefined;
  }
}, 500);

const calculateDiscount = () => {
  model.value.discount = 0;
  if ($voucher.value) {
    model.value.voucherId = $voucher.value.id;
    model.value.discountType = $voucher.value.discountType;
    model.value.discountValue = Number($voucher.value.discount ?? 0);

    //calcular o valor total com desconto
    if ($voucher.value.discountType === "percentage") {
      model.value.discount =
        (model.value.itemValue * Number($voucher.value.discount ?? 0)) / 100;
    } else {
      model.value.discount = Number($voucher.value.discount ?? 0);
    }
  }
};

const handlePaymentForm = async () => {
  model.value.installmentCount = 1;
  await paymentSimulation();
};

const paymentSimulation = async () => {
  loading.value = true;
  try {
    //primeira consulta para retornar a taxa
    await asaas.paymentSimulation({
      value: model.value.itemValue,
      installmentCount: model.value.installmentCount,
      billingType: model.value.paymentForm,
    });

    //calcular a taxa reversa
    if (model.value.installmentCount && model.value.installmentCount > 1) {
      const totalAntecipationFee =
        Number($systemParameters.value?.cardFeeInstallment ?? 0) *
        Number(model.value.installmentCount);

      const feePercentage =
        Number($paymentSimulation.value?.creditCard?.feePercentage ?? 0) +
        totalAntecipationFee;

      model.value.totalBruteValue = Number(
        (
          (Number(model.value.itemValue ?? 0) +
            Number($paymentSimulation.value?.creditCard?.operationFee ?? 0)) /
          (1 - feePercentage / 100)
        ).toFixed(2)
      );
    } else {
      model.value.totalBruteValue = model.value.itemValue;
    }

    model.value.totalValue = model.value.totalBruteValue;

    //segunda consulta para retornar o valor final com total atualizado
    await asaas.paymentSimulation({
      value: model.value.totalValue,
      installmentCount: model.value.installmentCount,
      billingType: model.value.paymentForm,
    });

    calculateDiscount();

    //evitar valor de desconto maior que o valor total
    if (
      Number(model.value.discount ?? 0) < Number(model.value.totalValue ?? 0)
    ) {
      model.value.totalValue =
        Number(model.value.totalValue ?? 0) - Number(model.value.discount ?? 0);
    }
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  loading.value = false;
  isInvalidvoucher.value = false;
  show.value = false;
  voucherStore.clear();
  asaas.clear();
  model.value = {
    name: "",
    description: "",
    dueDays: undefined,
    paymentForm: "CREDIT_CARD",
    discount: 0,
    installmentCount: undefined,
    itemValue: 0,
    totalValue: undefined,
    category: "",
    packageId: undefined,
    solicitationId: undefined,
    voucherId: undefined,
    voucherDesconto: "",
    totalBruteValue: 0,
  };
  emit("cancel");
};

const handleConfirm = () => {
  loading.value = false;
  isInvalidvoucher.value = false;
  show.value = false;
  voucherStore.clear();
  asaas.clear();
  emit("confirm-sale", model.value);
};
</script>
