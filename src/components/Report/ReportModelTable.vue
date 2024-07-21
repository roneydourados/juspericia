<template>
  <v-card v-if="!showForm" flat rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between pa-4">
      <strong style="font-size: 1.2rem">Modelos de laudos</strong>
      <v-btn
        prepend-icon="mdi-plus"
        class="text-none"
        size="small"
        color="primary"
        @click="showForm = true"
      >
        Novo
      </v-btn>
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
</template>

<script setup lang="ts">
const reportModel = useReportModelStore();

onMounted(async () => {
  reportModel.index("");
});

const $all = computed(() => reportModel.$all);
const $single = computed(() => reportModel.$single);

const selected = ref<ReportModelProps>();
const showForm = ref(false);
const showDelete = ref(false);

const getItem = (item: ReportModelProps) => {
  selected.value = item;
};

const editItem = async (item: ReportModelProps) => {
  await reportModel.show(item.id!);

  getItem($single.value!);

  showForm.value = true;
};

const deleteItem = (item: ReportModelProps) => {
  getItem(item);
  showDelete.value = true;
};

const handleCloseForm = () => {
  showForm.value = false;
  selected.value = undefined;
};
</script>
