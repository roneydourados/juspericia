<template>
  <div class="d-flex justify-end align-center mb-2">
    <v-pagination
      v-model="page"
      :length="pageCount"
      color="primary"
      rounded="circle"
      density="comfortable"
    />
    <span class="text-caption text-primary">
      Pg. {{ page }} de {{ pageCount }}
    </span>
  </div>
  <CardBlur
    v-for="item in paginatedItems"
    :key="item.id"
    class="mb-2 text-primary"
    :hover="false"
    style="border-top: 3px solid #c8e040"
  >
    <template #title>
      <div>Dados do Paciente</div>
    </template>
    <template #content>
      <div class="d-flex flex-column">
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-outline" color="colorIcon" start />
            <strong>{{ item.name }} {{ item.surname }}</strong>
          </div>
          <v-btn
            icon
            color="colorIcon"
            variant="text"
            size="small"
            @click="emit('info', item.publicId)"
          >
            <v-icon icon="mdi-information-variant-circle-outline" size="20" />
          </v-btn>
        </div>
        <div class="d-flex align-center">
          <v-icon
            icon="mdi-clipboard-account-outline"
            color="colorIcon"
            start
          />
          <strong>{{ formatCPFOrCNPJ(item.cpf ?? "") }}</strong>
        </div>
        <div class="d-flex align-center">
          <v-icon icon="mdi-whatsapp" color="colorIcon" start />
          <strong>
            {{ formatTelephoneNumber(item.phone ?? "") }}
          </strong>
        </div>
        <v-divider class="mt-4"></v-divider>
      </div>
    </template>
    <template #actions>
      <div
        class="d-flex align-center justify-end mt-n8 w-100"
        style="gap: 0.5rem"
      >
        <v-btn
          icon
          color="colorIcon"
          variant="text"
          size="small"
          @click="emit('edit', item)"
        >
          <v-icon icon="mdi-pencil-outline" size="20"></v-icon>
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Editar
          </v-tooltip>
        </v-btn>
        <v-btn
          icon
          color="red"
          variant="text"
          size="small"
          @click="emit('delete', item)"
        >
          <v-icon icon="mdi-delete-outline" size="20"></v-icon>
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Apagar
          </v-tooltip>
        </v-btn>
      </div>
    </template>
  </CardBlur>
</template>

<script setup lang="ts">
const emit = defineEmits(["edit", "delete", "info"]);
const patientStore = usePatientStore();
const { formatCPFOrCNPJ, formatTelephoneNumber } = useUtils();
const $all = computed(() => patientStore.$all);

const itemsPerPage = ref(10);
const page = ref(1);

const paginatedItems = computed(() => {
  const all = $all.value || [];
  const start = (page.value - 1) * itemsPerPage.value;
  return all.slice(start, start + itemsPerPage.value);
});

const pageCount = computed(() => {
  const all = $all.value || [];

  if (all.length === 0) return all.length;

  return Math.ceil(all.length / itemsPerPage.value);
});
</script>
