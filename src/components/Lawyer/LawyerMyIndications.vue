<template>
  <div>
    <v-card flat rounded="lg">
      <v-card-title>
        <HeaderPage title="Minhas Indicações" />
        <span class="text-grey">
          Indique juspericia e receba prêmios mais pontos
        </span>
        <v-divider class="mt-2" />
      </v-card-title>
      <v-card-text>
        <v-card flat rounded="lg">
          <v-card-text>
            <v-row>
              <v-col cols="12" lg="4">
                <v-btn
                  color="info"
                  prepend-icon="mdi-account-network-outline"
                  variant="flat"
                  class="text-none"
                  @click="newItem"
                >
                  Indicar cliente
                </v-btn>
              </v-col>
            </v-row>
            <v-row dense class="mt-4">
              <v-col cols="12" lg="3">
                <v-card rounded="lg" height="100%" flat elevation="4">
                  <v-card-title class="d-flex align-center">
                    <v-icon icon="mdi-calendar" start size="25" color="info" />
                    <span class="text-grey text-subtitle-1"> Mês </span>
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <Months @month="handleChangeMonth($event)" />
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col
                cols="12"
                lg="9"
                class="d-flex align-center justify-end"
                style="gap: 1rem"
              >
                <v-card
                  rounded="lg"
                  flat
                  elevation="4"
                  height="100%"
                  width="30%"
                >
                  <v-card-title class="d-flex align-center">
                    <v-icon
                      icon="mdi-arrange-send-backward"
                      start
                      size="25"
                      color="info"
                    />
                    <span class="text-grey text-subtitle-1"> Indicações </span>
                  </v-card-title>
                  <v-card-text class="d-flex align-center justify-center">
                    <v-chip label color="info" variant="flat">
                      <span class="text-h6 font-weight-bold">
                        {{ $totals.totalIndications }}
                      </span>
                    </v-chip>
                  </v-card-text>
                </v-card>
                <v-card
                  rounded="lg"
                  flat
                  elevation="4"
                  height="100%"
                  width="30%"
                >
                  <v-card-title class="d-flex align-center">
                    <v-icon
                      icon="mdi-arrange-send-to-back"
                      start
                      size="25"
                      color="success"
                    />
                    <span class="text-grey text-subtitle-1"> Pontos </span>
                  </v-card-title>
                  <v-card-text class="d-flex align-center justify-center">
                    <v-chip label color="success" variant="flat">
                      <span class="text-h6 font-weight-bold">
                        {{ $totals.totalPoints }}
                      </span>
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <div class="py-4">
          <Table
            title="Lista de indicações"
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
              {{ moment(item.createdAt).format("DD/MM/YYYY") }}
            </template>
            <template #item.expiredAt="{ item }">
              <strong>
                {{
                  item.status === "PENDING"
                    ? moment(item.expiredAt).format("DD/MM/YYYY")
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
import moment from "moment";

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
        icon: "mdi-circle",
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

      const initialDate = moment().startOf("month").format("YYYY-MM-DD");
      const finalDate = moment().endOf("month").format("YYYY-MM-DD");

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
    const initialDate = moment(new Date(currentYear, monthIndex, 1)).format(
      "YYYY-MM-DD"
    );

    // Cria a data final do mês (último dia do mês)
    const finalDate = moment(new Date(currentYear, monthIndex + 1, 0)).format(
      "YYYY-MM-DD"
    );

    // Chame a função de índice com as datas formatadas
    await indicationStore.index({ initialDate, finalDate });
  } finally {
    loading.value = false;
  }
};
</script>
