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
        <v-col cols="12" lg="4">
          <CurrencyInput v-model="model.value" label="Preço" required />
        </v-col>
        <v-col cols="12" lg="4">
          <CurrencyInput
            v-model="model.valueCredit"
            label="Preço Crédito"
            required
          />
        </v-col>
        <v-col cols="12" lg="4">
          <CurrencyInput
            v-model="model.valueAntecipation24"
            label="Valor Atencipação 24hrs"
            required
          />
        </v-col>
        <v-col cols="12" lg="4">
          <CurrencyInput
            v-model="model.valueAntecipation48"
            label="Valor Atencipação 48hrs"
            required
          />
        </v-col>
        <v-col cols="12" lg="4">
          <CurrencyInput
            v-model="model.valueAntecipation72"
            label="Valor Atencipação 72hrs"
            required
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col col="12" lg="10">
          <StringInput v-model="benefitTypeName" label="Tipo Benefócio" />
        </v-col>
        <v-col col="12" lg="2">
          <v-btn
            color="primary"
            variant="flat"
            class="text-none"
            size="small"
            @click="handleAddBenefitType(benefitTypeName)"
          >
            Adicionar
          </v-btn>
        </v-col>
        <v-col
          v-for="(benefit, index) in model.benefitTypes"
          cols="12"
          :key="benefit"
        >
          <div class="d-flex align-center w-100">
            <v-icon icon="mdi-check-circle" color="success" start />
            <span>{{ benefit }}</span>
            <v-btn
              icon
              variant="text"
              class="ml-auto"
              size="x-small"
              @click="handleDeleteBenefitType(index)"
            >
              <v-icon icon="mdi-delete" color="error" />
            </v-btn>
          </div>
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

const benefitTypeName = ref("");

const model = ref({
  id: 0,
  consultationName: "",
  value: "",
  valueCredit: "",
  valueAntecipation24: "",
  valueAntecipation48: "",
  valueAntecipation72: "",
  valuePacket: "0",
  benefitTypes: [] as string[],
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
    benefitTypes: props.data.benefitTypes
      ? props.data.benefitTypes.map((item) => {
          return item.name;
        })
      : [],
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
    benefitTypes: [],
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
    console.log("🚀 ~ handleSubmit consultation ~ error:", error);
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
    benefitTypes: model.value.benefitTypes.map((item) => {
      return { name: item };
    }),
  });
};

const update = async () => {
  const payload = {
    publicId: props.data.publicId!,
    id: model.value.id,
    consultationName: model.value.consultationName,
    value: Number(model.value.value ?? "0"),
    valueCredit: Number(model.value.valueCredit ?? "0"),
    valueAntecipation24: Number(model.value.valueAntecipation24 ?? "0"),
    valueAntecipation48: Number(model.value.valueAntecipation48 ?? "0"),
    valueAntecipation72: Number(model.value.valueAntecipation72 ?? "0"),
    valuePacket: Number(model.value.valuePacket ?? "0"),
    benefitTypes: model.value.benefitTypes.map((item) => {
      return { name: item };
    }),
  };

  await consultationStore.update(payload);
};

const handleClose = () => {
  clearModel();
  emit("close");
};

const handleDeleteBenefitType = (index: number) => {
  model.value.benefitTypes.splice(index, 1);
};

const handleAddBenefitType = (benefitType: string) => {
  model.value.benefitTypes.push(benefitType);
  benefitTypeName.value = "";
};
</script>
