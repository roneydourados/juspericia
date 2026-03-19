<template>
  <div class="pa-12">
    <v-row>
      <v-col cols="12" class="pa-6">
        <HeaderPage title="Gerenciamento de Agentes de IA" font-size="1.8rem" />
      </v-col>
      <v-col cols="12" lg="10">
        <StringInput
          v-model="search"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          flat
          hide-details
          single-line
          style="font-size: 1.4rem"
          :loading="loading"
          placeholder="Pesquisar agente..."
          @update:model-value="handleSearch(search)"
        />
      </v-col>
      <v-col cols="12" lg="2" class="d-flex flex-wrap" style="gap: 0.5rem">
        <Button
          variant="outlined"
          color="grey"
          class="text-none"
          size="small"
          @click="router.back()"
        >
          <v-icon icon="mdi-arrow-left" color="darkText" />
          <span class="text-darkText text-caption"> Voltar </span>
        </Button>
        <Button color="primary" size="small" @click="openForm">
          <v-icon icon="mdi-plus" start color="colorIcon" />
          <span class="text-caption"> Novo </span>
        </Button>
      </v-col>

      <v-col cols="12">
        <v-progress-linear v-if="loading" indeterminate color="primary" />
      </v-col>

      <v-col v-for="agent in $all" :key="agent.id" cols="12" lg="3">
        <CardBlur height="100%">
          <v-card-title>
            <v-icon icon="mdi-robot-outline" start color="colorIcon" />
          </v-card-title>
          <v-card-text>
            <strong>{{ agent.name }}</strong>
          </v-card-text>
          <v-card-actions class="d-flex justify-end" style="gap: 0.5rem">
            <Button
              color="grey"
              class="text-none"
              variant="outlined"
              size="small"
              @click="editItem(agent)"
            >
              <v-icon icon="mdi-pencil-outline" start color="colorIcon" />
              <span class="text-colorTextPrimary text-caption"> Editar </span>
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="grey"
              class="text-none"
              @click="deleteItem(agent)"
            >
              <v-icon icon="mdi-delete-outline" start color="red" />
              <span class="text-colorTextPrimary text-caption"> Apagar </span>
            </Button>
          </v-card-actions>
        </CardBlur>
      </v-col>

      <v-col v-if="!loading && $all.length === 0" cols="12">
        <EmptyContent />
      </v-col>
    </v-row>
  </div>
  <AgentForm v-model:show="showForm" :data="selected" />
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

const agentStore = useAgentStore();
const router = useRouter();

const $all = computed(() => agentStore.$all);
const $single = computed(() => agentStore.$single);

const loading = ref(false);
const search = ref("");
const showForm = ref(false);
const selected = ref<AgentProps>();

const openForm = () => {
  selected.value = undefined;
  showForm.value = true;
  console.log("🚀 ~ openForm ~  showForm.value:", showForm.value);
};

const editItem = async (item: AgentProps) => {
  loading.value = true;
  try {
    await agentStore.show(item.publicId!);
    selected.value = $single.value;
    showForm.value = true;
  } finally {
    loading.value = false;
  }
};

const deleteItem = (item: AgentProps) => {
  push.info({
    title: "Apagar Agente",
    message: "Tem certeza que deseja apagar este agente?",
    duration: Infinity,
    props: {
      isModal: true,
      preventOverlayClose: true,
      preventEscapeClose: false,
      actions: [
        {
          label: "Apagar",
          variant: "primary",
          icon: "mdi-delete-outline",
          iconColor: "colorIcon",
          handler: async () => {
            loading.value = true;
            try {
              if (!item.publicId) return;
              await agentStore.destroy(item.publicId);
              await handleSearch("", false);
            } finally {
              loading.value = false;
            }
          },
        },
        {
          label: "Cancelar",
          variant: "secondary",
          icon: "mdi-close",
          iconColor: "red",
          handler: () => {},
        },
      ],
    },
  });
};

const handleSearch = useDebounceFn(
  async (search: string, isLoading: boolean = true) => {
    loading.value = isLoading;
    try {
      await agentStore.index(search);
    } finally {
      loading.value = false;
    }
  },
  500,
);

onMounted(async () => {
  await handleSearch("");
});
</script>
