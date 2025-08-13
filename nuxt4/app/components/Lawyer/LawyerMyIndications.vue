<template>
  <div>
    <v-card flat rounded="lg">
      <v-card-title class="d-flex justify-space-between pa-4">
        <HeaderPage title="Minhas Indicações" font-size="1.5rem" />
        <Button
          color="primary"
          variant="flat"
          class="text-none"
          @click="newItem"
        >
          <v-icon icon="mdi-account-network-outline" color="colorIcon" start />
          <span class="text-caption"> Indicar cliente </span>
        </Button>
      </v-card-title>
      <v-card-text>
        <div class="d-flex justify-space-between">
          <Months @month="handleChangeMonth($event)" />

          <div class="d-flex align-center" style="gap: 0.5rem">
            <v-card variant="outlined" rounded="xl">
              <v-card-title>
                <div class="d-flex" style="gap: 1rem">
                  <span class="text-darkText text-subtitle-1">
                    Indicações
                  </span>
                  <v-chip color="primary" variant="flat">
                    <span class="text-subtitle-1 font-weight-bold">
                      {{ $totals.totalIndications }}
                    </span>
                  </v-chip>
                </div>
              </v-card-title>
            </v-card>

            <v-card variant="outlined" rounded="xl">
              <v-card-title>
                <div class="d-flex" style="gap: 1rem">
                  <span class="text-darkText text-subtitle-1"> Pontos </span>
                  <v-chip color="green" variant="flat">
                    <span class="text-subtitle-1 font-weight-bold">
                      {{ $totals.totalPoints }}
                    </span>
                  </v-chip>
                </div>
              </v-card-title>
            </v-card>
          </div>
        </div>
        <div class="py-4">
          <Table
            title="Lista de indicações"
            font-size="1.5rem"
            :items="$all"
            :headers="headers"
            :items-per-page="5"
            :show-crud="false"
          >
            <template #item.status="{ item }">
              <span class="d-flex align-center">
                <v-icon
                  :color="getStatusData(item.status).color"
                  :icon="getStatusData(item.status).icon"
                  start
                />
                {{ getStatusData(item.status).name }}
              </span>
            </template>
            <template #item.createdAt="{ item }">
              {{ dayjs(item.createdAt).format("DD/MM/YYYY") }}
            </template>
            <template #item.expiredAt="{ item }">
              <strong>
                {{
                  item.status === "PENDING"
                    ? dayjs(item.expiredAt).format("DD/MM/YYYY")
                    : ""
                }}
              </strong>
            </template>
            <template #item.points="{ item }">
              <v-chip color="success" variant="flat" rounded="xl">
                <strong>
                  {{ item.points }}
                </strong>
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon
                color="orange"
                variant="text"
                size="small"
                @click="getItemEdit(item)"
                :disabled="item.status !== 'PENDING'"
              >
                <v-icon icon="mdi-pencil-outline" size="20"></v-icon>
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                >
                  Editar
                </v-tooltip>
              </v-btn>
              <v-btn
                icon
                color="error"
                variant="text"
                size="small"
                @click="getItemDelete(item)"
                :disabled="item.status !== 'PENDING'"
              >
                <v-icon icon="mdi-delete-outline" size="20"></v-icon>
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                >
                  Apagar
                </v-tooltip>
              </v-btn>
            </template>
          </Table>
        </div>
      </v-card-text>
    </v-card>
    <LawyerMyIndicationsForm v-model="showForm" :data="selected" />
    <DialogLoading :dialog="loading" />
    <Dialog
      title="Confirme"
      :dialog="showDelete"
      @cancel="showDelete = false"
      @confirm="handleDeleteIitem"
      show-cancel
    >
      <span>
        Apagar indicação de
        <strong>{{ selected?.name }}</strong> ?
      </span>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const indicationStore = useUserIndicationStore();

const $all = computed(() => indicationStore.$all);
const $totals = computed(() => {
  const totalPoints = indicationStore.$all.reduce(
    (acc, item) => acc + item.points!,
    0
  );
  return {
    totalIndications: indicationStore.$all.length,
    totalPoints,
  };
});
const selected = ref<UserIndicationProps>();
const showForm = ref(false);
const showDelete = ref(false);
const loading = ref(false);

const headers = ref([
  {
    title: "Nome",
    align: "start",
    sortable: false,
    key: "name",
  },
  {
    title: "Email",
    align: "start",
    sortable: false,
    key: "email",
  },
  { title: "Data", key: "createdAt" },
  { title: "Expira em", key: "expiredAt" },

  { title: "Status", key: "status" },
  { title: "Pontos", key: "points" },
  { title: "Ações", key: "actions" },
]);

const getStatusData = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        color: "warning",
        icon: "mdi-circle-outline",
        name: "Pendente",
      };
    case "CONCLUDED":
      return {
        color: "info",
        icon: "mdi-check-circle",
        name: "Concluído",
      };

    default:
      return {
        color: "warning",
        icon: "mdi-circle-outline",
        name: "Pendente",
      };
  }
};

const newItem = () => {
  selected.value = undefined;
  showForm.value = true;
};

const getItemEdit = (item: UserIndicationProps) => {
  selected.value = item;
  showForm.value = true;
};

const getItemDelete = (item: UserIndicationProps) => {
  selected.value = item;
  showDelete.value = true;
};

const handleDeleteIitem = async () => {
  showDelete.value = false;
  if (selected.value) {
    loading.value = true;
    try {
      await indicationStore.destroy(selected.value.publicId!);

      const initialDate = dayjs().startOf("month").format("YYYY-MM-DD");
      const finalDate = dayjs().endOf("month").format("YYYY-MM-DD");

      await indicationStore.index({ initialDate, finalDate });
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
      selected.value = undefined;
    }
  }
};

const handleChangeMonth = async (monthIndex: number) => {
  loading.value = true;
  try {
    // Pega o ano atual
    const currentYear = new Date().getFullYear();

    // Cria a data inicial do mês (primeiro dia do mês)
    const initialDate = dayjs(new Date(currentYear, monthIndex, 1)).format(
      "YYYY-MM-DD"
    );

    // Cria a data final do mês (último dia do mês)
    const finalDate = dayjs(new Date(currentYear, monthIndex + 1, 0)).format(
      "YYYY-MM-DD"
    );

    // Chame a função de índice com as datas formatadas
    await indicationStore.index({ initialDate, finalDate });
  } finally {
    loading.value = false;
  }
};
</script>
