<template>
  <div>
    <Table
      title="Médicos parceiros"
      :items="$all"
      :headers="headers"
      itle="Médicos parceiros"
      @search="handleSearch($event)"
      @add="showForm = true"
    />
  </div>
  <DialogLoading :dialog="loading" />
  <MedicForm
    width="800"
    title="Médico"
    :show="showForm"
    :data="selected"
    @close="handleCloseForm"
  />
</template>

<script setup lang="ts">
const medicStore = useMedicStore();

const $all = computed(() => medicStore.$all);

const selected = ref<UserProps>();
const loading = ref(false);
const showForm = ref(false);
const headers = ref([
  {
    title: "Nome",
    key: "name",
  },
  {
    title: "Telefone",
    key: "phone",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Ativo",
    key: "active",
  },
  {
    title: "Ações",
    key: "actions",
  },
]);

onMounted(async () => {
  await medicStore.index("");
});

const handleSearch = async (search: string) => {
  loading.value = true;
  try {
    await medicStore.index(search);
  } finally {
    loading.value = false;
  }
};

const handleCloseForm = () => {
  showForm.value = false;
  selected.value = undefined;
};
</script>
