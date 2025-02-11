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
            <strong>{{ $currentUser?.name }}</strong>
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
            @click="handleClickService('/patient')"
          >
            <div class="d-flex flex-column align-center">
              <v-icon
                icon="mdi-clipboard-account-outline"
                size="60"
                color="primary"
              />
              <v-card-title class="text-h6">
                <span class="text-info font-weight-bold text-h6">
                  Paciente
                </span>
              </v-card-title>
              <p class="text-subtitle-1">
                Começe por aqui, cadastre um novo paciente para solicitar
                consultas.
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
            @click="handleClickService('/solicitations/new')"
          >
            <div class="d-flex flex-column align-center">
              <v-icon icon="mdi-cart-plus" size="60" color="primary" />
              <v-card-title class="text-h6">
                <span class="text-info font-weight-bold text-h6">
                  Solicitação
                </span>
              </v-card-title>
              <p class="text-subtitle-1">
                Já tem paciente cadastrado ? Então começe por aqui, crie uma
                nova solicitação de consulta.
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
            @click="handleClickService('/lawyer/my-indications')"
          >
            <div class="d-flex flex-column align-center">
              <v-icon
                icon="mdi-account-network-outline"
                size="60"
                color="primary"
              />
              <v-card-title class="text-h6">
                <span class="text-info font-weight-bold text-h6">
                  Indicação
                </span>
              </v-card-title>
              <p class="text-subtitle-1">
                Indique e acumule pontos para trocar por descontos em
                solicitações de consultas.
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
            @click="handleClickService('/services-packages')"
          >
            <div class="d-flex flex-column align-center">
              <v-icon icon="mdi-cart-arrow-up" size="60" color="primary" />
              <v-card-title class="text-h6">
                <span class="text-info font-weight-bold text-h6">
                  Pacotes
                </span>
              </v-card-title>
              <p class="text-subtitle-1">
                Adquira pacotes de consultas e ganhe descontos especiais.
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
            @click="handleClickService('/lawyer/my-salts')"
          >
            <div class="d-flex flex-column align-center">
              <v-icon icon="mdi-chart-line-variant" size="60" color="primary" />
              <v-card-title class="text-h6">
                <span class="text-info font-weight-bold text-h6"> Saldo </span>
              </v-card-title>
              <p class="text-subtitle-1">
                De uma conferida no seu saldo em créditos de compra de pacotes
                de serviços.
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
            @click="handleClickService('/lawyer/estatistics')"
          >
            <div class="d-flex flex-column align-center">
              <v-icon
                icon="mdi-view-dashboard-outline"
                size="60"
                color="primary"
              />
              <v-card-title class="text-h6">
                <span class="text-info font-weight-bold text-h6">
                  Estatísticas
                </span>
              </v-card-title>
              <p class="text-subtitle-1">
                Análise suas estatísticas de uso da plataforma.
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
