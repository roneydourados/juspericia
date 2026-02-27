<template>
  <div class="pa-12">
    <HomeStart />
    <CardMenu :cardItems="cardItems" />
    <!-- Esses dois cards são para mostrar os laudos médicos pendentes de laudo e de assinatura -->
    <v-row>
      <v-col cols="12" lg="4">
        <CardBlur @click="navigateTo('/medical-report')" height="100%">
          <template #content>
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" :color="!$medicDashboard || Number($medicDashboard.totalPending) === 0 ? 'colorIcon' : 'red'">
                <v-icon
                  icon="mdi-clipboard-account-outline"
                  size="32"
                  color="white"
                />
              </v-avatar>
              <v-card-title>
                <span
                  class="font-weight-bold"
                  :class="!$medicDashboard || Number($medicDashboard.totalPending) === 0 ? 'text-colorTextPrimary' : 'text-red'"
                  style="font-size: 1.2rem"
                >
                  Pendente de laudo
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                Você tem <div style="font-size: 1.5rem; font-weight: bold;">{{ $medicDashboard?.totalPending }}</div> laudos médicos para
                confecionar.
              </p>
            </div>
          </template>
        </CardBlur>
      </v-col>
      <v-col cols="12" lg="4">
        <CardBlur @click="navigateTo('/medical-report')" height="100%">
          <template #content>
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" :color="!$medicDashboard || Number($medicDashboard.totalPendingSign) === 0 ? 'colorIcon' : 'red'">
                <v-icon
                  icon="mdi-clipboard-account-outline"
                  size="32"
                  color="white"
                />
              </v-avatar>
              <v-card-title>
                <span
                  class="font-weight-bold"
                  :class="!$medicDashboard || Number($medicDashboard.totalPendingSign) === 0 ? 'text-colorTextPrimary' : 'text-red'"
                  style="font-size: 1.2rem"
                >
                  Pendente de assinatura
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                Você tem <div style="font-size: 1.5rem; font-weight: bold;">{{ $medicDashboard?.totalPendingSign }}</div> laudos médicos para
                assinar.
              </p>
            </div>
          </template>
        </CardBlur>
      </v-col>      
    </v-row>
  </div>
</template>

<script setup lang="ts">
const medicDash = useMedicDahsboardStore();

const $medicDashboard = computed(() => medicDash.$medicDashboard);

const cardItems = [
    {
      title: "Agendamentos",
      subtitle: "Começe por aqui, verifique os agendamentos feitos para você.",
      icon: "mdi-clipboard-account-outline",
      to: "/schedules",
    },
    {
      title: "Laudos médicos",
      subtitle: "Verifique os laudos médicos emitidos por você.",
      icon: "mdi-hospital-box-outline",
      to: "/medical-report",
    },
    {
      title: "Minha Conta",
      subtitle: "Verifique seus dados pessoais e/ou de acesso.",
      icon: "mdi-card-account-details-outline",
      to: "/medic/my-account",
    },
];

</script>
