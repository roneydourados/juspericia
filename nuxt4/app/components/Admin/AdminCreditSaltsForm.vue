<template>
  <DialogForm
    :show="show"
    title="Lançar crédito avulso"
    @dialog="handleClose"
    border-color="#c8e040"
    width="40%"
  >
    <FormCrud :on-submit="handleSubmit">
      <v-row dense>
        <v-col cols="12">
          <SelectSearchLawyer v-model="modelForm.lawyer" />
        </v-col>
        <v-col cols="12" lg="6">
          <CurrencyInput label="Valor do crédito" v-model="modelForm.value" />
        </v-col>
        <v-col cols="12" lg="6">
          <CurrencyInput
            label="Valor da solicitação"
            v-model="modelForm.solicitationConsultationValue"
          />
        </v-col>
      </v-row>
    </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
const emit = defineEmits(["close"]);
const userCreditStore = useUserCreditSaltStore();

const show = defineModel({
  default: false,
});

const load = ref(false);

const modelForm = ref({
  lawyer: undefined as UserProps | undefined,
  value: "",
  solicitationConsultationValue: "",
});

const handleClose = () => {
  show.value = false;
  emit("close");
};

const handleSubmit = async () => {
  load.value = true;
  try {
    if (!modelForm.value.lawyer) {
      return;
    }

    await userCreditStore.storeManualCredit({
      userId: modelForm.value.lawyer?.id!,
      value: Number(modelForm.value.value),
      solicitationConsultationValue: Number(
        modelForm.value.solicitationConsultationValue
      ),
    });

    show.value = false;

    modelForm.value = {
      lawyer: undefined,
      value: "",
      solicitationConsultationValue: "",
    };
    emit("close");
  } catch (error) {
    console.log("🚀 ~ handleSubmit ~ error:", error);
  } finally {
    load.value = false;
  }
};
</script>
