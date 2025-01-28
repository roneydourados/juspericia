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
            :items="fakeItemsTable"
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
          </Table>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const indicationStore = useUserIndicationStore();

const fakeItemsTable = ref([
  {
    name: "João da Silva",
    date: "19/06/2024",
    status: "Aguardando",
  },
  {
    name: "Maria Souza",
    date: "25/07/2024",
    status: "Concluído",
  },
  {
    name: "Pedro Santos",
    date: "12/08/2024",
    status: "Aguardando",
  },
  {
    name: "Ana Oliveira",
    date: "03/09/2024",
    status: "Em andamento",
  },
  {
    name: "Lucas Pereira",
    date: "18/09/2024",
    status: "Concluído",
  },
  {
    name: "Juliana Costa",
    date: "05/10/2024",
    status: "Aguardando",
  },
  {
    name: "Rafaela Almeida",
    date: "22/10/2024",
    status: "Em andamento",
  },
  {
    name: "Gustavo Rodrigues",
    date: "09/11/2024",
    status: "Concluído",
  },
  {
    name: "Fernanda Carvalho",
    date: "26/11/2024",
    status: "Aguardando",
  },
  {
    name: "Carlos Mendes",
    date: "13/12/2024",
    status: "Em andamento",
  },
]);

const headers = ref([
  {
    title: "Nome",
    align: "start",
    sortable: false,
    key: "name",
  },
  { title: "Data", key: "date" },
  { title: "Status", key: "status" },
]);
</script>
