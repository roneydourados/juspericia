<template>
  <DialogForm
    :show="show"
    title="Especialidade médica"
    :width="mobile ? '100%' : '30%'"
    @dialog="handleClose"
  >
    <FormCrud :on-submit="submit">
      <v-row dense>
        <v-col cols="12">
          <StringInput label="Especialidade" v-model="model.medicalSpecialty" />
        </v-col>
        <v-col cols="12" lg="6">
          <CurrencyInput label="Valor" v-model="model.value" />
        </v-col>
        <v-col cols="12" lg="6">
          <SelectInput
            label="Status"
            v-model="model.status"
            :items="[
              { title: 'Ativo', value: 'active' },
              { title: 'Inativo', value: 'inactive' },
            ]"
            item-value="value"
            item-title="title"
          />
        </v-col>
      </v-row>
    </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const props = defineProps({
  data: {
    type: Object as PropType<MedicalSpecialtyProps>,
    default: () => ({}),
  },
});

const emit = defineEmits(["close"]);

const { mobile } = useDisplay();
const { amountFormated } = useUtils();
const storeMedicalSpecialty = useMedicalSpecialtyStore();
const show = defineModel("show", {
  default: false,
});

const model = ref({
  publicId: "",
  status: "active",
  medicalSpecialty: "",
  value: "",
});

watchEffect(() => {
  if (props.data.id && show.value) {
    loadModel();
  } else if (!props.data.id && show.value) {
    clearModel();
  }
});

const loadModel = () => {
  model.value = {
    publicId: props.data.publicId ?? "",
    medicalSpecialty: props.data.medicalSpecialty ?? "",
    status: props.data.status ?? "active",
    value: String(props.data.value ?? 0),
  };
};

const clearModel = () => {
  model.value = {
    status: "active",
    medicalSpecialty: "",
    value: "",
    publicId: "",
  };
};

const submit = async () => {
  try {
    if (props.data.id) {
      await storeMedicalSpecialty.update({
        ...model.value,
        value: Number(model.value.value ?? "0"),
      });
    } else {
      await storeMedicalSpecialty.store({
        ...model.value,
        value: Number(model.value.value ?? "0"),
      });
    }

    await storeMedicalSpecialty.index("");
  } catch (error) {
    console.log(error);
  } finally {
    show.value = false;
  }
};

const handleClose = () => {
  show.value = false;
  clearModel();
  emit("close");
};
</script>
