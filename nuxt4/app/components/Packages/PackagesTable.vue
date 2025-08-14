<template>
  <v-card flat rounded="lg" color="transparent">
    <v-card-title
      class="d-flex flex-wrap align-center justify-space-between pa-4"
      style="gap: 1rem"
    >
      <strong style="font-size: 1.2rem">Cadastro de pacote de consultas</strong>
      <SelectInput
        v-model="search"
        :items="itensSearch"
        item-title="text"
        item-value="value"
        label="Buscar por"
        dense
        outlined
        hide-details
        @update:model-value="handleSearch"
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
    </v-card-title>
    <v-card-text class="pa-4">
      <v-row dense>
        <v-col
          v-for="consultation in $all"
          cols="12"
          lg="4"
          :key="consultation.id"
        >
          <PackageCard
            :item="consultation"
            @update-status="search = 'active'"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <PackagesForm
    title="Pacote de serivços"
    :show="showForm"
    @close="handleCloseForm"
    width="600"
  />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const consutationPackage = useServicePackageStore();
const router = useRouter();

const $all = computed(() => consutationPackage.$all);

const search = ref("active");
const itensSearch = ref([
  {
    text: "Ativo",
    value: "active",
  },
  {
    text: "Deletado",
    value: "deleted",
  },
]);
const showForm = ref(false);
const loading = ref(false);

const handleCloseForm = () => {
  showForm.value = false;
};

const handleSearch = async () => {
  loading.value = true;
  try {
    await consutationPackage.index({
      name: "",
      status: search.value,
    });
  } finally {
    loading.value = false;
  }
};
</script>
