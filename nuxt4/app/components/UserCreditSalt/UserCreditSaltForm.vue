<template>
  <DialogForm
    :show="show"
    title="Saldo em créditos"
    :width="mobile ? '' : '800'"
    @dialog="handleClose"
    border-color="#c8e040"
  >
    <v-row class="mb-8 px-4">
      <v-col
        cols="12"
        lg="6"
        class="d-flex text-primary align-center"
        style="gap: 0.5rem"
      >
        <span style="font-weight: 500">Saldo Créditos</span>
        <v-icon icon="mdi-currency-usd" color="colorIcon" />
        <span class="font-weight-bold text-primary" style="font-size: 1.2rem">
          {{ amountFormated($totals?.total ?? 0, false) }}
        </span>
      </v-col>
      <v-col
        cols="12"
        lg="6"
        class="d-flex text-primary align-center"
        style="gap: 0.5rem"
      >
        <span style="font-weight: 500">Saldo Futuro</span>
        <v-icon icon="mdi-currency-usd" color="info" />
        <span class="font-weight-bold text-primary" style="font-size: 1.2rem">
          {{
            amountFormated(
              Number($totals?.total ?? 0) - Number($solicitationTotalPaidSalt),
              false
            )
          }}
        </span>
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
    </v-row>
    <v-row class="mb-8 px-4">
      <v-col cols="12" lg="4" class="d-flex text-primary flex-column">
        <div class="d-flex align-center">
          <v-icon icon="mdi-plus" start />
          <span style="font-weight: 500">Valor original</span>
        </div>
        <div class="text-primary font-weight-bold" style="font-size: 1.5rem">
          {{ amountFormated(solicitation.consultationValue ?? 0, true) }}
        </div>
      </v-col>
      <v-col cols="12" lg="4" class="d-flex text-primary flex-column">
        <div class="d-flex align-center">
          <v-icon icon="mdi-minus" start />
          <span style="font-weight: 500">Desconto</span>
        </div>
        <div class="text-primary font-weight-bold" style="font-size: 1.5rem">
          {{
            amountFormated(
              Number(solicitation.consultationValue ?? 0) -
                Number(solicitation.valueCredit ?? 0),
              true
            )
          }}
        </div>
      </v-col>
      <v-col cols="12" lg="4" class="d-flex text-primary flex-column">
        <div class="d-flex align-center">
          <v-icon icon="mdi-equal" start />
          <span style="font-weight: 500">Valor a debitar do saldo</span>
        </div>
        <div class="text-primary font-weight-bold" style="font-size: 1.5rem">
          {{ amountFormated($solicitationTotalPaidSalt, true) }}
        </div>
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
    </v-row>
    <v-row class="pa-4">
      <v-col
        cols="12"
        class="d-flex align-center justify-center"
        style="gap: 0.5rem"
      >
        <Button
          color="primary"
          variant="flat"
          class="text-none"
          @click="handleUseSalt"
        >
          Usar saldo em créditos
        </Button>
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
        <strong>
          {{ amountFormated($solicitationTotalPaidSalt, true) }} ?
        </strong>
      </div>
    </Dialog>
    <DialogLoading :dialog="loading" />
  </DialogForm>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";

const props = defineProps({
  solicitation: {
    type: Object as PropType<SolicitationConsultationProps>,
    default: () => {},
  },
});

const emit = defineEmits(["close"]);

const { mobile } = useDisplay();
const { amountFormated } = useUtils();
const saltCredit = useUserCreditSaltStore();
const solicitationStore = useSolicitationConsultationStore();

const confirm = ref(false);
const loading = ref(false);
const show = defineModel({
  default: false,
});

const $solicitationTotalPaidSalt = computed(() => {
  return (
    Number(props.solicitation.valueCredit ?? 0) +
    Number(props.solicitation.antecipationValue ?? 0)
  );
});

const $totals = computed(() => {
  return saltCredit.$credits?.totals;
});

const handleSubmit = async () => {
  confirm.value = false;
  loading.value = true;
  try {
    await solicitationStore.paidUseSalt(props.solicitation.publicId!);
    handleClose();
  } catch (error) {
    push.error("Erro ao realizar pagamento");
  } finally {
    loading.value = false;
  }
};

const handleUseSalt = () => {
  if ($solicitationTotalPaidSalt.value > Number($totals.value?.total ?? 0)) {
    return push.error("Saldo insuficiente para pagamento");
  }
  confirm.value = true;
};

const handleClose = () => {
  show.value = false;
  emit("close");
};
</script>
