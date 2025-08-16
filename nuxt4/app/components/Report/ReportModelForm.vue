<template>
  <div class="pa-8">
    <HeaderPage title="Modelo de Laudo" font-size="1.5rem" />
  </div>
  <v-card flat rounded="xl" elevation="8" width="95%" style="margin: 0 auto">
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
              <Button
                variant="outlined"
                color="grey"
                class="text-none"
                size="small"
                @click="emit('close')"
              >
                <v-icon icon="mdi-arrow-left" color="darkText" start />
                <span class="text-darkText text-caption"> Voltar </span>
              </Button>

              <Button
                color="primary"
                size="small"
                variant="flat"
                class="text-none"
                @click="handlePDF"
              >
                <v-icon icon="mdi-printer" color="colorIcon" start />
                <span class="text-caption"> Imprimir </span>
              </Button>
              <Button
                color="primary"
                type="submit"
                size="small"
                class="text-none"
                variant="flat"
              >
                <v-icon icon="mdi-check" color="colorIcon" start />
                <span class="text-caption"> Salvar </span>
              </Button>
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
