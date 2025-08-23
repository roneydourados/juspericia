<template>
  <CardBlur :hover="false">
    <HeaderPage title="Dados do paciente" font-size="1.2rem" />
    <v-toolbar color="#fff" class="px-4">
      <v-spacer />
      <Button
        variant="outlined"
        color="grey"
        class="text-none"
        size="small"
        @click="router.back()"
      >
        <v-icon icon="mdi-arrow-left" color="darkText" start />
        <span class="text-darkText text-caption"> Voltar </span>
      </Button>
      <Button
        variant="outlined"
        class="text-none ml-2"
        @click="handleGetEditItem"
        size="small"
        color="grey"
      >
        <v-icon icon="mdi-pencil-outline" color="colorIcon" start />
        <span class="text-caption text-primary"> Editar </span>
      </Button>
    </v-toolbar>

    <Tabs v-model="tab" :tabs="tabs" @update:model-value="handleTab">
      <template #content>
        <PatientInfoData v-if="tab === 1" />
        <PatientSolicitations v-if="tab === 2" />
        <PatientFiles v-if="tab === 3" />
      </template>
    </Tabs>
  </CardBlur>
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
const patientStore = usePatientStore();
//const fileStore = useFileStore();
//const storeConsultation = useSolicitationConsultationStore();
const router = useRouter();
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
  if (!$single.value) {
    return;
  }

  loading.value = true;
  try {
    switch (tab.value) {
      case 1:
        //await patientStore.getSingle();
        break;
      case 2:
        await patientStore.getSolicitations($single.value.publicId!);
        break;
      // case 3:
      //   loading.value = true;
      //   try {
      //     await fileStore.index({
      //       fileCategory: "patient",
      //       ownerId: $single.value?.id!,
      //     });
      //   } finally {
      //     loading.value = false;
      //   }
      //   break;
    }
  } finally {
    loading.value = false;
  }
};
</script>
