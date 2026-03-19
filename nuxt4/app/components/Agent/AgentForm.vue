<template>
  <DialogForm
    :show="show"
    :title="isEdit ? 'Editar Agente' : 'Novo Agente'"
    icon="mdi-robot-outline"
    show-cancel
    ok-text="Salvar"
    cancel-text="Cancelar"
    @confirm="handleSubmit"
    @dialog="handleClose"
    fullscreen
  >
    <FormCrud
      ref="formRef"
      :on-submit="handleSubmit"
      :show-submit-button="true"
    >
      <v-row dense>
        <v-col cols="12" lg="6">
          <StringInput v-model="model.name" label="Nome do agente" required />
        </v-col>
        <v-col cols="12">
          <TextInput
            v-model="model.systemPrompt"
            label="Prompt do sistema"
            required
            rows="20"
          />
        </v-col>
      </v-row>
    </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
import type { AgentProps } from "@/types/Agent";

const props = defineProps<{
  data?: AgentProps;
}>();

const show = defineModel("show", { default: false });

const agentStore = useAgentStore();
const formRef = ref();

const isEdit = computed(() => !!props.data?.publicId);

const model = ref({
  name: "",
  systemPrompt: "",
});

const clearModel = () => {
  model.value = {
    name: "",
    systemPrompt: "",
  };
};

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      model.value.name = newData.name ?? "";
      model.value.systemPrompt = newData.systemPrompt ?? "";
    } else {
      clearModel();
    }
  },
  { immediate: true },
);

const handleSubmit = async () => {
  const validation = await formRef.value?.validateForm();

  if (!validation?.valid) return;

  if (isEdit.value) {
    await agentStore.update({
      publicId: props.data!.publicId,
      name: model.value.name,
      systemPrompt: model.value.systemPrompt,
    });
  } else {
    await agentStore.create({
      name: model.value.name,
      systemPrompt: model.value.systemPrompt,
    });
  }

  await agentStore.index("");
  handleClose();
};

const handleClose = () => {
  clearModel();
  show.value = false;
};
</script>
