<template>
  <v-card class="mx-auto py-8" flat :width="mobile ? '100%' : '600'">
    <v-card-title class="px-8">
      <span class="text-h5 text-grey-darken-1 font-weight-bold">
        {{ !isSend ? "Informe nova senha" : "Retorne para login..." }}
      </span>
    </v-card-title>
    <v-card-text class="pa-4">
      <FormCrud
        v-if="!isSend"
        :on-submit="submitForm"
        button-label="Salvar nova senha"
      >
        <v-row>
          <v-col cols="12">
            <PasswordInput
              v-model="form.password"
              label="Nova Senha"
              type="password"
              placeholder="*****"
              icon="mdi-form-textbox-password"
              required
            />
          </v-col>
          <v-col cols="12">
            <PasswordInput
              v-model="form.confirmPassword"
              label="Confirmar nova Senha"
              type="password"
              placeholder="*****"
              icon="mdi-form-textbox-password"
              required
            />
          </v-col>
        </v-row>
        <v-col v-if="$invalidPasword" cols="12" class="d-flex justify-center">
          <strong style="color: red; font-size: 1rem">
            <v-icon color="red" icon="mdi-alert-circle" />
            As senhas não conferem
          </strong>
        </v-col>
      </FormCrud>
    </v-card-text>
    <v-card-actions class="pa-8">
      <v-btn
        color="success"
        variant="text"
        class="text-none d-flex align-center"
        @click="router.push('/')"
      >
        <v-icon icon="mdi-chevron-left" start size="25" />
        <span style="font-size: 1.1rem">Voltar para login</span>
      </v-btn>
    </v-card-actions>
  </v-card>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const router = useRouter();
const route = useRoute();
const user = useAuthStore();

const form = ref({
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const isSend = ref(false);

const $invalidPasword = computed(() => {
  if (form.value.password && form.value.confirmPassword) {
    return form.value.password !== form.value.confirmPassword;
  }

  return false;
});

const submitForm = async () => {
  if ($invalidPasword.value) {
    push.warning("As senhas não conferem");
    return;
  }

  loading.value = true;
  try {
    const id = route.params.id as string;
    await user.resetPassword(id, { password: form.value.password });
    isSend.value = true;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
</script>
