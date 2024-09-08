<template>
  <v-card
    class="mx-auto"
    color="#fff"
    variant="flat"
    max-width="600"
    rounded="lg"
    elevation="12"
  >
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
      <NuxtTurnstile ref="turnstile" v-model="cloudFlareToken" />
    </FormCrud>
  </v-card>
</template>

<script setup lang="ts">
const auth = useAuthStore();
//const route = useRouter();

const cloudFlareToken = ref("");
const turnstile = ref();

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
    //sempre resetar o token para evitar de enviar um token expirado
    //turnstile.value?.reset();

    await auth.login({
      email: form.value.email,
      password: form.value.password,
      tokenCapcha: cloudFlareToken.value,
    });

    //await route.push("/home-admin");

    if ($user?.value?.Profile.type === "ADMIN") {
      return navigateTo("/admin/home");
    } else if ($user?.value?.Profile.type === "ADVOGADO") {
      return navigateTo("/lawyer/home");
    } else if ($user?.value?.Profile.type === "MEDICO") {
      return navigateTo("/medic/home");
    }

    if (form.value.saveCredentials) {
      localStorage.setItem("email", form.value.email);
      localStorage.setItem("password", form.value.password);
      localStorage.setItem(
        "saveCredentials",
        form.value.saveCredentials ? "true" : "false"
      );
    } else {
      localStorage.setItem("email", "");
      localStorage.setItem("password", "");
      localStorage.setItem("saveCredentials", "false");
    }
  } catch (error) {
    console.log("🚀 ~ file: FormLogin.vue:82 ~ onSubmit ~ error:", error);
    turnstile.value?.reset();
  }
};
</script>
