<template>
  <v-card max-width="1200" class="mx-auto">
    <v-toolbar color="primary" title="Dados do paciente" class="px-4">
      <v-spacer />
      <v-btn
        variant="text"
        class="text-none"
        prepend-icon="mdi-arrow-left"
        @click="$router.back()"
      >
        Voltar
      </v-btn>
      <v-btn
        variant="text"
        class="text-none"
        prepend-icon="mdi-pencil-outline"
        @click="handleGetEditItem"
      >
        Editar
      </v-btn>
    </v-toolbar>

    <Tabs v-model="tab" :tabs="tabs" @update:model-value="handleTab">
      <template #content>
        <PatientInfoData v-if="tab === 1" />
        <PatientSolicitations v-if="tab === 2" />
        <PatientFiles v-if="tab === 3" />
      </template>
    </Tabs>
  </v-card>
  <PatientForm
    :show="showForm"
    title="Paciente"
    @close="handleCloseForm"
    :data="itemSelected"
    width="800"
  />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const patientStore = usePatientStore();
const fileStore = useFileStore();
//const storeConsultation = useSolicitationConsultationStore();
//const rounter = useRouter();
const itemSelected = ref<PatientProps>();
const tab = ref(1);
const showForm = ref(false);
const loading = ref(false);
const tabs = ref<TabProps[]>([
  {
    title: "Dados cadastrais",
    icon: "mdi-account-badge-outline",
  },
  {
    title: "Consultas e serviços",
    icon: "mdi-note-search-outline",
  },
  {
    title: "Arquivos/Documentos",
    icon: "mdi-file-compare",
  },
]);

const $single = computed(() => patientStore.$single);

const handleCloseForm = () => {
  itemSelected.value = undefined;
  showForm.value = false;
};

const handleGetEditItem = () => {
  itemSelected.value = $single.value;
  showForm.value = true;
};

const handleTab = async () => {
  switch (tab.value) {
    case 1:
      //await patientStore.getSingle();
      break;
    case 2:
      loading.value = true;
      try {
        await patientStore.getSolicitations(Number($single.value?.id ?? 0));
      } finally {
        loading.value = false;
      }

      break;
    case 3:
      loading.value = true;
      try {
        await fileStore.index({
          fileCategory: "patient",
          ownerId: $single.value?.id!,
        });
      } finally {
        loading.value = false;
      }
      break;
  }
};
</script>
