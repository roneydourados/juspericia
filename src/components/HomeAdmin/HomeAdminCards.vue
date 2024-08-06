<template>
  <v-row dense>
    <v-col cols="12" lg="3">
      <v-card flat rounded="lg" min-height="150" elevation="8">
        <v-card-title class="d-flex align-center py-4" style="gap: 0.5rem">
          <IconDashboardLoanSVG height="35" color="#2196F3" />
          <div class="mt-n2">Pendente</div>
        </v-card-title>
        <v-card-text
          class="text-h5 d-flex align-center justify-end"
          style="gap: 0.5rem"
        >
          <span class="text-blue-grey font-weight-bold">R$</span>
          <span class="font-weight-bold">489.299,33</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card flat rounded="lg" min-height="150" elevation="8">
        <v-card-title class="d-flex align-center py-4" style="gap: 0.5rem">
          <IconDashboardLoanSVG
            height="35"
            color="rgb(var(--v-theme-primary)) !important"
          />
          <div class="mt-n2">Recebido</div>
        </v-card-title>
        <v-card-text
          class="text-h5 d-flex align-center justify-end"
          style="gap: 0.5rem"
        >
          <span class="text-blue-grey font-weight-bold">R$</span>
          <span class="font-weight-bold">489.299,33</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card flat rounded="lg" min-height="150" elevation="8">
        <v-card-title class="d-flex align-center py-4" style="gap: 0.5rem">
          <IconDashboardClientsNewSVG
            height="35"
            color="rgb(var(--v-theme-info)) !important"
          />
          <div class="mt-n2">Novos clientes</div>
        </v-card-title>
        <v-card-text
          class="text-h5 d-flex align-center justify-end"
          style="gap: 0.5rem"
        >
          <span class="font-weight-bold">20</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card flat rounded="lg" min-height="150" elevation="8">
        <v-card-title class="d-flex align-center py-4" style="gap: 0.5rem">
          <IconDashboardClientsSVG
            height="35"
            color="rgb(var(--v-theme-success)) !important"
          />
          <div class="mt-n2">Total Clientes</div>
        </v-card-title>
        <v-card-text
          class="text-h5 d-flex align-center justify-end"
          style="gap: 0.5rem"
        >
          <span class="font-weight-bold">120</span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts"></script>
