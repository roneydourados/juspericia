<template>
  <form ref="formRef" @submit.prevent="onSubmit">
    <slot />
    <div class="d-flex align-center pa-4 w-100" v-if="showSubmitButton">
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        type="submit"
        :disabled="loading"
        class="text-none"
      >
        <div v-if="!loading" class="d-flex align-center">
          <v-icon icon="mdi-check" />
          <span style="font-size: 0.9rem" class="ml-2">
            {{ buttonLabel }}
          </span>
        </div>
      </v-btn>
      <slot name="button" />
    </div>
    <!-- <DialogLoading :dialog="loading" /> -->
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";

const props = defineProps({
  onSubmit: {
    type: Function,
    required: true,
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
const { handleSubmit } = useForm();

const onSubmit = handleSubmit(async () => {
  loading.value = true;
  try {
    await props.onSubmit();
  } finally {
    loading.value = false;
  }
});
</script>
