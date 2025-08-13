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
            @click="handleClickService('/schedules')"
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
                  Agendamentos
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                Começe por aqui, verifique os agendamentos feitos para você.
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
                Verifique os laudos médicos emitidos por você.
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
            @click="handleClickService('/medic/my-account')"
          >
            <div class="d-flex flex-column align-center">
              <v-avatar size="60" color="colorIcon">
                <v-icon
                  icon="mdi-card-account-details-outline"
                  size="32"
                  color="white"
                />
              </v-avatar>
              <v-card-title>
                <span
                  class="font-weight-bold text-primary"
                  style="font-size: 1.2rem"
                >
                  Minha Conta
                </span>
              </v-card-title>
              <p class="text-subtitle-2 text-darkText text-center">
                Verifique seus dados pessoais e/ou de acesso.
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
