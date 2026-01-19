<template>
  <v-row>
    <v-col cols="12" lg="6">
      <CardLeftBorderColor
        title="Vendas Pendente"
        color="#c8e040"
        icon="mdi-currency-usd"
        icon-color="warning"
      >
        <div
          class="text-colorTextPrimary w-100"
          style="font-size: 1.88rem; font-weight: 600"
        >
          {{ amountFormated($dash?.totalPending ?? 0, true) }}
        </div>
      </CardLeftBorderColor>
    </v-col>
    <v-col cols="12" lg="6">
      <CardLeftBorderColor
        title="Vendas Confirmadas"
        color="#0F91C3"
        icon="mdi-currency-usd"
        icon-color="success"
      >
        <div
          class="text-colorTextPrimary"
          style="font-size: 1.88rem; font-weight: 600"
        >
          {{ amountFormated($dash?.totalConfirmed ?? 0, true) }}
        </div>
      </CardLeftBorderColor>
    </v-col>
    <v-col cols="12" lg="3">
      <CardLeftBorderColor
        title="Novos Clientes"
        :color="`rgb(var(--v-theme-tabbgcolor))`"
      >
        <div
          class="text-colorTextPrimary"
          style="font-size: 1.88rem; font-weight: 600"
        >
          {{ $dash?.newClients ? $dash?.newClients.toString() : "0" }}
        </div>
      </CardLeftBorderColor>
    </v-col>
    <v-col cols="12" lg="3">
      <CardLeftBorderColor
        title="Total de Clientes"
        :color="`rgb(var(--v-theme-tabbgcolor))`"
        icon="mdi-account-group-outline"
      >
        <div
          class="text-colorTextPrimary"
          style="font-size: 1.88rem; font-weight: 600"
        >
          {{ $dash?.totalClients ? $dash?.totalClients.toString() : "0" }}
        </div>
      </CardLeftBorderColor>
    </v-col>
    <v-col cols="12" lg="3">
      <CardLeftBorderColor
        title="Qtde Pacotes a vencer"
        :color="`rgb(var(--v-theme-tabbgcolor))`"
        icon="mdi-package-variant"
      >
        <div
          class="text-colorTextPrimary"
          style="font-size: 1.88rem; font-weight: 600"
        >
          {{ $dash?.credisToExpire.toString() }}
        </div>
      </CardLeftBorderColor>
    </v-col>
    <v-col cols="12" lg="3">
      <CardLeftBorderColor
        title="40 dias última consulta"
        :color="`rgb(var(--v-theme-tabbgcolor))`"
        icon="mdi-calendar-month"
      >
        <div
          class="text-colorTextPrimary"
          style="font-size: 1.88rem; font-weight: 600"
        >
          {{ $dash?.client40DaysSolicitation.toString() }}
        </div>
      </CardLeftBorderColor>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const dash = useUserAdminStore();
const { amountFormated } = useUtils();

const $dash = computed(() => dash.$dashboard);

// const showPendentSales = ref(false);
// const showPackageDue = ref(false);
// const showClientsLastQuery = ref(false);
</script>
