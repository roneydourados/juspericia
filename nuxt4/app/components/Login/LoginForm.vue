<template>
  <v-row dense align="center">
    <v-col cols="12" :lg="mobile ? '12' : '3'">
      <v-card rounded="lg" flat color="transparent" class="text-primary">
        <v-card-title>
          <v-row dense class="pa-8" justify="center">
            <v-col cols="12">
              <Logo height="50" position="center" />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <FormCrud
            :on-submit="submmitForm"
            :show-submit-button="false"
            class="px-4 py-4"
          >
            <v-row dense>
              <v-col cols="12">
                <StringInput
                  v-model="form.email"
                  label="E-mail"
                  placeholder="informe seu e-mail"
                  icon="mdi-email-outline"
                  required
                  base-color="primary"
                  color="primary"
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <PasswordInput
                  v-model="form.password"
                  label="Senha"
                  placeholder="informe sua senha"
                  icon="mdi-form-textbox-password"
                  required
                  base-color="primary"
                  color="primary"
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <div class="text-red text-center w-100" v-if="isError">
                  Login inválido, tente novamente!!!
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-checkbox
                  v-model="form.saveCredentials"
                  color="info"
                  hide-details
                >
                  <template #label>
                    <span>Salvar credenciais neste dispotivo</span>
                  </template>
                </v-checkbox>
                <NuxtTurnstile ref="turnstile" v-model="cloudFlareToken" />
              </v-col>
            </v-row>
            <v-row dense justify="center">
              <v-col cols="12" class="ma-6">
                <Button variant="flat" color="colorIcon" type="submit">
                  <v-icon icon="mdi-login" start color="primary" />
                  <span class="text-primary"> Acessar </span>
                </Button>
              </v-col>
            </v-row>
            <div v-if="!$isDevelop" class="mb-4">
              <div class="text-center text-caption">
                <span
                  @click="rounter.push('/forgot-password')"
                  class="text-caption text-blue"
                  style="cursor: pointer"
                >
                  Esqueci minha senha
                </span>
              </div>
            </div>
            <div v-if="!$isDevelop" class="mt-n4">
              <div class="text-center">
                Não possui uma conta ?
                <span
                  @click="rounter.push('/register')"
                  style="cursor: pointer"
                  class="text-caption text-blue"
                >
                  Cadastrar
                </span>
              </div>
            </div>
            <v-row dense class="mt-4">
              <v-col cols="12">
                <div class="text-caption">Compatibilidade</div>
                <v-icon icon="mdi-google-chrome" />
                <v-icon icon="mdi-firefox" />
                <v-icon icon="mdi-opera" />
                <v-icon icon="mdi-microsoft-edge" />
                <v-icon icon="mdi-apple-safari" />
              </v-col>
            </v-row>
          </FormCrud>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-if="!mobile" cols="12" lg="9">
      <div
        class="background-image d-flex flex-column align-center justify-center"
        style="color: #fff"
      >
        <div style="margin-top: 34rem; font-size: 2.19rem">
          Laudos médicos <strong style="font-size: 2.19rem">rápidos, </strong>
        </div>
        <div style="font-size: 2.19rem">
          <strong style="font-size: 2.19rem">seguros</strong> e
          <strong style="font-size: 2.19rem">sem burocracia</strong>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
const auth = useAuthStore();
const systemParametersStore = useSystemParametersStore();
const config = useRuntimeConfig();
const { mobile } = useDisplay();
const cloudFlareToken = ref("");
const turnstile = ref();
const rounter = useRouter();
const loading = ref(false);
const isError = ref(false);

const form = ref({
  email: "",
  password: "",
  saveCredentials: false,
});

onMounted(() => {
  form.value = {
    email: localStorage.getItem("email") ?? "",
    password: localStorage.getItem("password") ?? "",
    saveCredentials: localStorage.getItem("saveCredentials") === "true",
  };
});

const $user = computed(() => auth.$currentUser);
const $isDevelop = computed(() => config.public.develop);

const submmitForm = async () => {
  isError.value = false;
  try {
    await auth.login({
      email: form.value.email,
      password: form.value.password,
      tokenCapcha: cloudFlareToken.value,
    });

    await systemParametersStore.index();

    if (form.value.saveCredentials) {
      localStorage.setItem("email", form.value.email);
      localStorage.setItem("password", form.value.password);
      localStorage.setItem("saveCredentials", "true");
    } else {
      localStorage.setItem("email", "");
      localStorage.setItem("password", "");
      localStorage.setItem("saveCredentials", "false");
    }

    if ($user?.value?.profile?.type === "ADMIN") {
      return navigateTo("/admin/home");
    } else if ($user?.value?.profile?.type === "ADVOGADO") {
      return navigateTo("/lawyer/home");
    } else if ($user?.value?.profile?.type === "MEDICO") {
      return navigateTo("/medic/home");
    } else if (
      $user?.value?.profile?.type === "VENDEDOR" ||
      $user?.value?.profile?.type === "GERENTE"
    ) {
      return navigateTo("/seller/home");
    }
  } catch (error) {
    isError.value = true;
    console.log("🚀 ~ file: FormLogin.vue:82 ~ onSubmit ~ error:", error);
    push.error("Ocorreu um erro ao realizar login, tente novamente.");
    turnstile.value?.reset();
  }
};
</script>

<style scoped>
.background-image {
  background-image: url("@/assets/images/login.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
}
</style>
