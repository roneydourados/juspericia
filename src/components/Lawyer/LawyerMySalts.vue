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
                Saldo Créditos
              </v-card-title>
              <v-card-text class="d-flex align-center justify-space-between">
                <v-icon icon="mdi-cash-100" size="25" color="success" />
                <div class="d-flex">
                  <span class="text-grey-darken-1" style="font-size: 1.2rem">
                    R$
                  </span>
                  <span class="font-weight-bold ml-2" style="font-size: 1.2rem">
                    {{ amountFormated($totals.total, false) }}
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" lg="3">
            <v-card flat elevation="2" rounded="lg">
              <v-card-title class="text-subtitle-2">
                Total expirado
              </v-card-title>
              <v-card-text class="d-flex align-center justify-space-between">
                <v-icon icon="mdi-currency-usd-off" size="25" color="warning" />
                <div class="d-flex">
                  <span class="text-grey-darken-1" style="font-size: 1.2rem">
                    R$
                  </span>
                  <span class="font-weight-bold ml-2" style="font-size: 1.2rem">
                    {{ amountFormated($totals.totalExpired, false) }}
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
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
                    {{
                      amountFormated(
                        $totals.totalExpired + $totals.total,
                        false
                      )
                    }}
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
            :items="$salts"
            :show-crud="false"
          >
            <template #item.status="{ item }">
              <span
                class="d-flex align-center"
                :class="`text-${getStatusName(item).color}`"
              >
                <v-icon
                  :color="getStatusName(item).color"
                  icon="mdi-circle"
                  size="12"
                  class="mr-1"
                />
                {{ getStatusName(item).text }}
              </span>
            </template>
            <template #item.salt="{ item }">
              <strong>{{ amountFormated(item.salt, true) }}</strong>
            </template>
            <template #item.expiredAt="{ item }">
              <strong>{{ moment(item.expiredAt).format("DD/MM/YYYY") }}</strong>
            </template>
            <template #item.createdAt="{ item }">
              <strong>{{ moment(item.createdAt).format("DD/MM/YYYY") }}</strong>
            </template>
            <template #item.actions="{ item }">
              <v-btn
                variant="text"
                color="info"
                icon
                @click="handleDetails(item)"
              >
                <v-icon icon="mdi-dots-vertical"></v-icon>
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                >
                  Detalhes
                </v-tooltip>
              </v-btn>
            </template>
          </Table>
        </div>
      </v-card-text>
    </v-card>
    <LawyerMySaltsDetails v-model="showDetails" />
  </div>
</template>

<script setup lang="ts">
import moment from "moment";

const saltCredit = useUserCreditSaltStore();
const { amountFormated } = useUtils();

const $salts = computed(() => saltCredit.$all);
const $totals = computed(() => {
  const currentDate = moment();
  return {
    total: $salts.value.reduce(
      (acc, item) =>
        !moment(item.expiredAt).isBefore(currentDate)
          ? acc + Number(item.salt ?? 0)
          : acc,
      0
    ),
    totalExpired: $salts.value.reduce(
      (acc, item) =>
        moment(item.expiredAt).isBefore(currentDate)
          ? acc + Number(item.salt ?? 0)
          : acc,
      0
    ),
  };
});

const showDetails = ref(false);
const headers = ref([
  { title: "Descrição", key: "description" },
  {
    title: "Status",
    align: "start",
    sortable: false,
    key: "status",
  },
  { title: "Data da compra", key: "createdAt" },
  { title: "Data de expiração", key: "expiredAt" },
  { title: "Saldo", key: "salt" },
  { title: "Ações", key: "actions" },
]);

const getStatusName = (item: UserCreditSalt) => {
  const currentDate = moment();

  switch (item.status) {
    case "active":
      // se estiver ativo, então verificar se não expirou
      return {
        text: moment(item.expiredAt).isBefore(currentDate)
          ? "Expirado"
          : "Disponível",
        color: moment(item.expiredAt).isBefore(currentDate)
          ? "warning"
          : "success",
      };
    case "pending":
      return {
        text: "Pendente",
        color: "warning",
      };
    case "canceled":
      return {
        text: "Cancelado",
        color: "error",
      };
    default:
      return {
        text: "Indefinido",
        color: "grey",
      };
  }
};

const handleDetails = async (item: UserCreditSalt) => {
  await saltCredit.show(item.publicId!);
  showDetails.value = true;
};
</script>
