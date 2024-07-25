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
          <CurrencyInput
            v-model:model-number="model.value.value"
            v-model:model-value="model.value.text"
            label="Preço"
            required
          />
        </v-col>
        <v-col cols="12" lg="3">
          <CurrencyInput
            v-model:model-number="model.valueCredit.value"
            v-model:model-value="model.valueCredit.text"
            label="Preço Crédito"
            required
          />
        </v-col>
        <v-col cols="12" lg="3">
          <CurrencyInput
            v-model:model-number="model.valuePacket.value"
            v-model:model-value="model.valuePacket.text"
            label="Preço Pacote"
            required
          />
        </v-col>
        <v-col cols="12" lg="3">
          <CurrencyInput
            v-model:model-number="model.valueAntecipation.value"
            v-model:model-value="model.valueAntecipation.text"
            label="Valor Atencipação"
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
  value: {
    text: "0,00",
    value: 0,
  },
  valueCredit: {
    text: "0,00",
    value: 0,
  },
  valueAntecipation: {
    text: "0,00",
    value: 0,
  },
  valuePacket: {
    text: "0,00",
    value: 0,
  },
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
    value: {
      text: amountFormated(props.data.value ?? 0, false),
      value: props.data.value ?? 0,
    },
    valueCredit: {
      text: amountFormated(props.data.valueCredit ?? 0, false),
      value: props.data.valueCredit ?? 0,
    },
    valueAntecipation: {
      text: amountFormated(props.data.valueAntecipation ?? 0, false),
      value: props.data.valueAntecipation ?? 0,
    },
    valuePacket: {
      text: amountFormated(props.data.valuePacket ?? 0, false),
      value: props.data.valuePacket ?? 0,
    },
  };
};

const clearModel = () => {
  model.value = {
    id: 0,
    consultationName: "",
    value: {
      text: "0,00",
      value: 0,
    },
    valueCredit: {
      text: "0,00",
      value: 0,
    },
    valueAntecipation: {
      text: "0,00",
      value: 0,
    },
    valuePacket: {
      text: "0,00",
      value: 0,
    },
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
    value: model.value.value.value,
    valueCredit: model.value.valueCredit.value,
    valueAntecipation: model.value.valueAntecipation.value,
    valuePacket: model.value.valuePacket.value,
  });
};

const update = async () => {
  await consultationStore.update({
    id: model.value.id,
    consultationName: model.value.consultationName,
    value: model.value.value.value,
    valueCredit: model.value.valueCredit.value,
    valueAntecipation: model.value.valueAntecipation.value,
    valuePacket: model.value.valuePacket.value,
  });
};

const handleClose = () => {
  clearModel();
  emit("close");
};
</script>
