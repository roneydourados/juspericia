<template>
  <v-card
    :disabled="loading"
    :loading="loading"
    class="mx-auto my-12"
    max-width="95%"
    rounded="xl"
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

    <v-card flat>
      <v-card-text>
        <v-img
          height="250"
          src="@/assets/images/package.avif"
          cover
          rounded="xl"
        />
      </v-card-text>
    </v-card>

    <v-card-item>
      <v-card-title>
        <span
          class="d-flex align-center justify-space-between"
          style="white-space: pre-line"
        >
          <span
            class="font-weight-bold text-primary text-truncate"
            style="
              font-size: 1.5rem;
              max-width: 80%;
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ item.name }}
          </span>

          <v-avatar size="30" color="primary">
            <v-icon color="colorIcon" icon="mdi-fire-circle" size="small" />
          </v-avatar>
        </span>
        <div class="text-caption text-primary">
          Expira em {{ item.dueDays }} dias a contar da data da compra
        </div>
      </v-card-title>
    </v-card-item>

    <v-card-text>
      <p
        class="text-justify text-darkText text-subtitle-2"
        style="white-space: pre-line"
      >
        {{ item.description }}
      </p>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-title>Preço</v-card-title>

    <div class="d-flex justify-space-between text-primary px-4 mb-2">
      <v-chip variant="tonal" color="grey">
        <span style="font-size: 1rem; font-weight: 500" class="text-primary">
          R$ {{ amountFormated(item.value ?? 0, false) }}
        </span>
      </v-chip>
      <span style="font-weight: 500">
        Atende {{ item.packageQuantity }} consultas
      </span>
    </div>

    <v-card-actions
      v-if="item.status === 'active'"
      class="d-flex flex-wrap justify-center pa-4"
    >
      <Button color="grey" variant="outlined" @click="handleShowHistory">
        <v-icon icon="mdi-weather-cloudy-clock" color="primary" start />
        <span class="text-caption text-primary"> Histórico </span>
      </Button>
      <Button color="grey" variant="outlined" @click="showForm = true">
        <v-icon icon="mdi-pencil-outline" color="colorIcon" start />
        <span class="text-caption text-primary"> Editar </span>
      </Button>
      <Button color="grey" variant="outlined" @click="showDelete = true">
        <v-icon icon="mdi-delete-outline" color="red" start />
        <span class="text-caption text-primary"> Apagar </span>
      </Button>
    </v-card-actions>
    <v-card-actions v-else class="d-flex flex-wrap justify-center">
      <Button color="grey" variant="outlined" @click="showRecover = true">
        <v-icon icon="mdi-reload-alert" color="colorIcon" start />
        <span class="text-caption text-primary"> Recuperar </span>
      </Button>
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
    await consutationPackage.index({ name: "", status: "active" });
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
    await consutationPackage.index({ name: "", status: "active" });
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
    await consutationPackage.index({ name: "", status: "active" });
  } catch (error) {
    console.log("🚀 ~ handleRecoverItem ~ error", error);
  } finally {
    loading.value = false;
    showRecover.value = false;
  }
};
</script>
