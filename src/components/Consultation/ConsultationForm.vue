<template>
  <DialogForm
    :show="show"
    :title="title"
    :width="mobile ? '' : width"
    @dialog="handleClose"
  >
    <FormCrud :on-submit="handleSubmit">
      <v-row dense>
        <v-col cols="12">
          <StringInput
            v-model="model.consultationName"
            label="Título Consulta"
            required
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="3">
          <CurrencyInput v-model="model.value" label="Preço" required />
        </v-col>
        <v-col cols="12" lg="3">
          <CurrencyInput
            v-model="model.valueCredit"
            label="Preço Crédito"
            required
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="3">
          <CurrencyInput
            v-model="model.valueAntecipation24"
            label="Valor Atencipação 24hrs"
            required
          />
        </v-col>
        <v-col cols="12" lg="3">
          <CurrencyInput
            v-model="model.valueAntecipation48"
            label="Valor Atencipação 48hrs"
            required
          />
        </v-col>
        <v-col cols="12" lg="3">
          <CurrencyInput
            v-model="model.valueAntecipation72"
            label="Valor Atencipação 72hrs"
            required
          />
        </v-col>
      </v-row>
    </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "500",
  },
  data: {
    type: Object as PropType<ConsultationProps>,
    default: () => ({}),
  },
});
const emit = defineEmits(["close"]);

const { mobile } = useDisplay();

const consultationStore = useConsultationStore();

const { amountFormated } = useUtils();

const model = ref({
  id: 0,
  consultationName: "",
  value: "",
  valueCredit: "",
  valueAntecipation24: "",
  valueAntecipation48: "",
  valueAntecipation72: "",
  valuePacket: "0",
});

watchPostEffect(() => {
  if (props.data?.id && props.show) {
    loadModel();
  }
});

onUnmounted(() => {
  clearModel();
});

const loadModel = () => {
  model.value = {
    id: props.data.id!,
    consultationName: props.data.consultationName ?? "",
    value: amountFormated(props.data.value ?? 0, false),
    valueCredit: amountFormated(props.data.valueCredit ?? 0, false),
    valueAntecipation24: amountFormated(
      props.data.valueAntecipation24 ?? 0,
      false
    ),
    valueAntecipation48: amountFormated(
      props.data.valueAntecipation48 ?? 0,
      false
    ),
    valueAntecipation72: amountFormated(
      props.data.valueAntecipation72 ?? 0,
      false
    ),
    valuePacket: amountFormated(props.data.valuePacket ?? 0, false),
  };
};

const clearModel = () => {
  model.value = {
    id: 0,
    consultationName: "",
    value: "",
    valueCredit: "",
    valueAntecipation24: "",
    valueAntecipation48: "",
    valueAntecipation72: "",
    valuePacket: "0",
  };
};

const handleSubmit = async () => {
  try {
    if (model.value.id <= 0) {
      await create();
    } else {
      await update();
    }

    await consultationStore.index("");
    handleClose();
  } catch (error) {
    console.log("🚀 ~ handleSubmit ~ error:", error);
  }
};

const create = async () => {
  await consultationStore.create({
    consultationName: model.value.consultationName,
    value: Number(model.value.value ?? "0"),
    valueCredit: Number(model.value.valueCredit ?? "0"),
    valueAntecipation24: Number(model.value.valueAntecipation24 ?? "0"),
    valueAntecipation48: Number(model.value.valueAntecipation48 ?? "0"),
    valueAntecipation72: Number(model.value.valueAntecipation72 ?? "0"),
    valuePacket: Number(model.value.valuePacket ?? "0"),
  });
};

const update = async () => {
  await consultationStore.update({
    publicId: props.data.publicId!,
    id: model.value.id,
    consultationName: model.value.consultationName,
    value: Number(model.value.value ?? "0"),
    valueCredit: Number(model.value.valueCredit ?? "0"),
    valueAntecipation24: Number(model.value.valueAntecipation24 ?? "0"),
    valueAntecipation48: Number(model.value.valueAntecipation48 ?? "0"),
    valueAntecipation72: Number(model.value.valueAntecipation72 ?? "0"),
    valuePacket: Number(model.value.valuePacket ?? "0"),
  });
};

const handleClose = () => {
  clearModel();
  emit("close");
};
</script>
