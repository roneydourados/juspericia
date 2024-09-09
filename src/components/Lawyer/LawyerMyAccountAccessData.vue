<template>
  <v-card flat rounded="lg">
    <v-card-title>
      <span class="text-subtitle-1"> Dados de acesso </span>
    </v-card-title>
    <v-card-text>
      <FormCrud :on-submit="submitForm">
        <v-row dense>
          <v-col cols="12" lg="8">
            <StringInput
              v-model="model.email"
              label="E-mail"
              placeholder="E-mail"
              disabled
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="4">
            <PasswordInput
              v-model="model.password"
              label="Nova senha"
              placeholder="informe nova senha"
            />
          </v-col>
          <v-col cols="12" lg="4">
            <PasswordInput
              v-model="model.confirmPassword"
              label="Confirme a senha"
              placeholder="confirme a senha"
            />
          </v-col>
        </v-row>
      </FormCrud>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const userLawyerStore = useUserLawyerStore();

const $currentUser = computed(() => auth.$currentUser);

const loading = ref(false);

const model = defineModel<UserModelProps>("model", {
  type: Object as PropType<UserModelProps>,
  default: () => ({}),
});

const submitForm = async () => {
  loading.value = true;
  try {
    await update();
    await userLawyerStore.show($currentUser.value!.id!);
  } finally {
    loading.value = false;
  }
};

const update = async () => {
  if (
    model.value?.password &&
    model.value?.password !== model.value?.confirmPassword
  ) {
    push.warning("As senhas não conferem");
    return;
  }

  await userLawyerStore.update({
    id: model.value?.id,
    email: model.value?.email,
    name: model.value?.name,
    phone: model.value?.phone?.value,
    cpfCnpj: model.value?.cpfCnpj.value,
    //password: model.value?.password,
    active: model.value?.active,
    oab: model.value?.oab,
    oabUf: model.value?.oabUf,
    officeName: model.value?.officeName,
    officeCnpj: model.value?.officeCnpj.value,
    officeEmail: model.value?.officeEmail,
    officePhone: model.value?.officePhone.value,
  });
};
</script>
