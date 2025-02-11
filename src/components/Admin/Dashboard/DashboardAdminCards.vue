<template>
  <v-row dense>
    <v-col cols="12" lg="3">
      <DashboardCard
        title="Pendente"
        icon="mdi-currency-usd"
        value="489.299,33"
        icon-color="warning"
        elevation="4"
      />
    </v-col>
    <v-col cols="12" lg="3">
      <DashboardCard
        title="Recebido"
        icon="mdi-currency-usd"
        value="327.853,33"
        icon-color="success"
        elevation="4"
      />
    </v-col>
    <v-col cols="12" lg="3">
      <DashboardCard
        title="Novos clientes"
        icon="mdi-account-group-outline"
        value="120"
        icon-color="info"
        elevation="4"
      />
    </v-col>
    <v-col cols="12" lg="3">
      <DashboardCard
        title="Total de clientes"
        icon="mdi-account-group-outline"
        value="875"
        icon-color="success"
        elevation="4"
      />
    </v-col>
  </v-row>
  <v-row dense>
    <v-col cols="12" lg="3">
      <DashboardCard
        title="Pacotes a vencer"
        icon="mdi-package-variant"
        value="230"
        icon-color="success"
        elevation="4"
      />
    </v-col>
    <v-col cols="12" lg="3">
      <DashboardCard
        title="40 dias última consulta"
        icon="mdi-file-document-edit-outline"
        value="10"
        icon-color="info"
        elevation="4"
      />
    </v-col>
  </v-row>
  <DashboardAdminPendentSales
    :show="showPendentSales"
    @close="showPendentSales = false"
    width="900"
  />
  <DashboardAdminPackageDue
    :show="showPackageDue"
    @close="showPackageDue = false"
    width="900"
  />
  <DashboardAdminClientsLastQuery
    :show="showClientsLastQuery"
    @close="showClientsLastQuery = false"
    width="900"
  />
</template>

<script setup lang="ts">
const showPendentSales = ref(false);
const showPackageDue = ref(false);
const showClientsLastQuery = ref(false);
</script>
