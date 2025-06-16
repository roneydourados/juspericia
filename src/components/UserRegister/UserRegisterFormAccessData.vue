<template>
  <FormCrud :on-submit="submitForm" :show-submit-button="false">
    <v-row dense>
      <v-col cols="12">
        <StringInput
          v-model="model.email"
          label="E-mail"
          placeholder="E-mail"
          icon="mdi-email-outline"
          required
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" class="d-flex flex-column">
        <p class="text-grey-darken-1 text-subtitle-2">
          Senha deve conter Mínimo de 8 caracteres.
        </p>
        <p class="text-grey-darken-1 text-subtitle-2">
          Senha deve conter pelo menos uma letra maiúscula.
        </p>
        <p class="text-grey-darken-1 text-subtitle-2">
          Senha deve conter pelo menos um número.
        </p>
        <p class="text-grey-darken-1 text-subtitle-2">
          Senha deve conter pelo menos um caractere especial ex. @#$*()!.
        </p>
        <p class="text-grey-darken-1 text-subtitle-2">
          As senhas deve se coicidir.
        </p>
      </v-col>
      <v-col cols="12" lg="6">
        <PasswordInput
          v-model="model.password"
          label="Nova senha"
          placeholder="informe nova senha"
          icon="mdi-lock-outline"
          required
          :strong="true"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <PasswordInput
          v-model="model.confirmPassword"
          label="Confirme a senha"
          placeholder="confirme a senha"
          icon="mdi-lock-outline"
          required
          :strong="true"
        />
      </v-col>
      <v-col v-if="$invalidPasword" cols="12" class="d-flex justify-center">
        <strong style="color: red; font-size: 1rem">
          <v-icon color="red" icon="mdi-alert-circle" />
          As senhas não conferem
        </strong>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <v-btn
          color="primary"
          variant="tonal"
          class="text-none"
          @click="emit('prev')"
        >
          <v-icon icon="mdi-chevron-left" start />
          Anterior
        </v-btn>
        <v-btn type="submit" color="primary" variant="tonal" class="text-none">
          Registrar
          <v-icon icon="mdi-account" end />
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-checkbox v-model="terms">
          <template v-slot:label>
            <div class="d-flex align-center">
              <span style="font-size: 1rem"> Li e concordo com os </span>
              <span
                class="ml-2 mr-2 text-blue-darken-4"
                @click="handleOpenTerms"
                style="font-size: 1rem"
              >
                termos e condições de uso.
              </span>
            </div>
          </template>
        </v-checkbox>
      </v-col>
      <v-col cols="12">
        <NuxtTurnstile ref="turnstile" v-model="cloudFlareToken" />
      </v-col>
    </v-row>
  </FormCrud>
</template>

<script setup lang="ts">
const emit = defineEmits(["register", "prev"]);

const model = defineModel<UserModelProps>({
  type: Object as PropType<UserModelProps>,
  default: () => ({}),
});

const turnstile = ref();
const cloudFlareToken = ref("");
const terms = ref(false);
const $invalidPasword = computed(() => {
  if (model.value?.password && model.value?.confirmPassword) {
    return model.value?.password !== model.value?.confirmPassword;
  }

  return false;
});

const submitForm = () => {
  try {
    if ($invalidPasword.value) {
      push.warning("Informe as senhas corretamente.");
      return;
    }

    if (!terms.value) {
      push.warning("Você deve aceitar os termos e condições.");
      return;
    }

    if (!cloudFlareToken.value) {
      turnstile.value?.reset();
      push.warning("Erro no captcha, tente novamente");
      return;
    }

    model.value.tokenCapcha = cloudFlareToken.value;

    emit("register");
  } catch (error) {
    turnstile.value?.reset();
    push.warning("Oops deu um problema tente novamente!");
    console.log("🚀 ~ submitForm ~ error:", error);
  }
};

const handleOpenTerms = () => {
  window.open("/terms", "_blank");
};
</script>
