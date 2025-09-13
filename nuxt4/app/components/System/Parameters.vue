<template>
  <v-card flat color="transparent">
    <v-card-text class="pa-4">
      <FormCrud :show-submit-button="false" :on-submit="handleSubmit">
        <div
          class="d-flex flex-wrap align-center justify-space-between pa-4 w-100"
        >
          <div class="d-flex flex-wrap align-center" style="gap: 0.5rem">
            <HeaderPage title="Parametrizações" font-size="1.8rem" />
          </div>
          <div class="d-flex flex-wrap align-center" style="gap: 1rem">
            <Button
              variant="outlined"
              color="grey"
              class="text-none"
              size="small"
              @click="router.back()"
            >
              <v-icon icon="mdi-arrow-left" start color="darkText" />
              <span class="text-caption text-darkText"> Voltar </span>
            </Button>
            <Button
              color="primary"
              type="submit"
              size="small"
              :disabled="loading"
            >
              <v-icon icon="mdi-check" start color="colorIcon" />
              <span class="text-caption"> Salvar </span>
            </Button>
          </div>
        </div>
        <v-row>
          <v-col cols="12" lg="4">
            <v-card rounded="xl" height="100%" variant="flat">
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
            <v-card rounded="xl" height="100%" variant="flat">
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
          </v-col> -->
          <v-col cols="12" lg="4">
            <v-card rounded="xl" variant="flat">
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

            <v-card rounded="xl" variant="flat">
              <v-card-title>
                <div class="font-weight-bold">
                  Limites para solicitar revisão de laudo
                </div>
                <v-divider class="mt-2"></v-divider>
              </v-card-title>
              <v-card-text class="py-4">
                <v-row dense>
                  <v-col cols="12" lg="6">
                    <IntegerInput
                      label="Quantidade máxima de dias"
                      v-model="form.medicalReportRevisionMaxDays"
                    />
                  </v-col>
                  <v-col cols="12" lg="6">
                    <IntegerInput
                      label="Quantidade de revisões"
                      v-model="form.medicalReportRevisionMaxCount"
                    />
                  </v-col>
                </v-row>

                <div>
                  Defina quantidade máxima em dias que o advogado pode solicitar
                  uma revisão de laudo e a quantiadade de vezes que isso será
                  permitido.
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="4">
            <v-card rounded="xl" height="100%" variant="flat">
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
                <div class="w-100 mt-4">
                  <IntegerInput
                    label="Intervalo entre consultas (minutos)"
                    v-model="form.medicQueryInterval"
                    required
                  />
                </div>
                <div>Intervalo em minutos entre as consultas médicas</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="4" class="d-flex flex-column">
            <v-card rounded="xl" height="100%" variant="flat">
              <v-card-title>
                <div class="font-weight-bold">Taxas de antecipações</div>
                <v-divider class="mt-2"></v-divider>
              </v-card-title>
              <v-card-text class="py-4">
                <v-row dense>
                  <v-col cols="12" lg="8">
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

            <v-card rounded="xl" height="100%" variant="flat">
              <v-card-title>
                <div class="font-weight-bold">%Saldo mínimo de crédito</div>
                <v-divider class="mt-2"></v-divider>
              </v-card-title>
              <v-card-text class="py-4">
                <v-row dense>
                  <v-col cols="12" lg="8">
                    <CurrencyInput
                      label="%Saldo mínimo de crédito"
                      v-model="form.minValueSaltCredits"
                    />
                  </v-col>
                </v-row>
                <div class="py-8">
                  Parametrize um valor mínimo de saldo de crédito que um cliente
                  deve possuir, para que seja automaticamente gerada uma nova
                  oportunidade de venda no CRM.
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="4" class="d-flex flex-column">
            <v-card rounded="xl" height="100%" variant="flat">
              <v-card-title>
                <div class="font-weight-bold">Especialidade padrão</div>
                <v-divider class="mt-2"></v-divider>
              </v-card-title>
              <v-card-text class="py-4">
                <v-row dense>
                  <v-col cols="12">
                    <SelectSearchMedicalSpecialty
                      v-model="form.medicalSpecialty"
                    />
                  </v-col>
                </v-row>
                <div>
                  Especialidade médica padrão a ser considerada quando criada
                  uma nova solicitação
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="4">
            <v-card rounded="xl" height="100%" variant="flat">
              <v-card-title>
                <div class="font-weight-bold">Token de integração com CRM</div>
                <v-divider class="mt-2"></v-divider>
              </v-card-title>
              <v-card-text class="py-4">
                <v-row dense>
                  <v-col cols="12">
                    <StringInput label="Nome CRM" v-model="form.crmTokenName" />
                  </v-col>
                  <v-col cols="12">
                    <TextInput label="Token" v-model="form.crmToken" rows="8" />
                  </v-col>
                  <v-col cols="12">
                    <strong
                      >Expira em:
                      {{
                        dayjs(form.crmTokenExpiration).format(
                          "DD/MM/YYYY HH:mm:ss"
                        )
                      }}</strong
                    >
                  </v-col>
                </v-row>
                <div class="mt-4">
                  Informe aqui o token gerado no seu sistema de CRM
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
import dayjs from "dayjs";

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
  crmTokenName: "",
  crmToken: "",
  crmTokenExpiration: "",
  minValueSaltCredits: "",
  medicalSpecialty: undefined as MedicalSpecialtyProps | undefined,
  medicalReportRevisionMaxCount: "1",
  medicalReportRevisionMaxDays: "7",
});

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      form.value = {
        pointsPerIndication: newData.pointsPerIndication?.toString() ?? "",
        pointsExchange: newData.pointsExchange?.toString() ?? "",
        pointsExchangeValue: amountFormated(
          Number(newData.pointsExchangeValue ?? 0),
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
        crmTokenName: newData.crmTokenName ?? "",
        crmToken: newData.crmToken ?? "",
        crmTokenExpiration: newData.crmTokenExpiration ?? "",
        minValueSaltCredits: amountFormated(
          newData.minValueSaltCredits ?? 0,
          false
        ),
        medicalSpecialty: newData.medicalSpecialty,
        medicalReportRevisionMaxCount:
          newData.medicalReportRevisionMaxCount?.toString() ?? "",
        medicalReportRevisionMaxDays:
          newData.medicalReportRevisionMaxDays?.toString() ?? "",
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
      crmTokenName: form.value.crmTokenName ?? "",
      crmToken: form.value.crmToken ?? "",
      crmTokenExpiration: form.value.crmTokenExpiration ?? "",
      minValueSaltCredits: Number(form.value.minValueSaltCredits ?? "0"),
      medicalSpecialtyIdDefault: form.value.medicalSpecialty?.id,
      medicalReportRevisionMaxCount: Number(
        form.value.medicalReportRevisionMaxCount ?? "1"
      ),
      medicalReportRevisionMaxDays: Number(
        form.value.medicalReportRevisionMaxDays ?? "7"
      ),
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
