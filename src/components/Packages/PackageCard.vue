<template>
  <v-card
    :disabled="loading"
    :loading="loading"
    class="mx-auto my-12"
    max-width="95%"
    rounded="lg"
    elevation="8"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="deep-purple"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img height="250" :src="item.urlImage" cover></v-img>

    <v-card-item>
      <v-card-title>
        <span
          class="text-justify d-flex align-center"
          style="white-space: pre-line"
        >
          <v-icon color="error" icon="mdi-fire-circle" size="small" start />
          {{ item.name }}
        </span>
      </v-card-title>

      <!-- <v-card-subtitle>
        <span class="me-1">Mais simples</span>

        <v-icon color="error" icon="mdi-fire-circle" size="small"></v-icon>
      </v-card-subtitle> -->
    </v-card-item>

    <v-card-text>
      <p class="text-justify" style="white-space: pre-line">
        {{ item.description }}
      </p>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-title>Preço</v-card-title>

    <div class="px-4 mb-2">
      <v-chip color="deep-purple-lighten-2" label>
        <strong style="font-size: 1rem">
          R$ {{ amountFormated(item.value ?? 0, false) }}
        </strong>
      </v-chip>
    </div>

    <v-card-actions
      v-if="item.status === 'active'"
      class="d-flex flex-wrap justify-end"
    >
      <v-btn
        color="info"
        class="text-none"
        prepend-icon="mdi-weather-cloudy-clock"
        @click="handleShowHistory"
      >
        Histórico
      </v-btn>
      <v-btn
        color="warning"
        class="text-none"
        prepend-icon="mdi-pencil-outline"
        @click="showForm = true"
      >
        Editar
      </v-btn>
      <v-btn
        color="error"
        class="text-none"
        prepend-icon="mdi-delete-outline"
        @click="showDelete = true"
      >
        Apagar
      </v-btn>
    </v-card-actions>
    <v-card-actions v-else class="d-flex flex-wrap justify-end">
      <v-btn
        color="info"
        class="text-none"
        prepend-icon="mdi-reload-alert"
        @click="showRecover = true"
      >
        Recuperar
      </v-btn>
    </v-card-actions>
  </v-card>
  <Dialog
    title="CONFIRME"
    :dialog="showDelete"
    @cancel="showDelete = false"
    @confirm="handleDeleteItem"
    show-cancel
  >
    <div class="d-flex flex-column">
      <span>confirma a exclusão de {{ item.name }} ? </span>
      Valor: <strong>{{ amountFormated(item.value ?? 0, false) }}</strong>
    </div>
  </Dialog>

  <PackagesForm
    title="Pacote de serivços"
    :show="showForm"
    :data="item"
    @close="handleCloseForm"
    width="600"
  />
  <PackageHistory v-model="showHistory" />
  <Dialog
    title="CONFIRME"
    :dialog="showRecover"
    @cancel="showRecover = false"
    @confirm="handleRecoverItem"
    show-cancel
  >
    <div class="d-flex flex-column">
      <span>Confirma recuperar o pacote: {{ item.name }} ? </span>
      Valor: <strong>{{ amountFormated(item.value ?? 0, false) }}</strong>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object as PropType<ServicePackagesProps>,
    default: () => {},
  },
});

const emit = defineEmits(["update-status"]);

const consutationPackage = useServicePackageStore();
const { amountFormated } = useUtils();

const showForm = ref(false);
const showHistory = ref(false);
const showDelete = ref(false);
const showRecover = ref(false);
const loading = ref(false);

const handleDeleteItem = async () => {
  loading.value = true;
  try {
    emit("update-status");
    if (props.item.publicId) {
      await consutationPackage.destroy(props.item.publicId);
    }
    await consutationPackage.index("active");
  } catch (error) {
    console.log("🚀 ~ handleDeleteItem ~ error", error);
  } finally {
    loading.value = false;
    showDelete.value = false;
  }
};

const handleCloseForm = async () => {
  showForm.value = false;
  loading.value = true;
  try {
    emit("update-status");
    await consutationPackage.index("active");
  } finally {
    loading.value = false;
  }
};

const handleShowHistory = async () => {
  loading.value = true;
  showHistory.value = true;
  try {
    if (props.item.publicId) {
      await consutationPackage.getHistory(props.item.publicId);
    }
  } catch (error) {
    console.log("🚀 ~ handleDeleteItem ~ error", error);
  } finally {
    loading.value = false;
  }
};

const handleRecoverItem = async () => {
  loading.value = true;
  try {
    emit("update-status");
    if (props.item.publicId) {
      await consutationPackage.update({
        publicId: props.item.publicId,
        status: "active",
      });
    }
    await consutationPackage.index("active");
  } catch (error) {
    console.log("🚀 ~ handleRecoverItem ~ error", error);
  } finally {
    loading.value = false;
    showRecover.value = false;
  }
};
</script>
