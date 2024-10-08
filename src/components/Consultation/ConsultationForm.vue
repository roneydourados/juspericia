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
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="3">
          <CurrencyInput
            v-model:model-number="model.valueAntecipation24.value"
            v-model:model-value="model.valueAntecipation24.text"
            label="Valor Atencipação 24hrs"
            required
          />
        </v-col>
        <v-col cols="12" lg="3">
          <CurrencyInput
            v-model:model-number="model.valueAntecipation48.value"
            v-model:model-value="model.valueAntecipation48.text"
            label="Valor Atencipação 48hrs"
            required
          />
        </v-col>
        <v-col cols="12" lg="3">
          <CurrencyInput
            v-model:model-number="model.valueAntecipation72.value"
            v-model:model-value="model.valueAntecipation72.text"
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
  value: {
    text: "0,00",
    value: 0,
  },
  valueCredit: {
    text: "0,00",
    value: 0,
  },
  valueAntecipation24: {
    text: "0,00",
    value: 0,
  },
  valueAntecipation48: {
    text: "0,00",
    value: 0,
  },
  valueAntecipation72: {
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
    valueAntecipation24: {
      text: amountFormated(props.data.valueAntecipation24 ?? 0, false),
      value: props.data.valueAntecipation24 ?? 0,
    },
    valueAntecipation48: {
      text: amountFormated(props.data.valueAntecipation48 ?? 0, false),
      value: props.data.valueAntecipation48 ?? 0,
    },
    valueAntecipation72: {
      text: amountFormated(props.data.valueAntecipation72 ?? 0, false),
      value: props.data.valueAntecipation72 ?? 0,
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
    valueAntecipation24: {
      text: "0,00",
      value: 0,
    },
    valueAntecipation48: {
      text: "0,00",
      value: 0,
    },
    valueAntecipation72: {
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
    valueAntecipation24: model.value.valueAntecipation24.value,
    valueAntecipation48: model.value.valueAntecipation48.value,
    valueAntecipation72: model.value.valueAntecipation72.value,
    valuePacket: model.value.valuePacket.value,
  });
};

const update = async () => {
  await consultationStore.update({
    publicId: props.data.publicId!,
    id: model.value.id,
    consultationName: model.value.consultationName,
    value: model.value.value.value,
    valueCredit: model.value.valueCredit.value,
    valueAntecipation24: model.value.valueAntecipation24.value,
    valueAntecipation48: model.value.valueAntecipation48.value,
    valueAntecipation72: model.value.valueAntecipation72.value,
    valuePacket: model.value.valuePacket.value,
  });
};

const handleClose = () => {
  clearModel();
  emit("close");
};
</script>
