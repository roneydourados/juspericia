<template>
  <div>
    <v-card flat rounded="lg">
      <v-card-title>
        <HeaderPage title="Meus saldos" />
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" lg="3">
            <v-card flat elevation="2" rounded="lg">
              <v-card-title class="text-subtitle-2">
                Saldo em pacotes
              </v-card-title>
              <v-card-text class="d-flex align-center justify-space-between">
                <v-icon
                  icon="mdi-chart-box-multiple-outline"
                  size="25"
                  color="info"
                />
                <div class="d-flex">
                  <span class="text-grey-darken-1" style="font-size: 1.2rem">
                    R$
                  </span>
                  <span class="font-weight-bold ml-2" style="font-size: 1.2rem">
                    3.890,00
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3">
            <v-card flat elevation="2" rounded="lg">
              <v-card-title class="text-subtitle-2"> Créditos </v-card-title>
              <v-card-text class="d-flex align-center justify-space-between">
                <v-icon icon="mdi-cash-100" size="25" color="success" />
                <div class="d-flex">
                  <span class="text-grey-darken-1" style="font-size: 1.2rem">
                    R$
                  </span>
                  <span class="font-weight-bold ml-2" style="font-size: 1.2rem">
                    3.890,00
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3">
            <v-card flat elevation="2" rounded="lg">
              <v-card-title class="text-subtitle-2">
                Total expirar
              </v-card-title>
              <v-card-text class="d-flex align-center justify-space-between">
                <v-icon icon="mdi-currency-usd-off" size="25" color="warning" />
                <div class="d-flex">
                  <span class="text-grey-darken-1" style="font-size: 1.2rem">
                    R$
                  </span>
                  <span class="font-weight-bold ml-2" style="font-size: 1.2rem">
                    3.890,00
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <div class="py-4">
          <Table
            title="Compras"
            :headers="headers"
            :items="fakeItemsTable"
            :show-crud="false"
          >
            <template #item.status="{ item }">
              <span
                class="d-flex align-center"
                :class="
                  item.status === 'available' ? 'text-success' : 'text-error'
                "
              >
                <v-icon
                  :color="item.status === 'available' ? 'success' : 'error'"
                  icon="mdi-circle"
                  size="12"
                  class="mr-1"
                />
                {{ getStatusName(item.status) }}
              </span>
            </template>
            <template #item.type="{ item }">
              <span
                class="d-flex align-center"
                :class="item.type === 'package' ? 'text-info' : 'text-success'"
              >
                <v-icon
                  :color="item.type === 'package' ? 'info' : 'success'"
                  icon="mdi-circle"
                  size="12"
                  class="mr-1"
                />
                {{ getPackageType(item.type) }}
              </span>
            </template>
            <template #item.value="{ item }">
              <strong>{{ amountFormated(item.value, true) }}</strong>
            </template>
          </Table>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const { amountFormated } = useUtils();
const fakeItemsTable = ref([
  {
    status: "available",
    type: "package",
    saleDate: "19/06/2024",
    value: 280,
    expirationDate: "19/06/2024",
  },
  {
    status: "unavailable",
    type: "credit",
    saleDate: "20/06/2024",
    value: 150,
    expirationDate: "20/06/2024",
  },
  {
    status: "available",
    type: "package",
    saleDate: "21/06/2024",
    value: 400,
    expirationDate: "21/06/2024",
  },
  {
    status: "unavailable",
    type: "credit",
    saleDate: "22/06/2024",
    value: 200,
    expirationDate: "22/06/2024",
  },
  {
    status: "available",
    type: "package",
    saleDate: "23/06/2024",
    value: 350,
    expirationDate: "23/06/2024",
  },
]);

const headers = ref([
  {
    title: "Status",
    align: "start",
    sortable: false,
    key: "status",
  },
  { title: "Tipo", key: "type" },
  { title: "Data da compra", key: "saleDate" },
  { title: "Valor", key: "value" },
  { title: "Data de expiração", key: "expirationDate" },
]);

const getStatusName = (status: string) => {
  return status === "available" ? "Disponível" : "Indisponível";
};

const getPackageType = (type: string) => {
  return type === "package" ? "Pacote" : "Crédito";
};
</script>
