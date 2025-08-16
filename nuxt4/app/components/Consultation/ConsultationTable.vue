<template>
  <v-card flat rounded="lg">
    <v-card-title class="d-flex flex-column pa-4" style="gap: 1rem">
      <HeaderPage title="Cadastro de consultas" font-size="1.8rem" />
      <div class="d-flex flex-wrap mt-4" style="gap: 1rem">
        <StringInput
          v-model="search"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          flat
          hide-details
          single-line
          style="font-size: 1.4rem"
          @update:model-value="handleSearch(search)"
          :loading="loading"
          placeholder="Digite algo para pesquisar..."
        />

        <div class="d-flex" style="gap: 0.5rem">
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
          <Button color="primary" @click="showForm = true" size="small">
            <v-icon icon="mdi-plus" start color="colorIcon" />
            <span class="text-caption"> Novo </span>
          </Button>
        </div>
      </div>
    </v-card-title>

    <v-card-text class="pa-4">
      <v-row dense>
        <v-col
          v-for="consultation in $all"
          cols="12"
          lg="4"
          :key="consultation.id"
        >
          <v-card rounded="xl" variant="flat" elevation="6">
            <v-card-title>
              <v-row dense>
                <v-col cols="12" class="d-flex flex-column text-primary pa-8">
                  <div class="d-flex" style="gap: 0.5rem">
                    <strong class="">Título:</strong>
                    <span class="text-truncate">
                      {{ consultation.consultationName }}
                    </span>
                  </div>
                  <v-divider class="mt-8" />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col
                  cols="12"
                  lg="6"
                  class="d-flex flex-column px-8"
                  style="gap: 0.2rem"
                >
                  <div class="d-flex align-center" style="gap: 0.5rem">
                    <v-avatar color="greenLime" variant="outlined" size="25">
                      <v-icon
                        icon="mdi-currency-usd"
                        color="colorIcon"
                        size="15"
                      />
                    </v-avatar>
                    <span>Preço Crédito</span>
                  </div>
                  <strong style="font-size: 1.2rem" class="text-primary">
                    {{ amountFormated(consultation.value ?? 0, false) }}
                  </strong>
                </v-col>
                <v-col
                  cols="12"
                  lg="6"
                  class="d-flex flex-column px-8"
                  style="gap: 0.2rem"
                >
                  <div class="d-flex align-center" style="gap: 0.5rem">
                    <v-avatar color="primary" variant="outlined" size="25">
                      <v-icon
                        icon="mdi-currency-usd"
                        color="primary"
                        size="15"
                      />
                    </v-avatar>
                    <span>Preço Crédito</span>
                  </div>
                  <strong style="font-size: 1.2rem" class="text-primary">
                    {{ amountFormated(consultation.valueCredit ?? 0, false) }}
                  </strong>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-actions class="d-flex justify-center">
              <Button
                color="grey"
                class="text-none"
                variant="outlined"
                size="small"
                @click="editItem(consultation)"
              >
                <v-icon icon="mdi-pencil-outline" start color="colorIcon" />
                <span class="text-primary text-caption"> Editar </span>
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="grey"
                class="text-none"
                @click="deleteItem(consultation)"
              >
                <v-icon icon="mdi-delete-outline" start color="red" />
                <span class="text-primary text-caption"> Apagar </span>
              </Button>
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
