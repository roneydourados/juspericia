<template>
  <v-card
    class="mx-auto pa-4"
    flat
    elevation="0"
    rounded="lg"
    color="transparent"
  >
    <v-row dense align="center" class="mb-2">
      <v-col cols="12" md="8">
        <HeaderPage title="Cofre de Senhas" font-size="1.5rem">
          <span class="text-caption text-medium-emphasis">
            Gerencie suas credenciais de forma segura.
          </span>
        </HeaderPage>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end">
        <Button
          color="primary"
          variant="flat"
          size="small"
          class="text-none"
          @click="openCreate"
        >
          <v-icon icon="mdi-plus" start />
          <span class="text-white text-caption">Nova Senha</span>
        </Button>
      </v-col>
    </v-row>

    <v-alert
      type="info"
      variant="tonal"
      density="compact"
      rounded="lg"
      class="mb-4"
    >
      <strong>Nota de Seguranca:</strong> Este e um ambiente de demonstracao. As
      senhas sao armazenadas apenas na memoria do navegador e serao perdidas ao
      recarregar a pagina. Em um ambiente real, utilize criptografia
      ponta-a-ponta.
    </v-alert>

    <v-row dense class="mb-4" align="center">
      <v-col cols="12" md="8">
        <StringInput
          v-model="search"
          label="Buscar"
          placeholder="Buscar por servico, usuario ou categoria..."
          icon="mdi-magnify"
        />
      </v-col>
      <v-col cols="12" md="4">
        <SelectInput
          v-model="selectedUser"
          label="Usuarios"
          item-title="name"
          item-value="value"
          :items="userItems"
          clearable
        />
      </v-col>
    </v-row>

    <v-row dense v-if="filteredItems.length">
      <v-col
        v-for="item in filteredItems"
        :key="item.publicId"
        cols="12"
        md="6"
        lg="4"
      >
        <CardBlur class="pa-2" height="100%">
          <v-card-title class="d-flex align-center" style="gap: 0.75rem">
            <v-avatar color="primary" size="36">
              <span class="text-white text-caption">{{
                getInitials(item.title || "")
              }}</span>
            </v-avatar>
            <div class="d-flex flex-column">
              <span class="text-subtitle-2 text-colorTextPrimary">{{
                item.title || "Sem titulo"
              }}</span>
              <span class="text-caption text-medium-emphasis">{{
                getDomain(item.appUrl)
              }}</span>
            </div>
          </v-card-title>
          <v-card-text class="pt-0">
            <InfoLabel
              title="USUARIO / LOGIN"
              :content="item.usuarioLogin || 'Nao informado'"
              :show-divider="false"
            />
            <div class="mt-3">
              <span class="text-caption text-medium-emphasis">SENHA</span>
              <v-text-field
                :model-value="passwordValue(item)"
                readonly
                variant="outlined"
                density="compact"
                rounded="xl"
                base-color="tooltipTextColor"
                color="tooltipTextColor"
                :append-inner-icon="
                  item.publicId && reveal[item.publicId]
                    ? 'mdi-eye'
                    : 'mdi-eye-off'
                "
                @click:append-inner="toggleReveal(item.publicId)"
              />
            </div>
            <div v-if="item.observation" class="mt-2">
              <InfoLabel
                title="OBSERVACAO"
                :content="item.observation"
                :show-divider="false"
              />
            </div>
          </v-card-text>
          <v-card-actions class="d-flex justify-space-between">
            <v-btn
              variant="text"
              color="primary"
              size="small"
              :href="item.appUrl"
              target="_blank"
              rel="noopener"
            >
              <v-icon icon="mdi-open-in-new" start />
              Acessar site
            </v-btn>
            <div class="d-flex" style="gap: 0.25rem">
              <v-btn
                icon
                variant="text"
                color="colorIcon"
                size="small"
                @click="copyPassword(item)"
              >
                <v-icon icon="mdi-content-copy" size="18" />
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                  >Copiar</v-tooltip
                >
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="colorIcon"
                size="small"
                @click="openEdit(item)"
              >
                <v-icon icon="mdi-pencil-outline" size="18" />
                <v-tooltip
                  activator="parent"
                  location="top center"
                  content-class="tooltip-background"
                  >Editar</v-tooltip
                >
              </v-btn>
            </div>
          </v-card-actions>
        </CardBlur>
      </v-col>
    </v-row>
    <EmptyContent
      v-else
      head-line="Sem senhas"
      title="Nada por aqui"
      text="Adicione uma nova senha para comecar."
    />
  </v-card>

  <PasswordVaultForm
    v-model:show="showForm"
    v-model:data="modelForm"
    @submit="handleSubmit"
    @close="closeForm"
  />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

const passwordVaultStore = usePasswordVaultStore();
const { getInitials } = useUtils();

const loading = ref(false);
const search = ref("");
const selectedUser = ref<string | null>(null);
const reveal = ref<Record<string, boolean>>({});
const showForm = ref(false);
const selected = ref<PasswordVaultProps | undefined>(undefined);
const modelForm = ref<PasswordVaultProps>({
  title: "",
  usuarioLogin: "",
  appUrl: "",
  observation: "",
  password: "",
});

const $all = computed(() => passwordVaultStore.$all);

const userItems = computed(() => {
  const users = $all.value
    .map((item) => item.usuarioLogin || "")
    .filter((value) => value.trim().length > 0);
  const unique = Array.from(new Set(users)).sort();
  return [
    { name: "Todos os usuarios", value: "" },
    ...unique.map((name) => ({ name, value: name })),
  ];
});

const filteredItems = computed(() => {
  const query = search.value.trim().toLowerCase();
  return $all.value.filter((item) => {
    const matchUser = selectedUser.value
      ? item.usuarioLogin === selectedUser.value
      : true;
    const values = [
      item.title,
      item.usuarioLogin,
      item.appUrl,
      item.observation,
    ].map((val) => String(val || "").toLowerCase());
    const matchQuery = !query || values.some((val) => val.includes(query));
    return matchUser && matchQuery;
  });
});

const handleSearch = useDebounceFn(async () => {
  await passwordVaultStore.index(search.value || "");
}, 400);

watch(search, () => {
  handleSearch();
});

const openCreate = () => {
  selected.value = undefined;
  modelForm.value = {
    title: "",
    usuarioLogin: "",
    appUrl: "",
    observation: "",
    password: "",
  };
  showForm.value = true;
};

const openEdit = (item: PasswordVaultProps) => {
  selected.value = item;
  modelForm.value = {
    title: item.title || "",
    usuarioLogin: item.usuarioLogin || "",
    appUrl: item.appUrl || "",
    observation: item.observation || "",
    password: item.password || "",
  };
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  selected.value = undefined;
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    const payload = {
      ...modelForm.value,
      publicId: selected.value?.publicId,
    };
    if (selected.value?.publicId) await passwordVaultStore.updated(payload);
    else await passwordVaultStore.store(payload);
    closeForm();
    await passwordVaultStore.index(search.value || "");
  } catch (error) {
    console.log("🚀 ~ handleSubmit ~ error:", error);
  } finally {
    loading.value = false;
  }
};

const toggleReveal = (publicId?: string) => {
  if (!publicId) return;
  reveal.value[publicId] = !reveal.value[publicId];
};

const passwordValue = (item: PasswordVaultProps) => {
  if (!item.publicId) return "";
  if (reveal.value[item.publicId]) return item.password || "";
  const length = item.password ? item.password.length : 8;
  return "*".repeat(Math.max(length, 4));
};

const copyPassword = async (item: PasswordVaultProps) => {
  if (!item.password) return;
  await navigator.clipboard.writeText(item.password);
  push.success("Senha copiada para a area de transferencia");
};

const getDomain = (url?: string) => {
  if (!url) return "";
  try {
    return new URL(url).host;
  } catch (error) {
    return url;
  }
};

onMounted(async () => {
  await passwordVaultStore.index("");
});
</script>
