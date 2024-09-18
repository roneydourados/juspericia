<template>
  <v-card v-if="!showForm" flat rounded="lg">
    <v-card-title
      class="d-flex align-center justify-space-between pa-4"
      style="gap: 0.5rem"
    >
      <strong style="font-size: 1.2rem">Modelos de laudos</strong>
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
      <div class="d-flex align-center" style="gap: 0.5rem">
        <v-btn
          variant="flat"
          color="info"
          class="text-none"
          size="small"
          @click="router.back()"
        >
          <v-icon icon="mdi-arrow-left"> </v-icon>
          Voltar
        </v-btn>
        <v-btn
          prepend-icon="mdi-plus"
          class="text-none"
          size="small"
          color="primary"
          @click="showForm = true"
        >
          Novo
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col v-for="report in $all" cols="12" lg="3" :key="report.id">
          <v-card rounded="lg" flat elevation="4">
            <v-card-title class="d-flex align-center" style="gap: 0.5rem">
              <strong>Modelo:</strong>
              <span class="text-truncate">
                {{ report.title }}
              </span>
            </v-card-title>
            <v-card-actions class="d-flex justify-end">
              <v-btn
                color="warning"
                class="text-none"
                prepend-icon="mdi-pencil-outline"
                @click="editItem(report)"
              >
                Editar
              </v-btn>
              <v-btn
                color="error"
                class="text-none"
                prepend-icon="mdi-delete-outline"
                @click="deleteItem(report)"
              >
                Apagar
              </v-btn>
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

const handleSearch = async (search: string, isLoading: boolean = true) => {
  setTimeout(async () => {
    loading.value = isLoading;
    try {
      await reportModel.index(search);
    } finally {
      loading.value = false;
    }
  }, 700);
};
</script>
