<template>
  <DialogForm
    :show="show"
    title="Termos e condições de uso do sistema"
    @dialog="show = false"
    width="80%"
  >
    <CardBlur :hover="false">
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
          <v-col cols="12" lg="6" class="d-flex justify-end">
            <Button @click="handleSubmit" variant="outlined">
              <v-icon icon="mdi-check" start color="colorIcon" />
              Salvar
            </Button>
          </v-col>

          <v-col cols="12">
            <TextEditor v-model="model.content" height="30" />
          </v-col>
        </v-row>
      </template>
    </CardBlur>
    <DialogLoading :dialog="loading" />
    <v-snackbar
      v-model="showSaveAlert"
      vertical
      color="success"
      :timeout="2000"
      position="relative"
    >
      <div class="text-subtitle-1 pb-2">Dados salvos com sucesso!</div>
      <div class="text-subtitle-1 pb-2">
        Dados do termo foi salvo para sair da tela clique no X do canto superior
        direito para fechar esta tela.
      </div>
      <template #actions>
        <v-btn
          color="white"
          variant="text"
          @click="showSaveAlert = false"
          class="text-none"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </DialogForm>
</template>

<script setup lang="ts">
const termsStore = useTermsStore();

const $single = computed(() => termsStore.$single);

const show = defineModel("show", {
  default: false,
});

const loading = ref(false);
const showSaveAlert = ref(false);
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
    showSaveAlert.value = true;
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
