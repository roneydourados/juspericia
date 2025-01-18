1
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

    <v-img
      height="250"
      src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      cover
    ></v-img>

    <v-card-item>
      <v-card-title>
        <v-icon color="error" icon="mdi-fire-circle" size="small"></v-icon>

        {{ item.name }}
      </v-card-title>
    </v-card-item>

    <v-card-text>
      <div>
        {{ item.description }}
      </div>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-title>Preço</v-card-title>

    <div class="px-4 mb-2">
      <v-chip color="deep-purple-lighten-2" label>
        <strong style="font-size: 1rem">
          R$ {{ amountFormated(item.value ?? 0, false) }}
        </strong>
      </v-chip>
    </div>

    <v-card-actions>
      <v-btn
        color="deep-purple-lighten-2"
        text="Comprar"
        block
        variant="flat"
        @click="showSale = true"
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
      <span>confirma a compra de {{ item.name }} ? </span>
      Valor: <strong>{{ amountFormated(item.value ?? 0, false) }}</strong>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import moment from "moment";

const props = defineProps({
  item: {
    type: Object as PropType<ServicePackagesProps>,
    required: true,
  },
});

const { amountFormated } = useUtils();
const asaas = useAsaasStore();

const loading = ref(false);
const showSale = ref(false);

const $paymentResponse = computed(() => asaas.$paymentReponse);

const handleSaleItem = async () => {
  showSale.value = false;
  loading.value = true;
  try {
    if (!props.item) {
      push.warning("Selecione um item para comprar");
    }

    await asaas.createPayment({
      dueDate: moment().add(3, "days").format("YYYY-MM-DD"),
      value: props.item.value!,
      description: props.item.name!,
    });

    if ($paymentResponse.value?.data?.invoiceUrl) {
      //window.open($paymentResponse.value?.data?.invoiceUrl);

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
    console.log("🚀 ~ handleSaleItem ~ error:", error);
  } finally {
    loading.value = false;
  }
};
</script>
