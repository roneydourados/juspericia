<template>
  <div class="py-8 px-4">
    <v-row>
      <v-col cols="12" lg="6">
        <SelectSearchAtendent
          v-model="filters.atendent"
          @update:model-value="getAtendentMedics"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="6" class="d-flex flex-column">
        <div class="d-flex justify-center">
          <Button variant="outlined" @click="handleAddMedics">
            <span class="text-caption"> Enviar selecionados </span>
            <v-icon icon="mdi-arrow-right" color="colorIcon" end />
          </Button>
        </div>
        <Table
          v-model="selectedNotAssociated"
          title="Médicos Não Associados"
          :headers="headersMedicNotAssociated"
          :items="$medicsAtendent?.medics"
          :show-crud="false"
          is-virtual
          show-select
        />
      </v-col>
      <v-col cols="12" lg="6" class="d-flex flex-column">
        <div class="d-flex justify-center">
          <Button variant="outlined" @click="handleRemoveMedics">
            <v-icon icon="mdi-arrow-left" color="colorIcon" start />
            <span class="text-caption"> Remover selecionados </span>
          </Button>
        </div>
        <Table
          v-model="selectedAssociated"
          title="Médicos Associados"
          :headers="headersMedicAssociated"
          :items="$medicsAtendent?.associations"
          :show-crud="false"
          is-virtual
          show-select
        />
      </v-col>
    </v-row>
    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
const attendentMedicStore = useAtendentMedicStore();

const filters = ref({
  atendent: undefined as UserProps | undefined,
});

const loading = ref(false);
const selectedAssociated = ref([]);
const selectedNotAssociated = ref([]);

const headersMedicAssociated = ref([
  {
    title: "Nome do médico",
    key: "medic.name",
  },
  {
    title: "Especialidade",
    key: "medic.medicalSpecialty.medicalSpecialty",
  },
]);

const headersMedicNotAssociated = ref([
  {
    title: "Nome do médico",
    key: "name",
  },
  {
    title: "Especialidade",
    key: "medicalSpecialty.medicalSpecialty",
  },
]);

const $medicsAtendent = computed(() => attendentMedicStore.$all);

const getAtendentMedics = async () => {
  if (!filters.value.atendent) return;
  loading.value = true;
  try {
    await attendentMedicStore.index(filters.value.atendent.id!);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleRemoveMedics = async () => {
  if (!filters.value || !filters.value.atendent) return;
  loading.value = true;
  try {
    // Aguardar um tick para garantir que a reatividade foi processada
    await nextTick();

    if (selectedAssociated.value.length === 0) return;

    const associations = $medicsAtendent.value?.associations || [];
    const selectedItems = selectedAssociated.value;

    // Se todos os itens foram selecionados, limpar todas as associações
    if (
      selectedItems.length >= associations.length &&
      associations.length > 0
    ) {
      selectedAssociated.value = [];
      selectedNotAssociated.value = [];

      await attendentMedicStore.clearAssociations(filters.value.atendent.id!);
      await getMedics(); // Atualizar a lista após limpar
      return;
    }

    // Caso contrário, filtrar os que não foram selecionados
    const payload = associations.filter(
      (item: any) =>
        !selectedItems.some(
          (sel: any) => sel.id === item.id || sel.medicId === item.medicId
        )
    );

    // Montar o payload dos que não foram selecionados
    const payloadData = payload.map((item: any) => ({
      atendentId: filters.value.atendent?.id!,
      medicId: item.medicId!,
    }));

    console.log("Debug - payloadData:", payloadData);

    // Enviar o payload para o back
    await attendentMedicStore.setMedics(payloadData);

    // Atualizar a lista
    await getMedics();

    selectedAssociated.value = [];
    selectedNotAssociated.value = [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleAddMedics = async () => {
  if (!filters.value || !filters.value.atendent) return;

  loading.value = true;
  try {
    //caso não selecione nenhum médico não assosiado
    if (selectedNotAssociated.value.length === 0) return;

    //montar o payload dos médicos não assosciados selecionados
    let payloadData = selectedNotAssociated.value.map((item: any) => ({
      atendentId: filters.value.atendent?.id!,
      medicId: item.id!,
    }));

    //adicionar os que já tem associado, porque quando vai para o back é totalmente refeito
    payloadData = [
      ...payloadData,
      ...($medicsAtendent.value?.associations || []).map((item: any) => ({
        atendentId: filters.value.atendent?.id!,
        medicId: item.medicId!,
      })),
    ];

    //enviar o payload para o back
    await attendentMedicStore.setMedics(payloadData);

    //atualizar a lista
    await getMedics();

    selectedAssociated.value = [];
    selectedNotAssociated.value = [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const getMedics = async () => {
  if (!filters.value || !filters.value.atendent) return;
  loading.value = true;
  try {
    await attendentMedicStore.index(filters.value.atendent.id!);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
