<template>
  <Dialog
    title="CONFIRME"
    :dialog="show"
    @cancel="$emit('cancel')"
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
    <v-divider class="mb-4"></v-divider>
    <strong>Totais</strong>
    <div class="d-flex" style="gap: 0.5rem">
      <strong>Valor:</strong>
      <strong>{{ amountFormated(model.totalValue ?? 0, false) }}</strong>
    </div>
    <div class="d-flex" style="gap: 0.5rem">
      <strong>Parcelas:</strong>
      <div class="d-flex">
        <strong>{{ model.installmentCount }}</strong>
        <strong class="ml-1 mr-1">x</strong>
        <strong>
          {{
            model.installmentCount
              ? amountFormated(
                  Number(model.totalValue ?? 0) / model.installmentCount,
                  false
                )
              : Number(model.totalValue ?? 0)
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
    <DialogLoading :dialog="loading" />
  </Dialog>
</template>

<script setup lang="ts">
import { AssasPreCheckoutProps } from "@/types/assaas/Precheckout";

const { amountFormated } = useUtils();
const asaas = useAsaasStore();

const loading = ref(false);
const show = defineModel("show", { default: false });

defineEmits(["confirm-sale", "cancel"]);

const $paymentSimulation = computed(() => asaas.$paymentSimulation);

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
    discount: "",
    installmentCount: undefined as number | undefined,
    itemValue: undefined as number | undefined,
    totalValue: undefined as number | undefined,
    category: "",
    packageId: undefined as number | undefined,
    solicitationId: undefined as number | undefined,
  },
});

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
      model.value.totalValue = Number(
        (
          (Number(model.value.itemValue ?? 0) +
            Number($paymentSimulation.value?.creditCard?.operationFee ?? 0)) /
          (1 -
            Number($paymentSimulation.value?.creditCard?.feePercentage ?? 0) /
              100)
        ).toFixed(2)
      );
    } else {
      model.value.totalValue = model.value.itemValue;
    }

    //segunda consulta para retornar o valor final com total atualizado
    await asaas.paymentSimulation({
      value: model.value.totalValue,
      installmentCount: model.value.installmentCount,
      billingType: model.value.paymentForm,
    });
  } finally {
    loading.value = false;
  }
};
</script>
