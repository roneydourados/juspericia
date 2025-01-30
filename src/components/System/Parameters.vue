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
          <v-col cols="12" lg="4">
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
          </v-col>
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
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </FormCrud>
    </v-card-text>
  </v-card>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
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
});

const $parameters = computed(() => systemParametersStore.$parameters);

onMounted(() => {
  form.value = {
    pointsPerIndication:
      $parameters.value?.pointsPerIndication?.toString() ?? "",
    pointsExchange: $parameters.value?.pointsExchange?.toString() ?? "",
    pointsExchangeValue: amountFormated(
      $parameters.value?.pointsExchangeValue ?? 0,
      false
    ),
    daysPointsExpire: $parameters.value?.daysPointsExpire?.toString() ?? "",
    comission: amountFormated($parameters.value?.comission ?? 0, false),
    daysCreditExpire: $parameters.value?.daysCreditExpire?.toString() ?? "",
  };
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    await systemParametersStore.update({
      ...form.value,
      publicId: $parameters.value!.publicId,
      pointsPerIndication: Number(form.value.pointsPerIndication),
      pointsExchange: Number(form.value.pointsExchange),
      pointsExchangeValue: Number(form.value.pointsExchangeValue),
      daysPointsExpire: Number(form.value.daysPointsExpire),
      comission: Number(form.value.comission),
      daysCreditExpire: Number(form.value.daysCreditExpire),
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
