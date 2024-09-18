<template>
  <DialogForm
    :show="show"
    :title="title"
    :width="mobile ? '' : width"
    @dialog="handleClose"
  >
    <FormCrud :on-submit="submitForm">
      <v-row dense>
        <v-col cols="12">
          <StringInput v-model="model.name" label="Nome benefício" required />
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
    default: "",
  },
  data: {
    type: Object as PropType<ReportPurposeProps>,
    default: () => ({}),
  },
});

const emit = defineEmits(["close"]);

const { mobile } = useDisplay();
const model = ref<ReportPurposeProps>({
  name: "",
});
const store = useReportPorposesStore();

watch(
  () => props.data,
  (value) => {
    if (value.id) {
      model.value = value;
    }
  },
  { immediate: true }
);

const handleClose = () => {
  emit("close");
  model.value.name = "";
};

const submitForm = async () => {
  if (model.value?.id) {
    await store.update({
      ...model.value,
      publicId: props.data.publicId!,
    });
  } else {
    if (model.value) {
      await store.create(model.value);
    }
  }
  await store.index("");
  handleClose();
};
</script>
