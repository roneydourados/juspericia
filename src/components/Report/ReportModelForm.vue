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
                color="info"
                prepend-icon="mdi-printer"
                type="submit"
                size="small"
                variant="flat"
                @click="handlePDF"
              >
                Imprimir
              </v-btn>
              <v-btn
                color="primary"
                prepend-icon="mdi-check"
                type="submit"
                size="small"
                variant="flat"
              >
                Salvar
              </v-btn>
              <v-btn
                variant="flat"
                color="error"
                prepend-icon="mdi-cancel"
                type="submit"
                @click="$emit('close')"
                size="small"
              >
                cancelar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <!-- <EditorTinyMCE v-model="model.content" /> -->
          <CKEditor v-model="model.content" />
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
      console.log("🚀 ~ handleSubmit ~ model.value:", model.value);
      await reportModel.create(model.value);
    } else {
      await reportModel.update(model.value);
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
  const html = model.value.content;

  // Criar um iframe temporário
  const iframe = document.createElement("iframe");

  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  // Escrever o conteúdo HTML no iframe e chamar a impressão
  if (iframe.contentDocument) {
    iframe.contentDocument.open();
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
  }

  if (iframe.contentWindow) {
    iframe.contentWindow.onafterprint = () => document.body.removeChild(iframe); // Remover após a impressão
    iframe.contentWindow.print();
  }
};
</script>
