<template>
  <v-card flat rounded="lg">
    <v-card-title class="d-flex flex-column pa-6">
      <span class="font-weight-bold text-h5">Início</span>
      <span class="caption text-grey-darken-1">
        Bem-vindo(a) de volta, {{ $currentUser?.name }} 👏
      </span>
      <span class="caption text-grey"> Selecione um serviço para iniciar </span>
    </v-card-title>
    <v-card-text>
      <div class="py-8">
        <HomeAdminCards />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const auth = useAuthStore();

const $currentUser = computed(() => auth.$currentUser);
</script>
