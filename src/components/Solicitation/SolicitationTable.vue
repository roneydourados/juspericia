<template>
  <v-card v-if="!showForm" flat rounded="lg" color="transparent" class="px-6">
    <v-card-title class="mb-12 d-flex align-center justify-space-between">
      <span class="font-weight-bold"> Solicitações </span>

      <v-btn
        class="text-none"
        color="primary"
        size="small"
        prepend-icon="mdi-plus"
        @click="showForm = true"
      >
        Nova solicitação
      </v-btn>
    </v-card-title>

    <v-tabs
      v-model="tab"
      :grow="mobile"
      @update:model-value="handleChangeTable"
    >
      <v-tab :value="1" class="text-none">
        <v-icon icon="mdi-file-clock-outline" size="24" start />
        <span v-if="!mobile"> Pendentes </span>
      </v-tab>
      <v-tab :value="2" class="text-none">
        <v-icon icon="mdi-file-check-outline" size="24" start />
        <span v-if="!mobile"> Agendadas </span>
      </v-tab>
      <v-tab :value="3" class="text-none">
        <v-icon icon="mdi-calendar-month-outline" size="24" start />
        <span v-if="!mobile">Finalizadas </span>
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-card-text>
      <v-row v-for="item in $all" :key="item.id" dense>
        <v-col cols="12">
          <SolicitationTableItem
            :solicitation="item"
            @edit="getItemEdit($event)"
          />
        </v-col>
      </v-row>
      <EmptyContent v-if="!$all" />
    </v-card-text>
  </v-card>

  <SolicitationForm
    v-else
    @close="handleCloseForm"
    :show="showForm"
    :data="selected"
  />
  <DialogLoading :dialog="loading" />
  <!-- <pre>{{ $all }}</pre> -->
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const storeConsultation = useSolicitationConsultationStore();
const $all = computed(() => storeConsultation.$all);
const tab = ref(1);
const showForm = ref(false);
const loading = ref(false);
const selected = ref<SolicitationConsultationProps>();

onMounted(async () => {
  await search("");
});

const handleChangeTable = async () => {
  await search("");
};

const search = async (value: string) => {
  loading.value = true;
  try {
    await storeConsultation.index(value);
  } finally {
    loading.value = false;
  }
};

const getItemEdit = async (item: SolicitationConsultationProps) => {
  await storeConsultation.show(item.id!);
  selected.value = storeConsultation.$single;
  showForm.value = true;
};

const handleCloseForm = () => {
  showForm.value = false;
  selected.value = undefined;
};
</script>
