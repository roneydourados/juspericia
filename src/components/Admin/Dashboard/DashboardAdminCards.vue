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
</template>

<script setup lang="ts"></script>
