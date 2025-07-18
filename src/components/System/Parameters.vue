<template>
  <v-card flat>
    <v-card-text class="pa-4">
      <FormCrud :show-submit-button="false" :on-submit="handleSubmit">
        <div
          class="d-flex flex-wrap align-center justify-space-between pa-4 w-100"
        >
          <div class="d-flex flex-wrap align-center">
            <v-icon icon="mdi-cog-outline" color="#3F51B5" size="30" start />
            <span class="text-h6"> Parametrizações </span>
          </div>
          <div class="d-flex flex-wrap align-center" style="gap: 1rem">
            <v-btn
              variant="flat"
              color="info"
              class="text-none"
              size="small"
              @click="router.back()"
            >
              <v-icon icon="mdi-arrow-left"> </v-icon>
              Voltar
            </v-btn>

            <v-btn
              color="primary"
              variant="flat"
              size="small"
              type="submit"
              :disabled="loading"
              class="text-none"
            >
              <div v-if="!loading" class="d-flex align-center">
                <v-icon icon="mdi-check" />
                <span style="font-size: 0.9rem" class="ml-2"> Salvar </span>
              </div>
            </v-btn>
          </div>
        </div>

        <v-row>
          <v-col cols="12" lg="4">
            <v-card flat rounded="lg" elevation="1" height="100%">
              <v-card-title>
                <div class="font-weight-bold">Pontos por indicação</div>
                <v-divider class="mt-2"></v-divider>
              </v-card-title>
              <v-card-text class="py-4">
                <v-row dense>
                  <v-col cols="12" lg="6">
                    <IntegerInput
                      label="Qtde por indicação"
                      v-model="form.pointsPerIndication"
                    />
                  </v-col>
                  <v-col cols="12" lg="6">
                    <IntegerInput
                      label="A cada"
                      v-model="form.pointsExchange"
                    />
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <div class="d-flex align-center" style="gap: 0.5rem">
                      <CurrencyInput
                        label="Vale R$"
                        v-model="form.pointsExchangeValue"
                      />
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <IntegerInput
                      label="Expiração em dias"
                      v-model="form.daysPointsExpire"
                    />
                  </v-col>
                </v-row>
                <div>
                  Configuração de pontos por indicação e troca de pontos por
                  créditos. A cada indicação usuário ganha

                  <strong> {{ form.pointsPerIndication }} </strong>
                  pontos e a cada
                  <strong> {{ form.pointsExchange }} </strong> pontos ganha
                  <strong>
                    {{ amountFormated(Number(form.pointsExchangeValue), true) }}
                  </strong>
                  de crédito ao efetuar a troca. Pontos expiram em
                  <strong> {{ form.daysPointsExpire }} dias </strong>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- <v-col cols="12" lg="4">
            <v-card flat rounded="lg" elevation="1" height="100%">
              <v-card-title>
                <div class="font-weight-bold">Valor comissão médica padrão</div>
                <v-divider class="mt-2"></v-divider>
              </v-card-title>
              <v-card-text class="py-4">
                <CurrencyInput
                  label="Valor R$"
                  v-model="form.comission"
                  required
                />
                <div>
                  Valor padrão da comissão médica será de
                  <strong>{{
                    amountFormated(Number(form.comission), true)
                  }}</strong>
                  para consultas realizadas. Este valor será preenchido
                  automaticamente no cadastro de médicos, porém será possível
                  alterar, pois cada médico pode receber valor de comissão
                  diferente.
                </div>
              </v-card-text>
            </v-card>
          </v-col> -->
          <v-col cols="12" lg="4">
            <v-card flat rounded="lg" elevation="1" height="100%">
              <v-card-title>
                <div class="font-weight-bold">
                  Prazo em dias para expirar créditos
                </div>
                <v-divider class="mt-2"></v-divider>
              </v-card-title>
              <v-card-text class="py-4">
                <IntegerInput
                  label="Crédito expira em dias"
                  v-model="form.daysCreditExpire"
                />
                <div>
                  Os créditos que os advogados adquirir pela plataforma vão
                  expirar em
                  <strong>{{ form.daysCreditExpire }} dias</strong>
                </div>
                <div class="font-weight-bold mt-8">
                  Horário geral de atendimento dos médicos
                </div>
                <v-divider class="mt-2"></v-divider>
                <div class="d-flex flex-column align-center px-12">
                  <div
                    class="d-flex flex-wrap align-center mt-4 w-100"
                    style="gap: 0.5rem"
                  >
                    <TimeInput
                      label="Início"
                      v-model="form.hourInitial"
                      required
                    />
                    <TimeInput label="Fim" v-model="form.hourFinal" required />
                  </div>
                  <div class="w-100">
                    <IntegerInput
                      label="Intervalo entre consultas (minutos)"
                      v-model="form.medicQueryInterval"
                      required
                    />
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="4">
            <v-card flat rounded="lg" elevation="1" height="100%">
              <v-card-title>
                <div class="font-weight-bold">Whatsapp do suporte</div>
                <v-divider class="mt-2"></v-divider>
              </v-card-title>
              <v-card-text class="py-4">
                <TelefoneInput
                  label="Whatsapp"
                  v-model="form.suportWhatsapp"
                  required
                  icon="mdi-whatsapp"
                />
                <div>
                  Aqui o número de telefone que será utilizado para chamadas de
                  suporte via whatsapp, quando usuário clicar em suporte sistema
                  vai efetuar algumas perguntas padrão e redirecionar para
                  whatsapp web usando este número.
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="4">
            <v-card flat rounded="lg" elevation="1" height="100%">
              <v-card-title>
                <div class="font-weight-bold">Parametrizações de voucher</div>
                <v-divider class="mt-2"></v-divider>
              </v-card-title>
              <v-card-text class="py-4">
                <v-row dense>
                  <v-col cols="12" lg="6">
                    <CurrencyInput
                      label="Desconto máximo em (%)"
                      v-model="form.voucherMaxDiscountPercentage"
                    />
                  </v-col>
                  <v-col cols="12" lg="6">
                    <CurrencyInput
                      label="Desconto máximo em R$"
                      v-model="form.voucherMaxDiscountValue"
                    />
                  </v-col>
                  <v-col cols="12" lg="6">
                    <IntegerInput
                      label="Voucher pode ser usado quantas vezes"
                      v-model="form.voucherMaxQuantityUse"
                    />
                  </v-col>
                  <v-col cols="12" lg="6">
                    <IntegerInput
                      label="Voucher vale por quantos dias"
                      v-model="form.voucherMaxQuantityDays"
                    />
                  </v-col>
                </v-row>
                <div>
                  Definição de limites para os vouchers que serão gerados
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="4">
            <v-card flat rounded="lg" elevation="1" height="100%">
              <v-card-title>
                <div class="font-weight-bold">Taxas de antecipações</div>
                <v-divider class="mt-2"></v-divider>
              </v-card-title>
              <v-card-text class="py-4">
                <v-row dense>
                  <v-col cols="12" lg="6">
                    <CurrencyInput
                      label="Taxa cartão de crédito parcelado (%)"
                      v-model="form.cardFeeInstallment"
                    />
                  </v-col>
                </v-row>
                <div>
                  Valor a ser embutido de taxa de antecipação para pagamentos
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4">
            <v-card flat rounded="lg" elevation="1" height="100%">
              <v-card-title>
                <div class="font-weight-bold">Solicitações de consulta</div>
                <v-divider class="mt-2"></v-divider>
              </v-card-title>
              <v-card-text class="py-4">
                <v-row dense>
                  <v-col cols="12" lg="6">
                    <IntegerInput
                      label="Qtde de correções por consulta"
                      v-model="form.solicitationCorrectionQuantity"
                    />
                  </v-col>
                </v-row>
                <div>
                  Quantidade máxia e vezes que o advogado pode solicitar uma
                  correção por consulta
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </FormCrud>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object as PropType<SystemParametersProps>,
    default: undefined,
  },
});
const router = useRouter();
const { amountFormated } = useUtils();
const systemParametersStore = useSystemParametersStore();

const loading = ref(false);

const form = ref({
  pointsPerIndication: "",
  pointsExchange: "",
  pointsExchangeValue: "",
  daysPointsExpire: "",
  comission: "",
  daysCreditExpire: "",
  suportWhatsapp: "",
  hourInitial: "",
  hourFinal: "",
  medicQueryInterval: "15",
  voucherMaxDiscountPercentage: "",
  voucherMaxDiscountValue: "",
  voucherMaxQuantityUse: "",
  voucherMaxQuantityDays: "",
  cardFeeInstallment: "",
  solicitationCorrectionQuantity: "",
});

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      form.value = {
        pointsPerIndication: newData.pointsPerIndication?.toString() ?? "",
        solicitationCorrectionQuantity:
          newData.solicitationCorrectionQuantity?.toString() ?? "",
        pointsExchange: newData.pointsExchange?.toString() ?? "",
        pointsExchangeValue: amountFormated(
          newData.pointsExchangeValue ?? 0,
          false
        ),
        daysPointsExpire: newData.daysPointsExpire?.toString() ?? "",
        comission: amountFormated(newData.comission ?? 0, false),
        daysCreditExpire: newData.daysCreditExpire?.toString() ?? "",
        suportWhatsapp: newData.suportWhatsapp ?? "",
        hourInitial: newData.hourInitial ?? "",
        hourFinal: newData.hourFinal ?? "",
        medicQueryInterval: newData.medicQueryInterval?.toString() ?? "",
        voucherMaxDiscountPercentage: amountFormated(
          newData.voucherMaxDiscountPercentage ?? 0,
          false
        ),
        voucherMaxDiscountValue: amountFormated(
          newData.voucherMaxDiscountValue ?? 0,
          false
        ),
        voucherMaxQuantityUse: newData.voucherMaxQuantityUse?.toString() ?? "",
        voucherMaxQuantityDays:
          newData.voucherMaxQuantityDays?.toString() ?? "",
        cardFeeInstallment: amountFormated(
          newData.cardFeeInstallment ?? 0,
          false
        ),
      };
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  loading.value = true;
  try {
    await systemParametersStore.update({
      ...form.value,
      publicId: props.data!.publicId,
      pointsPerIndication: Number(form.value.pointsPerIndication ?? "0"),
      pointsExchange: Number(form.value.pointsExchange ?? "0"),
      pointsExchangeValue: Number(form.value.pointsExchangeValue ?? "0"),
      daysPointsExpire: Number(form.value.daysPointsExpire ?? "0"),
      comission: Number(form.value.comission ?? "0"),
      daysCreditExpire: Number(form.value.daysCreditExpire ?? "0"),
      medicQueryInterval: Number(form.value.medicQueryInterval ?? "15"),
      voucherMaxDiscountPercentage: Number(
        form.value.voucherMaxDiscountPercentage ?? "0"
      ),
      voucherMaxDiscountValue: Number(
        form.value.voucherMaxDiscountValue ?? "0"
      ),
      voucherMaxQuantityUse: Number(form.value.voucherMaxQuantityUse ?? "0"),
      voucherMaxQuantityDays: Number(form.value.voucherMaxQuantityDays ?? "0"),
      cardFeeInstallment: Number(form.value.cardFeeInstallment ?? "0"),
      solicitationCorrectionQuantity: Number(
        form.value.solicitationCorrectionQuantity ?? "0"
      ),
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
