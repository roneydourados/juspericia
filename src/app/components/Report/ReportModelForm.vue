<template>
  <v-card flat rounded="lg">
    <FormCrud :on-submit="handleSubmit" :show-submit-button="false">
      <v-card flat rounded="lg">
        <v-card-title>
          <v-row dense class="pa-4">
            <v-col cols="12" lg="4">
              <StringInput
                v-model="model.title"
                label="Título Modelo"
                required
              />
            </v-col>
            <v-col cols="12" lg="5" />
            <v-col
              cols="12"
              lg="3"
              class="d-flex align-center"
              style="gap: 0.5rem"
            >
              <v-btn
                variant="flat"
                color="info"
                prepend-icon="mdi-arrow-left"
                @click="$emit('close')"
                class="text-none"
                size="small"
              >
                Voltar
              </v-btn>

              <v-btn
                color="info"
                prepend-icon="mdi-printer"
                size="small"
                variant="flat"
                class="text-none"
                @click="handlePDF"
              >
                Imprimir
              </v-btn>
              <v-btn
                color="primary"
                prepend-icon="mdi-check"
                type="submit"
                size="small"
                class="text-none"
                variant="flat"
              >
                Salvar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <RitchTextEditor v-model="model.content" />
        </v-card-text>
      </v-card>
    </FormCrud>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object as PropType<ReportModelProps>,
    default: undefined,
  },
});

const reportModel = useReportModelStore();
const { stringToHandlePDF } = useUtils();
const emit = defineEmits(["close"]);

const model = ref({
  id: 0,
  title: "",
  content: "",
});

onMounted(() => {
  if (props.data?.id) {
    loadModel();
  }
});

onUnmounted(() => {
  clearModel();
});

const loadModel = () => {
  model.value.id = props.data?.id!;
  model.value.title = props.data?.title!;
  model.value.content = props.data?.content!;
};

const clearModel = () => {
  model.value = {
    id: 0,
    title: "",
    content: "",
  };
};

const handleSubmit = async () => {
  try {
    if (model.value.id <= 0) {
      await reportModel.create(model.value);
    } else {
      await reportModel.update({
        ...model.value,
        publicId: props.data?.publicId!,
      });
    }

    await reportModel.index("");
    handleClose();
  } catch (error) {
    console.log("🚀 ~ handleSubmit ~ error:", error);
  }
};

const handleClose = () => {
  clearModel();
  emit("close");
};

const handlePDF = () => {
  stringToHandlePDF(model.value.content);
};
</script>
