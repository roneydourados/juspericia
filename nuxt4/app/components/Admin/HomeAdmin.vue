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
            height="250"
            @click="handleClickService('/solicitations')"
          >
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" color="colorIcon">
                <v-icon
                  icon="mdi-file-document-edit-outline"
                  size="32"
                  color="white"
                />
              </v-avatar>
              <v-card-title>
                <span
                  class="font-weight-bold text-primary"
                  style="font-size: 1.2rem"
                >
                  Solicitações
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                Começe por aqui, veja todas as solicitações de consulta.
              </p>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card
            elevation="12"
            rounded="xl"
            class="pa-4"
            height="250"
            @click="handleClickService('/admin/lawyers')"
          >
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" color="colorIcon">
                <v-icon
                  icon="mdi-account-tie-outline"
                  size="32"
                  color="white"
                />
              </v-avatar>
              <v-card-title>
                <span
                  class="font-weight-bold text-primary"
                  style="font-size: 1.2rem"
                >
                  Advogados
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                Veja todos os advogados cadastrados.
              </p>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card
            elevation="12"
            rounded="xl"
            class="pa-4"
            height="250"
            @click="handleClickService('/admin/indications')"
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
                  Indicações
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                Verifique as indicações feitas pelos advogados.
              </p>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card
            elevation="12"
            rounded="xl"
            class="pa-4"
            height="250"
            @click="handleClickService('/admin/packages')"
          >
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" color="colorIcon">
                <v-icon
                  icon="mdi-package-variant-closed-plus"
                  size="32"
                  color="white"
                />
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
                Cadastro de pacote de consultas. Gestão de pacotes de consultas
                possibilita a venda de consultas em lote e com preço mais
                acessível ao escritório.
              </p>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card
            elevation="12"
            rounded="xl"
            class="pa-4"
            height="250"
            @click="handleClickService('/admin/dashobard-sales')"
          >
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" color="colorIcon">
                <v-icon icon="mdi-chart-arc" size="32" color="white" />
              </v-avatar>
              <v-card-title>
                <span
                  class="font-weight-bold text-primary"
                  style="font-size: 1.2rem"
                >
                  Dashboard de vendas
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                Verifique as estatísticas de vendas.
              </p>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="3">
          <v-card
            elevation="12"
            rounded="xl"
            class="pa-4"
            height="250"
            @click="handleClickService('/medical-report')"
          >
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" color="colorIcon">
                <v-icon
                  icon="mdi-hospital-box-outline"
                  size="32"
                  color="white"
                />
              </v-avatar>
              <v-card-title>
                <span
                  class="font-weight-bold text-primary"
                  style="font-size: 1.2rem"
                >
                  Laudos médicos
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                Analíse as estatísticas de laudos médicos.
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
