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
          <v-col cols="12" lg="6">
            <SelectInput
              label="Tipo de termo"
              :items="categoryTermsList"
              v-model="model.category"
              item-title="title"
              item-value="value"
              @update:modelValue="getLastTerm"
            />
          </v-col>
          <v-col cols="12">
            <TextEditor v-model="model.content" height="40" />
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
    <DialogLoading :dialog="loading" />
  </DialogForm>
</template>

<script setup lang="ts">
const termsStore = useTermsStore();

const $single = computed(() => termsStore.$single);

const show = defineModel("show", {
  default: false,
});

const loading = ref(false);

const model = ref({
  content: "",
  category: "terms_of_use",
});

const categoryTermsList = ref([
  {
    title: "Termos de uso",
    value: "terms_of_use",
  },
  {
    title: "Manual de conduta",
    value: "conduct_manual",
  },
  {
    title: "Contrato de prestação de serviço médico",
    value: "medical_service_contract",
  },
]);

watch(
  $single,
  (newValue) => {
    if (newValue) {
      model.value = {
        content: newValue.content,
        category: newValue.category,
      };
    } else {
      model.value.content = "";
      model.value.category = "terms_of_use";
    }
  },
  {
    immediate: true,
  }
);

const handleSubmit = async () => {
  // show.value = false;
  try {
    await termsStore.store(model.value);
  } catch (error) {
    console.log("🚀 ~ handleSubmit terms ~ error:", error);
  }
};

const getLastTerm = async () => {
  loading.value = true;
  try {
    await termsStore.getLastTerm(model.value.category);
  } catch (error) {
    console.log("🚀 ~ getLastTerm ~ error:", error);
  } finally {
    loading.value = false;
  }
};
</script>
