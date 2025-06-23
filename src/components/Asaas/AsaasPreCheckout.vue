<template>
  <v-card
    :disabled="loading"
    :loading="loading"
    class="mx-auto my-12"
    max-width="95%"
    rounded="lg"
    elevation="8"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="deep-purple"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img height="250" src="@/assets/images/package.avif" cover></v-img>

    <v-card-item>
      <v-card-title>
        <v-icon color="error" icon="mdi-fire-circle" size="small"></v-icon>

        {{ model.name }}
      </v-card-title>
      <strong>
        Expira em {{ model.dueDays }} dias a contar da data da compra
      </strong>
    </v-card-item>

    <v-card-text>
      <div>
        {{ model.description }}
      </div>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-title>Preço</v-card-title>

    <div class="px-4 mb-2">
      <v-chip color="deep-purple-lighten-2" label>
        <strong style="font-size: 1rem">
          R$ {{ amountFormated(model.itemValue ?? 0, false) }}
        </strong>
      </v-chip>
    </div>

    <v-card-actions>
      <v-btn
        color="deep-purple-lighten-2"
        text="Comprar"
        block
        variant="flat"
        @click="handleSale"
      />
    </v-card-actions>
  </v-card>
  <Dialog
    title="CONFIRME"
    :dialog="showSale"
    @cancel="showSale = false"
    @confirm="handleSaleItem"
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
      <v-col cols="12" lg="9">
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
            amountFormated(
              Number(model.totalValue ?? 0) / model.installmentCount,
              false
            )
          }}
        </strong>
        <span v-if="model.installmentCount > 1" class="ml-2">(Com juros)</span>
        <span v-else class="ml-2">(Sem juros)</span>
      </div>
    </div>
    <!-- <pre>{{ $paymentSimulation }}</pre>
    <pre>{{ model }}</pre> -->
    <DialogLoading :dialog="loading" />
  </Dialog>
</template>

<script setup lang="ts">
import { AssasPreCheckoutProps } from "@/types/assaas/Precheckout";
import dayjs from "dayjs";

const { amountFormated } = useUtils();
const asaas = useAsaasStore();

const loading = ref(false);
const showSale = ref(false);

const $paymentResponse = computed(() => asaas.$paymentReponse);
const $paymentSimulation = computed(() => asaas.$paymentSimulation);

const paymentFormsType = ref([
  { title: "Cartão de crédito", value: "CREDIT_CARD" },
  { title: "Boleto", value: "BOLETO" },
  { title: "Cartão de débito", value: "DEBIT_CARD" },
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
    dueDays: 0,
    paymentForm: "CREDIT_CARD",
    discount: "",
    installmentCount: 1,
    itemValue: 0,
    totalValue: 0,
    category: "",
    packageId: 0,
  },
});

const handleSaleItem = async () => {
  showSale.value = false;
  loading.value = true;
  try {
    if (model.value.installmentCount > 1) {
      //se for parcelada enviar quantidade de parcelas e o valor total
      await asaas.createPayment({
        dueDate: dayjs().add(2, "days").format("YYYY-MM-DD"),
        description: model.value.name,
        category: model.value.category,
        packageId: model.value.packageId,
        dueDays: model.value.dueDays,
        totalValue: model.value.totalValue,
        installmentCount: model.value.installmentCount,
      });
    } else {
      //caso contrário enviar o valor normal
      await asaas.createPayment({
        dueDate: dayjs().add(2, "days").format("YYYY-MM-DD"),
        value: model.value.itemValue,
        description: model.value.name,
        category: model.value.category,
        packageId: model.value.packageId,
        dueDays: model.value.dueDays,
      });
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
  } catch (error) {
    push.error("Erro ao finalizar pagamento");
    console.log("🚀 ~ handleSaleItem ~ error:", error);
  } finally {
    loading.value = false;
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
    if (model.value.installmentCount > 1) {
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

const handleSale = async () => {
  await paymentSimulation();
  showSale.value = true;
};
</script>
