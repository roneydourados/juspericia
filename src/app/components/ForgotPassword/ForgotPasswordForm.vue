<template>
  <v-card class="mx-auto py-8" flat :width="mobile ? '100%' : '600'">
    <v-card-title class="px-8">
      <span class="text-h5 text-grey-darken-1 font-weight-bold">
        {{ !isSend ? "Informe o e-mail cadastrado" : "Verifique seu email..." }}
      </span>
    </v-card-title>
    <v-card-text class="pa-4">
      <FormCrud
        v-if="!isSend"
        :on-submit="submitForm"
        button-label="Recuperar senha"
      >
        <v-row>
          <v-col cols="12">
            <StringInput
              v-model="email"
              label="E-mail"
              placeholder="E-mail"
              icon="mdi-email-outline"
              required
            />
          </v-col>
        </v-row>
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
const user = useAuthStore();
const router = useRouter();

const email = ref("");
const loading = ref(false);
const isSend = ref(false);
const submitForm = async () => {
  loading.value = true;
  try {
    await user.forgotPasswordLink(email.value);
    isSend.value = true;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
