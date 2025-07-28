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
          <v-card-text class="d-flex align-center">
            <v-icon icon="mdi-cash-100" size="25" color="success" />
            <span class="font-weight-bold ml-2" style="font-size: 1.2rem">
              {{ amountFormated($totals?.total ?? 0, false) }}
            </span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card flat elevation="0" rounded="lg">
          <v-card-title class="text-subtitle-2"> Saldo futuro </v-card-title>
          <v-card-text class="d-flex align-center">
            <v-icon icon="mdi-currency-usd" size="25" color="info" />
            <span class="font-weight-bold ml-2" style="font-size: 1.2rem">
              {{
                amountFormated(
                  Number($totals?.total ?? 0) -
                    Number($solicitationTotalPaidSalt),
                  false
                )
              }}
            </span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-divider :thickness="2"></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="4">
        <InfoLabel
          icon="mdi-plus"
          font-size="1"
          color-icon="info"
          title="Valor original"
          :content="`${amountFormated(
            solicitation.consultationValue ?? 0,
            true
          )}`"
          color="error"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          icon="mdi-minus"
          color-icon="success"
          title="Desconto"
          font-size="1"
          :content="`${amountFormated(
            Number(solicitation.consultationValue ?? 0) -
              Number(solicitation.valueCredit ?? 0),
            true
          )}`"
          color="success"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          icon="mdi-equal"
          color-icon="info"
          title="Valor a debitar do saldo"
          font-size="1"
          :content="`${amountFormated($solicitationTotalPaidSalt, true)}`"
          color="success"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        class="d-flex align-center justify-end"
        style="gap: 0.5rem"
      >
        <v-btn
          prepend-icon="mdi-cash"
          color="primary"
          variant="flat"
          class="text-none"
          @click="handleUseSalt"
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
  show.value = false;
  confirm.value = false;
  loading.value = true;
  try {
    const filters = {
      status: "open",
      initialDateSolicitation: dayjs().startOf("year").format("YYYY-MM-DD"),
      finalDateSolicitation: dayjs().endOf("year").format("YYYY-MM-DD"),
      benefitType: undefined as BenefitTypeProps | undefined,
      patient: undefined as PatientProps | undefined,
      reportPurpose: undefined as ReportPurposeProps | undefined,
    } as SolicitationConsultationFilterProps;

    await solicitationStore.paidUseSalt(props.solicitation);
    await solicitationStore.index(filters);
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
</script>
