<template>
  <v-card class="mx-auto" color="#fff" rounded="lg" flat max-width="600">
    <v-card-title>
      <v-row dense class="pa-8" justify="center">
        <v-col>
          <v-icon
            icon="mdi-account-key-outline"
            color="primary"
            start
            size="40"
          />
          <span>Faça seu login</span>
        </v-col>
      </v-row>
    </v-card-title>
    <FormCrud
      :on-submit="submmitForm"
      :show-submit-button="false"
      class="px-4 py-4"
    >
      <v-row dense>
        <v-col cols="12">
          <StringInput
            v-model="form.email"
            label="*E-mail"
            placeholder="informe seu e-mail"
            icon="mdi-email-outline"
            required
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <PasswordInput
            v-model="form.password"
            label="*Senha"
            type="password"
            placeholder="informe sua senha"
            icon="mdi-form-textbox-password"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-checkbox v-model="form.saveCredentials" color="info" hide-details>
            <template #label>
              <span>Salvar credenciais neste dispotivo</span>
            </template>
          </v-checkbox>
          <NuxtTurnstile ref="turnstile" v-model="cloudFlareToken" />
        </v-col>
      </v-row>
      <v-row dense justify="center">
        <v-col cols="12" class="ma-6">
          <v-btn
            block
            variant="flat"
            class="text-none"
            prepend-icon="mdi-login"
            color="primary"
            type="submit"
          >
            Acessar
          </v-btn>
        </v-col>
      </v-row>
      <div class="mb-4">
        <p class="text-center text-caption">
          <span class="text-subtitle-1">
            <span
              @click="rounter.push('/forgot-password')"
              class="font-weight-bold text-blue"
              style="cursor: pointer; font-size: 1rem"
            >
              Esqueci minha senha
            </span>
          </span>
        </p>
      </div>
      <div>
        <p class="text-center">
          <span style="font-size: 1rem">
            Não possui uma conta ?
            <span
              @click="rounter.push('/register')"
              class="font-weight-bold text-blue"
              style="cursor: pointer; font-size: 1rem"
            >
              Cadastrar
            </span>
          </span>
        </p>
      </div>
    </FormCrud>
  </v-card>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const cloudFlareToken = ref("");
const turnstile = ref();
const rounter = useRouter();

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

const submmitForm = async () => {
  try {
    await auth.login({
      email: form.value.email,
      password: form.value.password,
      tokenCapcha: cloudFlareToken.value,
    });

    if (form.value.saveCredentials) {
      localStorage.setItem("email", form.value.email);
      localStorage.setItem("password", form.value.password);
      localStorage.setItem("saveCredentials", "true");
    } else {
      localStorage.setItem("email", "");
      localStorage.setItem("password", "");
      localStorage.setItem("saveCredentials", "false");
    }

    if ($user?.value?.Profile.type === "ADMIN") {
      return navigateTo("/admin/home");
    } else if ($user?.value?.Profile.type === "ADVOGADO") {
      return navigateTo("/lawyer/home");
    } else if ($user?.value?.Profile.type === "MEDICO") {
      return navigateTo("/medic/home");
    }
  } catch (error) {
    console.log("🚀 ~ file: FormLogin.vue:82 ~ onSubmit ~ error:", error);
    push.error("Ocorreu um erro ao realizar login, tente novamente.");
    turnstile.value?.reset();
  }
};
</script>
