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
          <StringInput v-model="model.name" label="Título" required />
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
  <DialogLoading :dialog="loading" />
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

const loading = ref(false);

const model = ref({
  publicId: "",
  name: "",
  urlImage:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  description: "",
  value: "",
  status: "",
  dueDays: "30",
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
  };
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (model.value.publicId) {
      await consultationPackageStore.update({
        publicId: model.value.publicId,
        description: model.value.description,
        name: model.value.name,
        value: Number(model.value.value),
        urlImage: model.value.urlImage,
        dueDays: Number(model.value.dueDays),
      });
    } else {
      await consultationPackageStore.create({
        description: model.value.description,
        name: model.value.name,
        value: Number(model.value.value),
        urlImage: model.value.urlImage,
        dueDays: Number(model.value.dueDays),
      });
    }

    await consultationPackageStore.index("active");

    handleClose();
  } catch (error) {
    console.log("🚀 ~ handleSubmit ~ error:", error);
  } finally {
    loading.value = false;
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
    urlImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "",
    value: "",
    status: "",
    dueDays: "30",
  };
};
</script>

<style scoped></style>
