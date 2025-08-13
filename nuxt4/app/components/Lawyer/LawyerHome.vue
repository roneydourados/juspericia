<template>
  <v-card variant="flat" class="mx-auto" color="transparent">
    <v-card class="ma-4" rounded="lg" variant="flat" color="transparent">
      <HomeStart />
      <v-row dense class="pa-4 mt-12">
        <v-col cols="12" lg="3">
          <v-card
            elevation="12"
            rounded="xl"
            class="pa-4"
            height="100%"
            @click="handleClickService('/patient')"
          >
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" color="colorIcon">
                <v-icon
                  icon="mdi-clipboard-account-outline"
                  size="32"
                  color="white"
                />
              </v-avatar>
              <v-card-title>
                <span
                  class="font-weight-bold text-primary"
                  style="font-size: 1.2rem"
                >
                  Paciente
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                Começe por aqui, cadastre um novo paciente para solicitar
                consultas.
              </p>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" lg="3">
          <v-card
            elevation="12"
            rounded="xl"
            class="pa-4"
            height="100%"
            @click="handleClickService('/solicitations/new')"
          >
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" color="colorIcon">
                <v-icon icon="mdi-cart-plus" size="32" color="white" />
              </v-avatar>
              <v-card-title>
                <span
                  class="font-weight-bold text-primary"
                  style="font-size: 1.2rem"
                >
                  Solicitação
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                Já tem paciente cadastrado ? Então começe por aqui, crie uma
                nova solicitação de consulta.
              </p>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" lg="3">
          <v-card
            elevation="12"
            rounded="xl"
            class="pa-4"
            height="100%"
            @click="handleClickService('/lawyer/my-indications')"
          >
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" color="colorIcon">
                <v-icon
                  icon="mdi-account-network-outline"
                  size="32"
                  color="white"
                />
              </v-avatar>
              <v-card-title>
                <span
                  class="font-weight-bold text-primary"
                  style="font-size: 1.2rem"
                >
                  Indicação
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                Indique e acumule pontos para trocar por descontos em
                solicitações de consultas.
              </p>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card
            elevation="12"
            rounded="xl"
            class="pa-4"
            height="100%"
            @click="handleClickService('/services-packages')"
          >
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" color="colorIcon">
                <v-icon icon="mdi-cart-arrow-up" size="32" color="white" />
              </v-avatar>
              <v-card-title>
                <span
                  class="font-weight-bold text-primary"
                  style="font-size: 1.2rem"
                >
                  Pacotes
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                Adquira pacotes de consultas e ganhe descontos especiais.
              </p>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card
            elevation="12"
            rounded="xl"
            class="pa-4"
            height="100%"
            @click="handleClickService('/lawyer/my-salts')"
          >
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" color="colorIcon">
                <v-icon icon="mdi-chart-line-variant" size="32" color="white" />
              </v-avatar>
              <v-card-title>
                <span
                  class="font-weight-bold text-primary"
                  style="font-size: 1.2rem"
                >
                  Pacotes
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                De uma conferida no seu saldo em créditos de compra de pacotes
                de serviços.
              </p>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card
            elevation="12"
            rounded="xl"
            class="pa-4"
            height="100%"
            @click="handleClickService('/lawyer/estatistics')"
          >
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" color="colorIcon">
                <v-icon
                  icon="mdi-view-dashboard-outline"
                  size="32"
                  color="white"
                />
              </v-avatar>
              <v-card-title>
                <span
                  class="font-weight-bold text-primary"
                  style="font-size: 1.2rem"
                >
                  Estatísticas
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
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
const router = useRouter();

const handleClickService = async (route: string) => {
  await router.push(route);
};
</script>
