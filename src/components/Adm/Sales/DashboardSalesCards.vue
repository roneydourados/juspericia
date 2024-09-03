<template>
  <v-row dense>
    <v-col cols="12" lg="3">
      <v-card flat rounded="lg" min-height="150" elevation="8">
        <v-card-title class="d-flex align-center py-4" style="gap: 0.5rem">
          <v-icon icon="mdi-currency-usd" color="info" size="30" />
          <div class="text-h6 font-weight-bold">Pendente</div>
        </v-card-title>
        <v-card-text
          class="text-h5 d-flex align-center justify-end pa-4"
          style="gap: 0.5rem"
        >
          <span class="text-blue-grey font-weight-bold text-h5">R$</span>
          <span class="font-weight-bold text-h4">489.299,33</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card flat rounded="lg" min-height="150" elevation="8">
        <v-card-title class="d-flex align-center py-4" style="gap: 0.5rem">
          <v-icon icon="mdi-currency-usd" color="success" size="30" />
          <div class="text-h6 font-weight-bold">Recebido</div>
        </v-card-title>
        <v-card-text
          class="text-h5 d-flex align-center justify-end pa-4"
          style="gap: 0.5rem"
        >
          <span class="text-blue-grey font-weight-bold text-h5">R$</span>
          <span class="font-weight-bold text-h4">489.299,33</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card flat rounded="lg" min-height="150" elevation="8">
        <v-card-title class="d-flex align-center py-4" style="gap: 0.5rem">
          <v-icon icon="mdi-account-group-outline" color="info" size="30" />
          <div class="text-h6 font-weight-bold">Novos clientes</div>
        </v-card-title>
        <v-card-text
          class="text-h5 d-flex align-center justify-end pa-4"
          style="gap: 0.5rem"
        >
          <span class="font-weight-bold text-h4">120</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card flat rounded="lg" min-height="150" elevation="8">
        <v-card-title class="d-flex align-center py-4" style="gap: 0.5rem">
          <v-icon icon="mdi-account-group-outline" color="success" size="30" />
          <div class="text-h6 font-weight-bold">Total clientes</div>
        </v-card-title>
        <v-card-text
          class="text-h5 d-flex align-center justify-end pa-4"
          style="gap: 0.5rem"
        >
          <span class="font-weight-bold text-h4">875</span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts"></script>
