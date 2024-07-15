<template>
  <v-card flat rounded="lg">
    <v-card-title class="pa-4 mb-8">
      <v-tabs
        v-model="tab"
        color="primary"
        :grow="mobile"
        @update:model-value="handleChangeTable"
      >
        <v-tab :value="1" class="text-none">
          <v-icon v-if="mobile" icon="mdi-check-decagram-outline" size="30" />
          <span v-else> Hoje </span>
        </v-tab>
        <v-tab :value="2" class="text-none">
          <v-icon v-if="mobile" icon="mdi-chart-line-variant" size="30" />
          <span v-else> Semana </span>
        </v-tab>
        <v-tab :value="3" class="text-none">
          <v-icon v-if="mobile" icon="mdi-calendar-month-outline" size="30" />
          <span v-else> Mês </span>
        </v-tab>
        <v-tab :value="4" class="text-none">
          <v-icon
            v-if="mobile"
            icon="mdi-chart-bell-curve-cumulative"
            size="30"
          />
          <span v-else> Ano </span>
        </v-tab>
      </v-tabs>
      <v-divider></v-divider>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" lg="6">
          <HomeAdminYearbBillingChart />
        </v-col>
        <v-col cols="12" lg="6">
          <HomeAdminYearbBillingPaymentFormChart />
        </v-col>
      </v-row>
      <div class="py-8">
        <HomeAdminCards />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const tab = ref(1);

const handleChangeTable = () => {
  console.log(tab.value);
};
</script>
