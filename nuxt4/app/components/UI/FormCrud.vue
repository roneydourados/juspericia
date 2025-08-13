<template>
  <form ref="formRef" @submit.prevent="onSubmit">
    <slot />
    <div class="d-flex align-center pa-4 w-100" v-if="showSubmitButton">
      <v-spacer></v-spacer>
      <Button
        color="primary"
        variant="flat"
        size="small"
        type="submit"
        :disabled="loading"
      >
        <div v-if="!loading" class="d-flex align-center">
          <v-icon icon="mdi-check" start />
          <span class="text-caption">
            {{ buttonLabel }}
          </span>
        </div>
      </Button>
      <slot name="button" />
    </div>
    <DialogLoading :dialog="loading" />
    <v-snackbar v-model="showErrorAlert" vertical color="error" :timeout="5000">
      <div class="text-subtitle-1 pb-2">
        Existem campos obrigatórios ou de preenchimento incorreto verifique.
      </div>
      <div class="text-subtitle-1 pb-2">
        Não foi possível salvar as informações, verifique os campos obrigatórios
        e tente novamente. Confira os campos que contém * ou se nenhum outro foi
        digitado de forma incorreta.
      </div>
      <template #actions>
        <v-btn color="white" variant="text" @click="showErrorAlert = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
// import { ref, onUnmounted } from "vue";

const props = defineProps({
  onSubmit: {
    type: Function,
    default: undefined,
  },
  showSubmitButton: {
    type: Boolean,
    default: true,
  },
  buttonLabel: {
    type: String,
    default: "Salvar",
  },
});

const formRef = ref();
const loading = ref(false);
const errorMessages = ref<string[]>([]);
const showErrorAlert = defineModel("showError", {
  default: false,
});

const { handleSubmit, validate, resetForm: veeResetForm } = useForm();

const onValidSubmit = async () => {
  if (!props.onSubmit) return;

  loading.value = true;
  try {
    await props.onSubmit();
  } catch (error) {
    console.error("Erro na submissão:", error);
  } finally {
    loading.value = false;
  }
};

const onInvalidSubmit = ({ errors }: any) => {
  errorMessages.value = Object.values(errors);
  showErrorAlert.value = true; // Ativa o snackbar
};

const onSubmit = handleSubmit(onValidSubmit, onInvalidSubmit);

onUnmounted(() => {
  resetForm();
});

const resetForm = () => {
  if (formRef.value) {
    formRef.value.reset();
  }
  veeResetForm();
};

defineExpose({
  formRef,
  resetForm,
  validateForm: validate,
});
</script>
