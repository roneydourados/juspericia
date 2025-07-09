<template>
  <DialogForm
    :show="show"
    :title="title"
    :width="mobile ? '' : width"
    @dialog="handleClose"
  >
    <FormCrud :on-submit="handleSubmit">
      <v-row dense>
        <v-col cols="12" lg="8">
          <StringInput v-model="model.name" label="Título" required />
        </v-col>
        <v-col cols="12" lg="4">
          <IntegerInput
            v-model="model.packageQuantity"
            label="Quantidade de consultas"
            required
          />
        </v-col>
        <v-col cols="12">
          <TextInput v-model="model.description" label="Descrição" required />
        </v-col>
        <v-col cols="12" lg="3">
          <CurrencyInput v-model="model.value" label="Preço" required />
        </v-col>
        <v-col cols="12" lg="3" class="d-flex flex-column">
          <IntegerInput v-model="model.dueDays" label="Expira em" required />
        </v-col>
        <v-col v-if="model.dueDays" cols="12" lg="4" class="d-flex flex-column">
          <span>
            Pacote configurado para expirar em {{ model.dueDays }} dias.
          </span>
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
    type: Object as PropType<ServicePackagesProps>,
    default: () => ({}),
  },
});
const emit = defineEmits(["close"]);

const { mobile } = useDisplay();

const consultationPackageStore = useServicePackageStore();

const { amountFormated } = useUtils();

const model = ref({
  publicId: "",
  name: "",
  urlImage: "@/assets/images/package.avif",
  description: "",
  value: "",
  status: "",
  dueDays: "30",
  packageQuantity: "1",
});

watchPostEffect(() => {
  if (props.data?.id && props.show) {
    loadModel();
  }
});

const loadModel = () => {
  model.value = {
    publicId: props.data.publicId ?? "",
    name: props.data.name ?? "",
    urlImage: props.data.urlImage ?? "",
    description: props.data.description ?? "",
    value: amountFormated(props.data.value ?? 0, false),
    status: props.data.status ?? "",
    dueDays: props.data.dueDays?.toString() ?? "",
    packageQuantity: props.data.packageQuantity?.toString() ?? "1",
  };
};

const handleSubmit = async () => {
  try {
    if (model.value.publicId) {
      await consultationPackageStore.update({
        publicId: model.value.publicId,
        description: model.value.description,
        name: model.value.name,
        value: Number(model.value.value),
        urlImage: model.value.urlImage,
        dueDays: Number(model.value.dueDays),
        packageQuantity: Number(model.value.packageQuantity),
      });
    } else {
      await consultationPackageStore.create({
        description: model.value.description,
        name: model.value.name,
        value: Number(model.value.value),
        urlImage: model.value.urlImage,
        dueDays: Number(model.value.dueDays),
        packageQuantity: Number(model.value.packageQuantity),
      });
    }

    await consultationPackageStore.index("active");

    handleClose();
  } catch (error) {
    console.log("🚀 ~ handleSubmit ~ error:", error);
  }
};

const handleClose = () => {
  emit("close");
  clearModel();
};

const clearModel = () => {
  model.value = {
    publicId: "",
    name: "",
    urlImage: "@/assets/images/package.avif",
    description: "",
    value: "",
    status: "",
    dueDays: "30",
    packageQuantity: "1",
  };
};
</script>

<style scoped></style>
