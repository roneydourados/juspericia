<template>
  <Dialog
    title="CONFIRME"
    :dialog="show"
    @cancel="handleCancel"
    @confirm="$emit('confirm-sale', model)"
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
        <v-btn
          size="small"
          variant="flat"
          color="success"
          class="text-none ml-2"
          @click="getVoucher"
          :disabled="$disableVoucher"
        >
          Aplicar
        </v-btn>
      </v-col>
      <v-col v-if="$voucher" cols="12" class="mt-n6">
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
    <div class="d-flex justify-space-between" style="gap: 0.5rem">
      <strong>Desconto:</strong>
      <strong>{{ amountFormated(model.discount ?? 0, false) }}</strong>
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
    <DialogLoading :dialog="loading" />
  </Dialog>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { AssasPreCheckoutProps } from "@/types/assaas/Precheckout";

const { amountFormated } = useUtils();
const asaas = useAsaasStore();
const voucherStore = useVoucherStore();
const systemParametersStore = useSystemParametersStore();

const loading = ref(false);
const loadingVoucher = ref(false);
const isInvalidvoucher = ref(false);
const show = defineModel("show", { default: false });

const emit = defineEmits(["confirm-sale", "cancel"]);

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
      // const feePercentage =
      //   Number($paymentSimulation.value?.creditCard?.feePercentage ?? 0) +
      //   Number($systemParameters.value?.cardFeeInstallment ?? 0);

      // model.value.totalBruteValue = Number(
      //   (
      //     (Number(model.value.itemValue ?? 0) +
      //       Number($paymentSimulation.value?.creditCard?.operationFee ?? 0)) /
      //     (1 - feePercentage / 100)
      //   ).toFixed(2)
      // );
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

    model.value.totalValue =
      Number(model.value.totalValue ?? 0) - Number(model.value.discount ?? 0);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  loading.value = false;
  isInvalidvoucher.value = false;
  show.value = false;
  emit("cancel");
};
</script>
