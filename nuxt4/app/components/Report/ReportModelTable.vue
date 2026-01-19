<template>
  <div v-if="!showForm" class="pa-12">
    <v-row>
      <v-col cols="12" class="pa-6">
        <HeaderPage title="Modelos de Laudos" font-size="1.8rem" />
      </v-col>
      <v-col cols="12" lg="10">
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
      </v-col>
      <v-col cols="12" lg="2" class="d-flex flex-wrap" style="gap: 0.5rem">
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
      </v-col>
      <v-col v-for="report in $all" cols="12" lg="3" :key="report.id">
        <CardBlur>
          <template #content>
            <v-row class="text-colorTextPrimary pa-6">
              <v-col cols="12" style="gap: 0.2rem">
                <strong>
                  {{ report.title }}
                </strong>
                <!-- <div class="d-flex align-center w-100" style="gap: 0.5rem">
                  <strong>Modelo:</strong>
                  <span>
                    {{ report.title }}
                  </span>
                </div> -->
              </v-col>
            </v-row>
          </template>
          <template #actions>
            <div class="d-flex justify-center w-100" style="gap: 0.5rem">
              <Button
                color="grey"
                class="text-none"
                variant="outlined"
                size="small"
                @click="editItem(report)"
              >
                <v-icon icon="mdi-pencil-outline" start color="colorIcon" />
                <span class="text-colorTextPrimary text-caption"> Editar </span>
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="grey"
                class="text-none"
                @click="deleteItem(report)"
              >
                <v-icon icon="mdi-delete-outline" start color="red" />
                <span class="text-colorTextPrimary text-caption"> Apagar </span>
              </Button>
            </div>
          </template>
        </CardBlur>
      </v-col>
    </v-row>
  </div>
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
  500,
);
</script>
