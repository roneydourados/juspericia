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
          <v-card-title>
            <HeaderPage title="Indicações realizadas" />
          </v-card-title>
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
              <v-col cols="12" lg="8">
                <v-row dense justify="end">
                  <v-col cols="12" lg="3">
                    <v-card rounded="lg" flat elevation="4" height="100">
                      <v-card-title class="d-flex align-center">
                        <v-icon
                          icon="mdi-arrange-send-backward"
                          start
                          size="25"
                          color="info"
                        />
                        <span class="text-grey text-subtitle-1">
                          Indicações
                        </span>
                      </v-card-title>
                      <v-card-text class="d-flex align-center justify-center">
                        <!-- <span class="text-h5 font-weight-bold">4</span> -->
                        <v-chip label color="info" variant="flat">
                          <span class="text-h6 font-weight-bold">4</span>
                        </v-chip>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" lg="3">
                    <v-card rounded="lg" flat elevation="4" height="100">
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
                          <span class="text-h6 font-weight-bold">123</span>
                        </v-chip>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
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
                  :color="item.status === 'Concluído' ? 'success' : 'warning'"
                  icon="mdi-circle"
                  size="12"
                  class="mr-1"
                />
                {{ item.status }}
              </span>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon
                color="orange"
                variant="text"
                size="small"
                @click="getItemEdit(item)"
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
  { title: "Status", key: "status" },
  { title: "Pontos", key: "points" },
  { title: "Ações", key: "actions" },
]);

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
</script>
