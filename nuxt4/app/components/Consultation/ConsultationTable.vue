<template>
  <v-card flat rounded="lg">
    <v-card-title
      class="d-flex flex-wrap align-center justify-space-between pa-4"
      style="gap: 1rem"
    >
      <strong style="font-size: 1.2rem">Cadastro de consultas</strong>
      <v-text-field
        v-model="search"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
        rounded="lg"
        style="font-size: 1.4rem"
        @update:model-value="handleSearch(search)"
        :loading="loading"
      >
        <template #label>
          <span> Digite algo para efetuar consulta... </span>
        </template>
      </v-text-field>
      <Button
        variant="outlined"
        color="grey"
        class="text-none"
        size="small"
        @click="router.back()"
      >
        <v-icon icon="mdi-arrow-left" color="darkText" />
        <span class="text-darkText text-caption"> Voltar </span>
      </Button>
      <Button
        color="primary"
        variant="flat"
        size="small"
        class="text-none"
        @click="showForm = true"
      >
        <v-icon icon="mdi-plus" start color="colorIcon" />
        <span class="text-caption"> Novo </span>
      </Button>
    </v-card-title>
    <v-card-text class="pa-4">
      <v-row dense>
        <v-col
          v-for="consultation in $all"
          cols="12"
          lg="4"
          :key="consultation.id"
        >
          <v-card rounded="lg" flat elevation="4">
            <v-card-title>
              <v-row dense>
                <v-col cols="12" class="d-flex" style="gap: 0.5rem">
                  <strong>Título:</strong>
                  <span class="text-truncate">
                    {{ consultation.consultationName }}
                  </span>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" lg="4">
                  <InfoLabel
                    font-size="0.9"
                    font-size-content="1"
                    title="Preço"
                    icon="mdi-cash"
                    color-icon="green"
                    :content="amountFormated(consultation.value ?? 0, false)"
                    :show-divider="true"
                  />
                </v-col>
                <v-col cols="12" lg="4">
                  <InfoLabel
                    font-size="0.9"
                    font-size-content="1"
                    title="Preço Crédito"
                    icon="mdi-cash"
                    color-icon="info"
                    :content="
                      amountFormated(consultation.valueCredit ?? 0, false)
                    "
                    :show-divider="true"
                  />
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-actions class="d-flex justify-end">
              <v-btn
                color="warning"
                class="text-none"
                prepend-icon="mdi-pencil-outline"
                @click="editItem(consultation)"
              >
                Editar
              </v-btn>
              <v-btn
                color="error"
                class="text-none"
                prepend-icon="mdi-delete-outline"
                @click="deleteItem(consultation)"
              >
                Apagar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <ConsultationForm
    title="Consulta"
    :show="showForm"
    :data="selected"
    @close="handleCloseForm"
    width="600"
  />
  <Dialog
    title="CONFIRME"
    :dialog="showDelete"
    @cancel="showDelete = false"
    @confirm="handleDeleteItem"
    show-cancel
  >
    <span>Apagar {{ selected?.consultationName }} ? </span>
  </Dialog>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
const consutationStore = useConsultationStore();
const { amountFormated } = useUtils();
const router = useRouter();

const $all = computed(() => consutationStore.$all);
//const $single = computed(() => consutationStore.$single);

const selected = ref<ConsultationProps>();
const showForm = ref(false);
const showDelete = ref(false);
const loading = ref(false);
const search = ref("");

const getItem = (item: ConsultationProps) => {
  selected.value = item;
};

const editItem = (item: ConsultationProps) => {
  getItem(item);

  showForm.value = true;
};

const deleteItem = (item: ConsultationProps) => {
  getItem(item);
  showDelete.value = true;
};

const handleCloseForm = () => {
  showForm.value = false;
  selected.value = undefined;
};

const handleDeleteItem = async () => {
  loading.value = true;
  try {
    await consutationStore.destroy(selected.value!.publicId!);
    await handleSearch("", false);
    showDelete.value = false;
    selected.value = undefined;
  } finally {
    loading.value = false;
  }
};

const handleSearch = useDebounceFn(
  async (search: string, isLoading: boolean = true) => {
    loading.value = isLoading;
    try {
      await consutationStore.index(search);
    } finally {
      loading.value = false;
    }
  },
  500
);
</script>
