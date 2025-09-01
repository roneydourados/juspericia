<template>
  <DialogForm
    :show="show"
    title="Termos e condições de uso do sistema"
    fullscreen
    @dialog="show = false"
  >
    <CardBlur :hover="false" height="100%">
      <template #content>
        <v-row dense>
          <v-col cols="12">
            <RitchTextEditor v-model="model.content" height="40" />
          </v-col>
        </v-row>
      </template>
      <template #actions>
        <div class="d-flex justify-end w-100">
          <Button @click="handleSubmit" variant="outlined">
            <v-icon icon="mdi-check" start color="colorIcon" />
            Salvar
          </Button>
        </div>
      </template>
    </CardBlur>
  </DialogForm>
</template>

<script setup lang="ts">
const termsStore = useTermsStore();

const $single = computed(() => termsStore.$single);

const show = defineModel("show", {
  default: false,
});

const model = ref({
  content: "",
});

watch(
  $single,
  (newValue) => {
    if (newValue) {
      model.value.content = newValue.content;
    }
  },
  {
    immediate: true,
  }
);

const handleSubmit = async () => {
  show.value = false;
  try {
    await termsStore.store(model.value);
  } catch (error) {
    console.log("🚀 ~ handleSubmit terms ~ error:", error);
  }
};
</script>
