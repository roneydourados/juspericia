<template>
  <v-card v-if="!showForm" flat rounded="lg">
    <v-card-title class="d-flex flex-column pa-4" style="gap: 1rem">
      <HeaderPage title="Modelos de laudos" font-size="1.8rem" />
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
    <v-card-text>
      <v-row dense>
        <v-col v-for="report in $all" cols="12" lg="3" :key="report.id">
          <v-card rounded="xl" variant="flat" elevation="6">
            <v-card-title>
              <v-row class="text-primary pa-6">
                <v-col cols="12" lg="6" style="gap: 0.2rem">
                  <div class="d-flex align-center" style="gap: 0.5rem">
                    <strong>Modelo:</strong>
                    <span>
                      {{ report.title }}
                    </span>
                  </div>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-actions class="d-flex justify-center">
              <Button
                color="grey"
                class="text-none"
                variant="outlined"
                size="small"
                @click="editItem(report)"
              >
                <v-icon icon="mdi-pencil-outline" start color="colorIcon" />
                <span class="text-primary text-caption"> Editar </span>
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="grey"
                class="text-none"
                @click="deleteItem(report)"
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
  <ReportModelForm v-if="showForm" :data="selected" @close="handleCloseForm" />
  <Dialog
    title="CONFIRME"
    :dialog="showDelete"
    @cancel="showDelete = false"
    @confirm="handleDeleteItem"
    show-cancel
  >
    <span>Apagar {{ selected?.title }} ? </span>
  </Dialog>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

const reportModel = useReportModelStore();
const router = useRouter();

const $all = computed(() => reportModel.$all);
const $single = computed(() => reportModel.$single);

const selected = ref<ReportModelProps>();
const showForm = ref(false);
const showDelete = ref(false);
const loading = ref(false);
const search = ref("");

const getItem = (item: ReportModelProps) => {
  selected.value = item;
};

const editItem = async (item: ReportModelProps) => {
  loading.value = true;
  try {
    await reportModel.show(item.publicId!);

    getItem($single.value!);

    showForm.value = true;
  } finally {
    loading.value = false;
  }
};

const deleteItem = (item: ReportModelProps) => {
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
    await reportModel.destroy(selected.value!.publicId!);
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
      await reportModel.index(search);
    } finally {
      loading.value = false;
    }
  },
  500
);
</script>
