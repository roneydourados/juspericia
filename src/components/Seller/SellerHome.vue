<template>
  <v-card variant="flat" class="mx-auto" color="transparent">
    <v-card class="ma-4" rounded="lg" variant="flat" color="transparent">
      <v-card-item>
        <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem">
          Início
        </div>
        <v-card-title class="text-body-2 d-flex align-center">
          <v-icon color="primary" icon="mdi-calendar" start />

          <span class="text-medium-emphasis font-weight-bold">
            {{ $now }}
          </span>

          <v-spacer></v-spacer>
        </v-card-title>

        <div class="py-2">
          <div class="d-flex align-center" style="gap: 0.5rem">
            Olá Bem vindo(a) de volta,
            <strong> {{ $currentUser?.name }}</strong>
          </div>

          <div class="font-weight-light text-medium-emphasis mt-2">
            Selecione um das opções abaixo para continuar.
          </div>
        </div>
      </v-card-item>

      <v-divider></v-divider>

      <v-row dense class="pa-4 mt-12">
        <v-col cols="12" lg="3">
          <v-card
            elevation="4"
            rounded="lg"
            class="pa-4"
            height="100%"
            @click="handleClickService('/schedules')"
          >
            <div class="d-flex flex-column align-center">
              <v-icon
                icon="mdi-clipboard-account-outline"
                size="60"
                color="primary"
              />
              <v-card-title class="text-h6">
                <span class="text-info font-weight-bold text-h6">
                  Agendamentos
                </span>
              </v-card-title>
              <p class="text-subtitle-1">
                Começe por aqui, verifique os agendamentos feitos para você.
              </p>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card
            elevation="4"
            rounded="lg"
            class="pa-4"
            height="100%"
            @click="handleClickService('/solicitations')"
          >
            <div class="d-flex flex-column align-center">
              <v-icon
                icon="mdi-file-document-edit-outline"
                size="60"
                color="primary"
              />
              <v-card-title class="text-h6">
                <span class="text-info font-weight-bold text-h6">
                  Solicitações
                </span>
              </v-card-title>
              <p class="text-subtitle-1">
                Começe por aqui, veja todas as solicitações de consulta.
              </p>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card
            elevation="4"
            rounded="lg"
            class="pa-4"
            height="100%"
            @click="handleClickService('/admin/lawyers')"
          >
            <div class="d-flex flex-column align-center">
              <v-icon
                icon="mdi-account-tie-outline"
                size="60"
                color="primary"
              />
              <v-card-title class="text-h6">
                <span class="text-info font-weight-bold text-h6">
                  Advogados
                </span>
              </v-card-title>
              <p class="text-subtitle-1">
                Veja todos os advogados cadastrados.
              </p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const router = useRouter();
const { formatDateExtenso } = useUtils();

const $currentUser = computed(() => auth.$currentUser);
const $now = computed(() => formatDateExtenso(new Date()));

const handleClickService = async (route: string) => {
  await router.push(route);
};
</script>
