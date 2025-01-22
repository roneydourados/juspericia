<template>
  <DialogForm
    :show="show"
    title="Saldo em créditos"
    :width="mobile ? '' : '800'"
    @dialog="show = false"
  >
    <v-row dense class="mb-8">
      <v-col cols="12" lg="6">
        <v-card flat elevation="0" rounded="lg">
          <v-card-title class="text-subtitle-2"> Saldo Créditos </v-card-title>
          <v-card-text class="d-flex align-center justify-space-between">
            <v-icon icon="mdi-cash-100" size="25" color="success" />
            <div class="d-flex">
              <span class="text-grey-darken-1" style="font-size: 1.2rem">
                R$
              </span>
              <span class="font-weight-bold ml-2" style="font-size: 1.2rem">
                {{ amountFormated($totals.total, false) }}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card flat elevation="0" rounded="lg">
          <v-card-title class="text-subtitle-2"> Saldo futuro </v-card-title>
          <v-card-text class="d-flex align-center justify-space-between">
            <v-icon icon="mdi-currency-usd" size="25" color="info" />
            <div class="d-flex">
              <span class="text-grey-darken-1" style="font-size: 1.2rem">
                R$
              </span>
              <span class="font-weight-bold ml-2" style="font-size: 1.2rem">
                {{ amountFormated($totals.total - totalSale, false) }}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-divider :thickness="2"></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center" style="gap: 0.5rem">
          <span class="text-h6">Total utilizar: </span>
          <span class="text-h6 font-weight-bold">
            {{ amountFormated(totalSale, false) }}
          </span>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        class="d-flex align-center justify-end"
        style="gap: 0.5rem"
      >
        <v-btn
          color="success"
          variant="elevated"
          class="text-none"
          @click="confirm = true"
        >
          Usar saldo em créditos
        </v-btn>
      </v-col>
    </v-row>

    <Dialog
      title="Confirmar utilização de crédito"
      :dialog="confirm"
      @cancel="confirm = false"
      @confirm="handleSubmit"
      show-cancel
    >
      <div class="d-flex flex-column">
        <span>
          confirma o pagamento de solicitação de consulta no valor de:
        </span>
        <strong>{{ amountFormated(totalSale, true) }} ?</strong>
      </div>
    </Dialog>
  </DialogForm>
</template>

<script setup lang="ts">
import moment from "moment";
import { useDisplay } from "vuetify";

const props = defineProps({
  totalSale: {
    type: Number,
    default: 0,
  },
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => {},
  },
});

const { mobile } = useDisplay();
const { amountFormated } = useUtils();
const saltCredit = useUserCreditSaltStore();

const confirm = ref(false);
const show = defineModel({
  default: false,
});

const $totals = computed(() => {
  const currentDate = moment();
  return {
    total: saltCredit.$all.reduce(
      (acc, item) =>
        !moment(item.expiredAt).isBefore(currentDate)
          ? acc + Number(item.salt ?? 0)
          : acc,
      0
    ),
    totalExpired: saltCredit.$all.reduce(
      (acc, item) =>
        moment(item.expiredAt).isBefore(currentDate)
          ? acc + Number(item.salt ?? 0)
          : acc,
      0
    ),
    totalPending: saltCredit.$all.reduce(
      (acc, item) =>
        item.status === "PENDING" ? acc + Number(item.value) : acc,
      0
    ),
  };
});

watch(
  () => show.value,
  async (value) => {
    if (value) {
      const initialDate = moment().startOf("month").format("YYYY-MM-DD");
      const finalDate = moment().endOf("month").format("YYYY-MM-DD");

      await saltCredit.index({ initialDate, finalDate });
    }
  }
);

const handleSubmit = async () => {
  show.value = false;
  confirm.value = false;
};
</script>
